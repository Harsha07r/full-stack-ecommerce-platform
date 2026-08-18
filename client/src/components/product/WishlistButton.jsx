import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';

export default function WishlistButton({ productId, className = '' }) {
  const { isAuthenticated } = useAuth();
  const { isWishlisted, toggle } = useWishlist();
  const navigate = useNavigate();
  const active = isWishlisted(productId);

  // Cards wrap this in a <Link> to the product page — stop that navigation
  // so tapping the heart only toggles the wishlist.
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    toggle(productId);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`flex h-8 w-8 items-center justify-center rounded-full bg-paper/90 text-lg leading-none transition-colors hover:bg-paper ${className}`}
    >
      <span className={active ? 'text-sale' : 'text-ink'}>{active ? '♥' : '♡'}</span>
    </button>
  );
}
