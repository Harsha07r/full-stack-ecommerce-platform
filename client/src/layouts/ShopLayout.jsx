import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useCart } from '../context/CartContext';

export default function ShopLayout() {
  const { itemCount } = useCart();

  return (
    <>
      <Header cartCount={itemCount} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}