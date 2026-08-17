import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { getProduct } from '../services/productService';
import { formatPrice, totalStock } from '../utils/format';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loadedId, setLoadedId] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [added, setAdded] = useState(false);

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

  if (loading) {
    return (
      <div className="mx-auto max-w-[1400px] px-5 py-32 text-center md:px-10">
        <p className="text-sm text-muted">Loading…</p>
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

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-8 md:px-10 md:py-12">
      <Link to="/products" className="text-[10px] uppercase tracking-[0.22em] text-muted hover:text-ink">
        ← Back
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2 md:gap-16">
        <div className="aspect-[3/4] overflow-hidden bg-line">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </div>

        <div className="md:pt-6">
          <p className="text-[10px] uppercase tracking-[0.22em] text-muted">{product.category}</p>
          <h1 className="mt-2 font-display text-3xl md:text-4xl">{product.name}</h1>
          <p className="mt-1 text-sm text-muted">{product.colour}</p>

          <div className="mt-4 flex items-baseline gap-3">
            <span className={`text-lg ${onSale ? 'text-sale' : ''}`}>{formatPrice(product.price)}</span>
            {onSale && <span className="text-sm text-muted line-through">{formatPrice(product.compareAtPrice)}</span>}
          </div>

          <p className="mt-6 max-w-[52ch] text-sm leading-relaxed text-muted">{product.description}</p>

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
                    className={`min-w-[52px] border px-4 py-2.5 text-xs uppercase tracking-[0.1em] transition-colors
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

          <ul className="mt-10 space-y-2 border-t border-line pt-6 text-xs text-muted">
            {product.details.map((d) => (
              <li key={d}>— {d}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}