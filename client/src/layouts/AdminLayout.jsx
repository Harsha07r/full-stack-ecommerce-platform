import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/orders', label: 'Orders' },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-5 md:px-10">
          <Link to="/admin/products" className="font-display text-xl tracking-[0.28em]">
            MARLOW <span className="text-muted">ADMIN</span>
          </Link>

          <nav className="flex gap-8 text-[11px] uppercase tracking-[0.16em]">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `transition-opacity duration-300 hover:opacity-55 ${isActive ? 'underline underline-offset-4' : 'text-muted'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-5 text-[11px] uppercase tracking-[0.16em]">
            <Link to="/" className="transition-opacity duration-300 hover:opacity-55">
              View store
            </Link>
            <button onClick={handleLogout} className="transition-opacity duration-300 hover:opacity-55">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-5 py-12 md:px-10">
        <Outlet />
      </main>
    </div>
  );
}
