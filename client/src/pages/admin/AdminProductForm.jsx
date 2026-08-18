import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField';
import { useCategories } from '../../hooks/useCategories';
import { getProduct, createProduct, updateProduct } from '../../services/productService';
import { SIZES } from '../../data/products';

const emptyForm = {
  name: '',
  colour: '',
  price: '',
  compareAtPrice: '',
  category: '',
  image: '',
  description: '',
  details: '',
};

export default function AdminProductForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { categories } = useCategories();

  const [form, setForm] = useState(emptyForm);
  const [sizeStock, setSizeStock] = useState(() => Object.fromEntries(SIZES.map((s) => [s, { offered: false, stock: '' }])));
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditing) return;
    let cancelled = false;

    getProduct(id)
      .then((product) => {
        if (cancelled) return;
        setForm({
          name: product.name,
          colour: product.colour,
          price: String(product.price),
          compareAtPrice: product.compareAtPrice != null ? String(product.compareAtPrice) : '',
          category: product.categoryId ?? '',
          image: product.image,
          description: product.description,
          details: product.details.join('\n'),
        });
        setSizeStock((prev) => {
          const next = { ...prev };
          for (const { size, stock } of product.sizes) {
            next[size] = { offered: true, stock: String(stock) };
          }
          return next;
        });
      })
      .catch(() => {
        if (!cancelled) setError('Could not load that product.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, isEditing]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const toggleSize = (size) =>
    setSizeStock((prev) => ({ ...prev, [size]: { ...prev[size], offered: !prev[size].offered } }));

  const setStock = (size, value) =>
    setSizeStock((prev) => ({ ...prev, [size]: { ...prev[size], stock: value } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const sizes = SIZES.filter((s) => sizeStock[s].offered).map((s) => ({
      size: s,
      stock: Number(sizeStock[s].stock) || 0,
    }));

    if (sizes.length === 0) {
      setError('Offer at least one size.');
      return;
    }
    if (!form.category) {
      setError('Choose a category.');
      return;
    }

    const payload = {
      name: form.name,
      colour: form.colour,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice === '' ? null : Number(form.compareAtPrice),
      category: form.category,
      image: form.image,
      description: form.description,
      details: form.details.split('\n').map((d) => d.trim()).filter(Boolean),
      sizes,
    };

    setSubmitting(true);
    try {
      if (isEditing) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save this product.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-muted">Loading…</p>;
  }

  return (
    <div>
      <Link to="/admin/products" className="text-[10px] uppercase tracking-[0.22em] text-muted hover:text-ink">
        ← Back to products
      </Link>

      <h1 className="mt-4 font-display text-3xl">{isEditing ? 'Edit product' : 'New product'}</h1>

      <form onSubmit={handleSubmit} className="mt-8 max-w-xl space-y-5" noValidate>
        <FormField label="Name" name="name" value={form.name} onChange={handleChange} required />
        <FormField label="Colour" name="colour" value={form.colour} onChange={handleChange} required />

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Price (₹)" type="number" min="0" name="price" value={form.price} onChange={handleChange} required />
          <FormField
            label="Compare-at price (₹, optional)"
            type="number"
            min="0"
            name="compareAtPrice"
            value={form.compareAtPrice}
            onChange={handleChange}
          />
        </div>

        <label className="block">
          <span className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-muted">Category</span>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-ink"
            required
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <FormField
          label="Image path"
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="/products/example.webp"
          required
        />

        <label className="block">
          <span className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-muted">Description</span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-ink"
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-muted">
            Details (one per line)
          </span>
          <textarea
            name="details"
            value={form.details}
            onChange={handleChange}
            rows={4}
            className="w-full border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-ink"
          />
        </label>

        <div>
          <span className="mb-3 block text-[10px] uppercase tracking-[0.22em] text-muted">Sizes &amp; stock</span>
          <div className="space-y-2">
            {SIZES.map((size) => (
              <div key={size} className="flex items-center gap-4">
                <label className="flex w-20 cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={sizeStock[size].offered}
                    onChange={() => toggleSize(size)}
                    className="h-3.5 w-3.5 accent-ink"
                  />
                  {size}
                </label>
                <input
                  type="number"
                  min="0"
                  disabled={!sizeStock[size].offered}
                  value={sizeStock[size].stock}
                  onChange={(e) => setStock(size, e.target.value)}
                  placeholder="Stock"
                  className="w-28 border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-ink disabled:bg-line disabled:text-muted"
                />
              </div>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-sale">{error}</p>}

        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : isEditing ? 'Save changes' : 'Create product'}
        </Button>
      </form>
    </div>
  );
}
