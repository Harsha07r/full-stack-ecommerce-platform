import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import ProductGrid from '../components/product/ProductGrid';
import { getWishlist } from '../services/wishlistService';
import { useWishlist } from '../context/WishlistContext';

export default function Wishlist() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isWishlisted } = useWishlist();

  useEffect(() => {
    let cancelled = false;
    getWishlist()
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load your wishlist. Please try again.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Filtered live against the context's id set, so unhearting a product
  // here removes it immediately without a refetch.
  const visible = products.filter((p) => isWishlisted(p.id));

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-10">
      <h1 className="font-display text-4xl md:text-5xl">Wishlist</h1>

      {loading && <p className="mt-12 text-base text-muted">Loading…</p>}
      {error && <p className="mt-12 text-base text-sale">{error}</p>}

      {!loading && !error && visible.length === 0 && (
        <div className="mt-12 border border-line py-24 text-center">
          <p className="text-base text-muted">Nothing saved yet.</p>
          <Button as={Link} to="/products" className="mt-8">
            Start browsing
          </Button>
        </div>
      )}

      {!loading && !error && visible.length > 0 && (
        <div className="mt-10">
          <ProductGrid products={visible} />
        </div>
      )}
    </div>
  );
}
