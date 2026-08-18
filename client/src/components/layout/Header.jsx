import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../../data/products';
import { useAuth } from '../../context/AuthContext';

export default function Header({ cartCount = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-paper">
      <div className="bg-ink py-2 text-center text-[10px] uppercase tracking-[0.2em] text-paper">
        Complimentary shipping on orders over ₹5,000
      </div>

      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-5 md:px-10">
        <button className="text-lg lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>

        <Link to="/" className="font-display text-2xl tracking-[0.28em]">MARLOW</Link>

        <nav className="hidden gap-8 text-[11px] uppercase tracking-[0.16em] lg:flex">
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              to={`/products?category=${c}`}
              className="transition-opacity duration-300 hover:opacity-55"
            >
              {c}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5 text-[11px] uppercase tracking-[0.16em]">
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="hidden transition-opacity duration-300 hover:opacity-55 sm:inline">
                  Admin
                </Link>
              )}
              <Link to="/orders" className="hidden transition-opacity duration-300 hover:opacity-55 sm:inline">
                Orders
              </Link>
              <Link to="/wishlist" className="hidden transition-opacity duration-300 hover:opacity-55 sm:inline">
                Wishlist
              </Link>
              <button
                onClick={handleLogout}
                className="hidden transition-opacity duration-300 hover:opacity-55 sm:inline"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="hidden transition-opacity duration-300 hover:opacity-55 sm:inline">
              Account
            </Link>
          )}
          <Link to="/cart" className="transition-opacity duration-300 hover:opacity-55">
            Bag {cartCount > 0 && `(${cartCount})`}
          </Link>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-line px-5 pb-6 pt-2 lg:hidden">
          {CATEGORIES.map((c) => (
            <Link key={c} to={`/products?category=${c}`} className="block border-b border-line py-3.5 text-[11px] uppercase tracking-[0.16em]">
              {c}
            </Link>
          ))}
        </nav>
      )}

      <div className="border-b border-line" />
    </header>
  );
}
