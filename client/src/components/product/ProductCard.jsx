import { Link } from 'react-router-dom';
import { formatPrice, totalStock } from '../../utils/format';

export default function ProductCard({ product }) {
  const soldOut = totalStock(product.sizes) === 0;
  const onSale = Boolean(product.compareAtPrice);

  return (
    <Link to={`/products/${product.id}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-line">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        {soldOut && (
          <span className="absolute left-0 top-0 bg-ink px-2.5 py-1.5 text-[10px] uppercase tracking-[0.16em] text-paper">
            Sold out
          </span>
        )}
        {onSale && !soldOut && (
          <span className="absolute left-0 top-0 bg-sale px-2.5 py-1.5 text-[10px] uppercase tracking-[0.16em] text-white">
            Sale
          </span>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-ink/30 to-transparent py-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <span className="text-[10px] uppercase tracking-[0.22em] text-paper">View Product</span>
        </div>
      </div>

      <div className="pt-3">
        <h3 className="text-sm font-medium leading-snug">{product.name}</h3>
        <p className="mt-0.5 text-xs text-muted">{product.colour}</p>
        <div className="mt-1.5 flex items-baseline gap-2 text-sm">
          <span className={onSale ? 'text-sale' : ''}>{formatPrice(product.price)}</span>
          {onSale && <span className="text-xs text-muted line-through">{formatPrice(product.compareAtPrice)}</span>}
        </div>
      </div>
    </Link>
  );
}