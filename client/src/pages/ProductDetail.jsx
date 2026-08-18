import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import FormField from '../components/ui/FormField';
import WishlistButton from '../components/product/WishlistButton';
import { getProduct } from '../services/productService';
import { getProductReviews, createReview, deleteReview } from '../services/reviewService';
import { formatPrice, totalStock } from '../utils/format';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const STARS = (n) => '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n));

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loadedId, setLoadedId] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [added, setAdded] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Derived, not stored: we're loading exactly when the id in the URL
  // hasn't been fetched yet — no separate "loading" flag to fall out of sync.
  const loading = loadedId !== id;

  useEffect(() => {
    let cancelled = false;

    getProduct(id)
      .then((data) => {
        if (cancelled) return;
        setProduct(data);
        setNotFound(false);
        setSelectedSize(null);
        setLoadedId(id);
      })
      .catch(() => {
        if (cancelled) return;
        setNotFound(true);
        setLoadedId(id);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Independent of the product fetch above — reviews load on their own
  // timeline and a failure here shouldn't block the rest of the page.
  useEffect(() => {
    let cancelled = false;

    getProductReviews(id).then((data) => {
      if (cancelled) return;
      setReviews(data.reviews);
      setAverageRating(data.averageRating);
      setReviewCount(data.count);
    });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-[1400px] px-5 py-32 text-center md:px-10">
        <p className="text-base text-muted">Loading…</p>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="mx-auto max-w-[1400px] px-5 py-32 text-center md:px-10">
        <h1 className="font-display text-3xl">Piece not found</h1>
        <Link to="/products" className="mt-6 inline-block text-[11px] uppercase tracking-[0.16em] underline underline-offset-4">
          Back to shop
        </Link>
      </div>
    );
  }

  const soldOut = totalStock(product.sizes) === 0;
  const onSale = Boolean(product.compareAtPrice);

  const handleAdd = () => {
    addItem(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const myReview = reviews.find((r) => r.user?._id === user?._id);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError('');
    setSubmitting(true);
    try {
      const review = await createReview(id, { rating, comment: comment.trim() });
      setReviews((prev) => [review, ...prev]);
      setReviewCount((prev) => prev + 1);
      setAverageRating((prev) => (prev * reviewCount + review.rating) / (reviewCount + 1));
      setRating(0);
      setComment('');
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Could not submit your review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    await deleteReview(myReview._id);
    setReviews((prev) => prev.filter((r) => r._id !== myReview._id));
    setReviewCount((prev) => {
      const next = prev - 1;
      setAverageRating((prevAvg) => (next === 0 ? 0 : (prevAvg * prev - myReview.rating) / next));
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-8 md:px-10 md:py-12">
      <Link to="/products" className="text-[10px] uppercase tracking-[0.22em] text-muted hover:text-ink">
        ← Back
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2 md:gap-16">
        <div className="relative aspect-[3/4] overflow-hidden bg-line">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          <WishlistButton productId={product.id} className="absolute right-3 top-3" />
        </div>

        <div className="md:pt-6">
          <p className="text-[10px] uppercase tracking-[0.22em] text-muted">{product.category}</p>
          <h1 className="mt-2 font-display text-3xl md:text-4xl">{product.name}</h1>
          <p className="mt-1 text-base text-muted">{product.colour}</p>

          <div className="mt-4 flex items-baseline gap-3">
            <span className={`text-xl ${onSale ? 'text-sale' : ''}`}>{formatPrice(product.price)}</span>
            {onSale && <span className="text-base text-muted line-through">{formatPrice(product.compareAtPrice)}</span>}
          </div>

          {reviewCount > 0 && (
            <p className="mt-2 text-sm text-muted">
              <span className="tracking-tight text-ink">{STARS(averageRating)}</span>{' '}
              {averageRating.toFixed(1)} · {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
            </p>
          )}

          <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-muted">{product.description}</p>

          {/* SIZE SELECTOR — out-of-stock sizes are disabled, not hidden */}
          <div className="mt-8">
            <p className="mb-3 text-[10px] uppercase tracking-[0.22em] text-muted">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(({ size, stock }) => {
                const disabled = stock === 0;
                const active = selectedSize === size;
                return (
                  <button
                    key={size}
                    disabled={disabled}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[52px] border px-4 py-2.5 text-sm uppercase tracking-[0.1em] transition-colors
                      ${active ? 'border-ink bg-ink text-paper' : 'border-line hover:border-ink'}
                      ${disabled ? 'cursor-not-allowed text-muted line-through opacity-40 hover:border-line' : ''}`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          <Button
            onClick={handleAdd}
            disabled={soldOut || !selectedSize}
            className="mt-8 w-full md:w-auto md:min-w-[280px]"
          >
            {soldOut ? 'Sold out' : added ? 'Added to bag ✓' : !selectedSize ? 'Select a size' : 'Add to bag'}
          </Button>

          <ul className="mt-10 space-y-2 border-t border-line pt-6 text-sm text-muted">
            {product.details.map((d) => (
              <li key={d}>— {d}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* REVIEWS — kept editorial: plain stars, no rating-widget library */}
      <div className="mx-auto mt-16 max-w-2xl border-t border-line pt-10">
        <p className="mb-6 text-[10px] uppercase tracking-[0.22em] text-muted">
          Reviews{reviewCount > 0 && ` (${reviewCount})`}
        </p>

        {!isAuthenticated && (
          <p className="text-sm text-muted">
            <Link to="/login" className="underline underline-offset-4 hover:text-ink">Log in</Link> to write a
            review.
          </p>
        )}

        {isAuthenticated && myReview && (
          <div className="flex items-start justify-between gap-4 border border-line p-5">
            <div>
              <p className="text-ink">{STARS(myReview.rating)}</p>
              <p className="mt-2 text-sm text-muted">{myReview.comment}</p>
            </div>
            <button
              onClick={handleDeleteReview}
              className="shrink-0 text-[10px] uppercase tracking-[0.16em] text-muted underline underline-offset-4 hover:text-ink"
            >
              Remove
            </button>
          </div>
        )}

        {isAuthenticated && !myReview && (
          <form onSubmit={handleSubmitReview} className="space-y-4 border border-line p-5">
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-muted">Your rating</p>
              <div className="flex gap-1 text-xl">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    aria-label={`${n} star${n > 1 ? 's' : ''}`}
                    className={n <= rating ? 'text-ink' : 'text-line hover:text-muted'}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <FormField
              as="textarea"
              label="Your review"
              rows={3}
              maxLength={500}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you think?"
              required
            />

            {reviewError && <p className="text-sm text-sale">{reviewError}</p>}

            <Button type="submit" disabled={submitting || rating === 0}>
              {submitting ? 'Submitting…' : 'Submit review'}
            </Button>
          </form>
        )}

        {reviews.length > 0 && (
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {reviews.map((r) => (
              <li key={r._id} className="py-5">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-ink">{STARS(r.rating)}</p>
                  <p className="text-sm text-muted">
                    {r.user?.name} · {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <p className="mt-2 text-base text-muted">{r.comment}</p>
              </li>
            ))}
          </ul>
        )}

        {reviewCount === 0 && (
          <p className="mt-8 text-sm text-muted">No reviews yet — be the first to share your thoughts.</p>
        )}
      </div>
    </div>
  );
}