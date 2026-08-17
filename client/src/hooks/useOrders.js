import { useEffect, useState } from 'react';
import { getMyOrders } from '../services/orderService';

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    getMyOrders()
      .then((data) => {
        if (!cancelled) setOrders(data);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load your orders. Please try again.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { orders, loading, error };
}
