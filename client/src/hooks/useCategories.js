import { useCallback, useEffect, useState } from 'react';
import { getCategories } from '../services/categoryService';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Only the initial mount shows a loading state (default true); later calls
  // (after create/delete) refetch silently so the list doesn't flash empty.
  const refresh = useCallback(() => {
    return getCategories()
      .then((data) => {
        setCategories(data);
        setError('');
      })
      .catch(() => setError('Could not load categories. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { categories, loading, error, refresh };
}
