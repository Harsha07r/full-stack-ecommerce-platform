import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import OrderTracker from '../components/order/OrderTracker';
import { getOrder } from '../services/orderService';
import { formatPrice } from '../utils/format';

export default function OrderConfirmation() {
  const { id } = useParams();
  const location = useLocation();
  const orderFromNavigation = location.state?.order ?? null;

  const [order, setOrder] = useState(orderFromNavigation);
  const [error, setError] = useState('');
  const loading = !order && !error;

  useEffect(() => {
    // Came here straight from checkout — the order was handed off via
    // navigation state, no need to refetch it.
    if (orderFromNavigation) return;

    let cancelled = false;
    getOrder(id)
      .then((data) => {
        if (!cancelled) setOrder(data);
      })
      .catch(() => {
        if (!cancelled) setError('Could not find that order.');
      });

    return () => {
      cancelled = true;
    };
  }, [id, orderFromNavigation]);

  if (loading) {
    return (
      <div className="mx-auto max-w-[1400px] px-5 py-32 text-center md:px-10">
        <p className="text-base text-muted">Loading…</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-[1400px] px-5 py-32 text-center md:px-10">
        <h1 className="font-display text-3xl">Order not found</h1>
        <Button as={Link} to="/" className="mt-8">
          Back to shop
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-20 text-center md:px-0">
      <p className="text-[10px] uppercase tracking-[0.22em] text-muted">Order confirmed</p>
      <h1 className="mt-3 font-display text-4xl">Thank you.</h1>
      <p className="mt-3 text-base text-muted">
        Order #{order._id.slice(-8).toUpperCase()} has been placed. We&rsquo;ll email you when it ships.
      </p>

      <ul className="mt-10 divide-y divide-line border-y border-line text-left">
        {order.items.map((item) => (
          <li key={`${item.product}__${item.size}`} className="flex justify-between gap-4 py-4 text-base">
            <span>
              {item.name} × {item.quantity} ({item.size})
            </span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </li>
        ))}
      </ul>

      <dl className="mt-6 space-y-2 text-left text-base">
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd>{formatPrice(order.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Shipping</dt>
          <dd>{order.shipping === 0 ? 'Complimentary' : formatPrice(order.shipping)}</dd>
        </div>
        <div className="flex justify-between border-t border-line pt-2 text-lg">
          <dt>Total</dt>
          <dd>{formatPrice(order.total)}</dd>
        </div>
      </dl>

      <div className="mt-10 border-t border-line pt-8 text-left">
        <p className="mb-5 text-[10px] uppercase tracking-[0.22em] text-muted">Order status</p>
        <OrderTracker status={order.status} />
      </div>

      <Button as={Link} to="/products" variant="outline" className="mt-2">
        Continue shopping
      </Button>
    </div>
  );
}
