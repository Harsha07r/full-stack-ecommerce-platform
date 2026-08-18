import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/product/ProductGrid';
import { CATEGORIES } from '../data/products';
import { totalStock } from '../utils/format';
import { useProducts } from '../hooks/useProducts';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Alphabetical' },
];

export default function ProductListing() {
  const { products, loading, error } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'All';

  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  const setCategory = (c) => {
    if (c === 'All') setSearchParams({});
    else setSearchParams({ category: c });
  };

  // Derived — recomputed every render from state + props
  const visible = products
    .filter((p) => activeCategory === 'All' || p.category === activeCategory)
    .filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()))
    .filter((p) => !inStockOnly || totalStock(p.sizes) > 0)
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-10">
      <header className="border-b border-line pb-8">
        <h1 className="font-display text-4xl md:text-5xl">
          {activeCategory === 'All' ? 'All Products' : activeCategory}
        </h1>
        <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted">
          {loading ? 'Loading…' : `${visible.length} ${visible.length === 1 ? 'piece' : 'pieces'}`}
        </p>
      </header>

      <div className="mt-8 grid gap-10 md:grid-cols-[200px_1fr] md:gap-14">
        {/* SIDEBAR */}
        <aside className="space-y-8">
          <div>
            <label className="mb-3 block text-[10px] uppercase tracking-[0.22em] text-muted">Search</label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pieces"
              className="w-full border border-line bg-surface px-3 py-2.5 text-base outline-none placeholder:text-muted focus:border-ink"
            />
          </div>

          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[0.22em] text-muted">Category</p>
            <ul className="space-y-2 text-base">
              {['All', ...CATEGORIES].map((c) => (
                <li key={c}>
                  <button
                    onClick={() => setCategory(c)}
                    className={`text-left transition-opacity hover:opacity-55 ${
                      activeCategory === c ? 'font-medium underline underline-offset-4' : 'text-muted'
                    }`}
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 text-base text-muted">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="h-3.5 w-3.5 accent-ink"
            />
            In stock only
          </label>
        </aside>

        {/* RESULTS */}
        <div>
          <div className="mb-8 flex items-center justify-between border-b border-line pb-3">
            <span className="text-[10px] uppercase tracking-[0.22em] text-muted">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent text-xs uppercase tracking-[0.16em] outline-none"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {loading && <p className="border border-line py-24 text-center text-base text-muted">Loading…</p>}
          {error && <p className="border border-line py-24 text-center text-base text-sale">{error}</p>}
          {!loading && !error && <ProductGrid products={visible} />}
        </div>
      </div>
    </div>
  );
}