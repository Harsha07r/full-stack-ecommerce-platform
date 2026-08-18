import { useEffect, useState } from 'react';
import { getProducts } from '../services/productService';

export function useProducts(params = {}) {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: params.limit, total: 0, totalPages: 1 });
  const [error, setError] = useState('');

  // Re-fetch whenever any param actually changes value, not on every render
  // (params is a fresh object each render otherwise).
  const key = JSON.stringify(params);
  // Derived, not stored: loading exactly when the params we last fetched
  // for don't match the params being requested now (mirrors the
  // loadedId/id pattern ProductDetail.jsx uses for the same reason).
  const [loadedKey, setLoadedKey] = useState(null);
  const loading = loadedKey !== key;

  useEffect(() => {
    let cancelled = false;

    getProducts(params)
      .then(({ products, ...rest }) => {
        if (cancelled) return;
        setProducts(products);
        setMeta(rest);
        setError('');
        setLoadedKey(key);
      })
      .catch(() => {
        if (cancelled) return;
        setError('Could not load products. Please try again.');
        setLoadedKey(key);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` is the stable serialization of params
  }, [key]);

  return { products, loading, error, ...meta };
}
