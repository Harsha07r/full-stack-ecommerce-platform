import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import FormField from '../components/ui/FormField';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/orderService';
import { formatPrice } from '../utils/format';

const initialAddress = {
  fullName: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
};

export default function Checkout() {
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState(initialAddress);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setAddress((a) => ({ ...a, [e.target.name]: e.target.value }));

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1400px] px-5 py-32 text-center md:px-10">
        <h1 className="font-display text-4xl">Your bag is empty</h1>
        <p className="mt-3 text-sm text-muted">Add something before checking out.</p>
        <Button as={Link} to="/products" className="mt-8">
          Continue shopping
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const order = await createOrder({
        items: items.map((i) => ({
          product: i.id,
          name: i.name,
          image: i.image,
          price: i.price,
          size: i.size,
          quantity: i.quantity,
        })),
        shippingAddress: address,
        subtotal,
        shipping,
        total,
      });
      clearCart();
      navigate(`/order-confirmation/${order._id}`, { state: { order } });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-10">
      <h1 className="font-display text-4xl md:text-5xl">Checkout</h1>

      <form onSubmit={handleSubmit} className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-20" noValidate>
        <div className="space-y-5">
          <p className="text-[10px] uppercase tracking-[0.22em] text-muted">Shipping address</p>
          <FormField label="Full name" name="fullName" value={address.fullName} onChange={handleChange} required />
          <FormField label="Phone" type="tel" name="phone" value={address.phone} onChange={handleChange} required />
          <FormField label="Address line 1" name="line1" value={address.line1} onChange={handleChange} required />
          <FormField label="Address line 2 (optional)" name="line2" value={address.line2} onChange={handleChange} />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="City" name="city" value={address.city} onChange={handleChange} required />
            <FormField label="State" name="state" value={address.state} onChange={handleChange} required />
          </div>
          <FormField
            label="Postal code"
            name="postalCode"
            value={address.postalCode}
            onChange={handleChange}
            required
          />

          {error && <p className="text-sm text-sale">{error}</p>}
        </div>

        {/* SUMMARY */}
        <aside className="h-fit lg:sticky lg:top-32">
          <h2 className="text-[10px] uppercase tracking-[0.22em] text-muted">Order summary</h2>
          <ul className="mt-5 space-y-3 border-t border-line pt-5 text-sm">
            {items.map((item) => (
              <li key={item.key} className="flex justify-between gap-4">
                <span className="text-muted">
                  {item.name} × {item.quantity} ({item.size})
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-3 border-t border-line pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd>{shipping === 0 ? 'Complimentary' : formatPrice(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-base">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>

          <Button type="submit" disabled={submitting} className="mt-6 w-full">
            {submitting ? 'Placing order…' : 'Place order'}
          </Button>
        </aside>
      </form>
    </div>
  );
}
