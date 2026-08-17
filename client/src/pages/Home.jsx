import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import SectionHeader from '../components/ui/SectionHeader';
import ProductGrid from '../components/product/ProductGrid';
import { PRODUCTS, CATEGORIES } from '../data/products';

export default function Home() {
  return (
    <>
      {/* ── HERO — text bottom-left, not centred ── */}
      <section className="relative h-[78vh] min-h-[480px] w-full overflow-hidden bg-line">
        <img src="/products/hero.webp" alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />

        <div className="absolute bottom-10 left-5 max-w-lg md:bottom-16 md:left-10">
          <p className="mb-3 text-[10px] uppercase tracking-[0.22em] text-paper/80">
            Autumn / Winter 2026
          </p>
          <h1 className="font-display text-5xl leading-[0.95] text-paper md:text-7xl">
            Quiet clothes,<br />built to last.
          </h1>
          <Link to="/products" className="mt-8 inline-block">
            <Button className="bg-paper text-ink hover:bg-paper/85">
              Shop the collection
            </Button>
          </Link>
        </div>
      </section>

      {/* ── CATEGORIES — scroll strip on mobile, 5-up grid on desktop ── */}
      <section className="mx-auto max-w-[1400px] px-5 py-20 md:px-10">
        <SectionHeader eyebrow="Browse" title="Categories" />
        <div className="flex snap-x gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-5 md:overflow-visible">
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              to={`/products?category=${c}`}
              className="group w-[62%] shrink-0 snap-start md:w-auto"
            >
              <div className="aspect-[3/4] overflow-hidden bg-line">
                <img
                  src={`/products/category-${c.toLowerCase()}.webp`}
                  alt={c}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <p className="mt-3 text-[11px] uppercase tracking-[0.16em]">{c}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED — reuses ProductGrid ── */}
      <section className="mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionHeader
          eyebrow="Just landed"
          title="New Arrivals"
          action={
            <Link to="/products">
              <Button variant="ghost">View all</Button>
            </Link>
          }
        />
        <ProductGrid products={PRODUCTS.slice(0, 4)} />
      </section>

      {/* ── EDITORIAL — 7/5 split, deliberately uneven ── */}
      <section className="mx-auto mt-28 grid max-w-[1400px] items-center gap-10 px-5 md:grid-cols-12 md:px-10">
        <div className="md:col-span-7">
          <div className="aspect-[4/3] overflow-hidden bg-line">
            <img src="/products/editorial.webp" alt="" className="h-full w-full object-cover" />
          </div>
        </div>
        <div className="md:col-span-5 md:pl-6">
          <p className="mb-3 text-[10px] uppercase tracking-[0.22em] text-muted">Our materials</p>
          <h2 className="font-display text-3xl leading-tight md:text-4xl">
            Wool, linen, cotton.<br />Nothing else.
          </h2>
          <p className="mt-5 max-w-[46ch] text-sm leading-relaxed text-muted">
            Every piece is cut from natural fibre and produced in runs of under two hundred.
            We would rather sell out than overproduce.
          </p>
          <Link to="/products" className="mt-8 inline-block">
            <Button variant="outline">Read more</Button>
          </Link>
        </div>
      </section>
    </>
  );
}