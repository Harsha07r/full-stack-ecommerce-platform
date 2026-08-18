import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { getProducts, deleteProduct } from '../../services/productService';
import { formatPrice, totalStock } from '../../utils/format';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(() => {
    return getProducts({ limit: 100 })
      .then(({ products }) => {
        setProducts(products);
        setError('');
      })
      .catch(() => setError('Could not load products. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(product.id);
      await refresh();
    } catch {
      setError('Could not delete that product. Please try again.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Products</h1>
        <Button as={Link} to="/admin/products/new">
          New product
        </Button>
      </div>

      {loading && <p className="mt-10 text-base text-muted">Loading…</p>}
      {error && <p className="mt-10 text-base text-sale">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="mt-10 text-base text-muted">No products yet.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="mt-10 overflow-x-auto border border-line">
          <table className="w-full min-w-[720px] text-left text-base">
            <thead>
              <tr className="border-b border-line text-[10px] uppercase tracking-[0.16em] text-muted">
                <th className="p-4 font-normal">Product</th>
                <th className="p-4 font-normal">Category</th>
                <th className="p-4 font-normal">Price</th>
                <th className="p-4 font-normal">Stock</th>
                <th className="p-4 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {products.map((p) => {
                const stock = totalStock(p.sizes);
                return (
                  <tr key={p.id}>
                    <td className="flex items-center gap-3 p-4">
                      <img src={p.image} alt={p.name} className="h-14 w-11 shrink-0 bg-line object-cover" />
                      <span>{p.name}</span>
                    </td>
                    <td className="p-4 text-muted">{p.category}</td>
                    <td className="p-4">{formatPrice(p.price)}</td>
                    <td className={`p-4 ${stock === 0 ? 'text-sale' : ''}`}>{stock}</td>
                    <td className="p-4">
                      <div className="flex gap-3 text-[10px] uppercase tracking-[0.16em]">
                        <Link to={`/admin/products/${p.id}/edit`} className="underline underline-offset-4 hover:opacity-55">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(p)}
                          className="text-sale underline underline-offset-4 hover:opacity-70"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
