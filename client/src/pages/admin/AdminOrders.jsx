import { useCallback, useEffect, useState } from 'react';
import { getOrders, updateOrderStatus } from '../../services/orderService';
import { formatPrice } from '../../utils/format';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const refresh = useCallback(() => {
    return getOrders()
      .then((data) => {
        setOrders(data);
        setError('');
      })
      .catch(() => setError('Could not load orders. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleStatusChange = async (order, status) => {
    setUpdatingId(order._id);
    try {
      const updated = await updateOrderStatus(order._id, status);
      setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
    } catch {
      setError('Could not update that order. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl">Orders</h1>

      {loading && <p className="mt-10 text-sm text-muted">Loading…</p>}
      {error && <p className="mt-10 text-sm text-sale">{error}</p>}

      {!loading && !error && orders.length === 0 && <p className="mt-10 text-sm text-muted">No orders yet.</p>}

      {!loading && !error && orders.length > 0 && (
        <div className="mt-10 overflow-x-auto border border-line">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-[10px] uppercase tracking-[0.16em] text-muted">
                <th className="p-4 font-normal">Order</th>
                <th className="p-4 font-normal">Customer</th>
                <th className="p-4 font-normal">Date</th>
                <th className="p-4 font-normal">Items</th>
                <th className="p-4 font-normal">Total</th>
                <th className="p-4 font-normal">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="p-4 font-medium">#{order._id.slice(-8).toUpperCase()}</td>
                  <td className="p-4 text-muted">
                    {order.user?.name}
                    <br />
                    <span className="text-xs">{order.user?.email}</span>
                  </td>
                  <td className="p-4 text-muted">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="p-4 text-muted">{order.items.length}</td>
                  <td className="p-4">{formatPrice(order.total)}</td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      disabled={updatingId === order._id}
                      onChange={(e) => handleStatusChange(order, e.target.value)}
                      className="border border-line bg-surface px-2 py-1.5 text-[11px] uppercase tracking-[0.1em] outline-none focus:border-ink"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
