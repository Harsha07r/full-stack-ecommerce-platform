import { CATEGORIES } from '../../data/products';

export default function Footer() {
  return (
    <footer className="mt-28 border-t border-line bg-paper">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10">
        {/* 1 col mobile → 4 cols desktop */}
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <p className="font-display text-xl tracking-[0.28em]">MARLOW</p>
            <p className="mt-4 max-w-[24ch] text-sm leading-relaxed text-muted">
              Considered pieces in natural fibres, made in small runs.
            </p>
          </div>

          <FooterColumn title="Shop" links={CATEGORIES} />
          <FooterColumn title="Help" links={['Shipping', 'Returns', 'Size Guide', 'Contact']} />
          <FooterColumn title="About" links={['Our Materials', 'Craft', 'Stockists']} />
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 text-[10px] uppercase tracking-[0.16em] text-muted md:flex-row md:justify-between">
          <span>© 2026 Marlow</span>
          <span>Made in India</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <p className="mb-4 text-[10px] uppercase tracking-[0.22em]">{title}</p>
      <ul className="space-y-2.5 text-sm text-muted">
        {links.map((l) => (
          <li key={l}>
            <a href="#" className="hover:text-ink">{l}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}