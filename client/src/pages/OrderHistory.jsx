import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useOrders } from '../hooks/useOrders';
import { formatPrice } from '../utils/format';

const STATUS_STYLES = {
  pending: 'border border-line text-muted',
  processing: 'border border-ink text-ink',
  shipped: 'bg-ink text-paper',
  delivered: 'bg-ink text-paper',
  cancelled: 'border border-sale text-sale',
};

export default function OrderHistory() {
  const { orders, loading, error } = useOrders();

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-10">
      <h1 className="font-display text-4xl md:text-5xl">Order history</h1>

      {loading && <p className="mt-12 text-base text-muted">Loading…</p>}
      {error && <p className="mt-12 text-base text-sale">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <div className="mt-12 border border-line py-24 text-center">
          <p className="text-base text-muted">You haven&rsquo;t placed any orders yet.</p>
          <Button as={Link} to="/products" className="mt-8">
            Start shopping
          </Button>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <ul className="mt-10 divide-y divide-line border-y border-line">
          {orders.map((order) => (
            <li key={order._id} className="py-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-base font-medium">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="mt-1 text-sm text-muted">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1.5 text-[10px] uppercase tracking-[0.16em] ${STATUS_STYLES[order.status]}`}
                >
                  {order.status}
                </span>
              </div>

              <ul className="mt-5 space-y-2 text-base text-muted">
                {order.items.map((item) => (
                  <li key={`${item.product}__${item.size}`} className="flex justify-between gap-4">
                    <span>
                      {item.name} × {item.quantity} ({item.size})
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex justify-between border-t border-line pt-3 text-base">
                <span className="text-muted">Total</span>
                <span className="font-medium">{formatPrice(order.total)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
