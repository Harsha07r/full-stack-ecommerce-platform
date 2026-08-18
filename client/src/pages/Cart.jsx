import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal, shipping, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1400px] px-5 py-32 text-center md:px-10">
        <h1 className="font-display text-4xl">Your bag is empty</h1>
        <p className="mt-3 text-base text-muted">Nothing here yet.</p>
        <Link to="/products" className="mt-8 inline-block">
          <Button>Continue shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-10">
      <h1 className="font-display text-4xl md:text-5xl">Bag</h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-20">
        <ul className="divide-y divide-line border-y border-line">
          {items.map((item) => (
            <li key={item.key} className="flex gap-5 py-6">
              <Link to={`/products/${item.id}`} className="w-24 shrink-0 sm:w-28">
                <div className="aspect-[3/4] overflow-hidden bg-line">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
              </Link>

              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <div className="flex justify-between gap-4">
                    <Link to={`/products/${item.id}`} className="text-base font-medium hover:opacity-55">
                      {item.name}
                    </Link>
                    <span className="text-base">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{item.colour} · Size {item.size}</p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center border border-line">
                    <button
                      onClick={() => updateQuantity(item.key, item.quantity - 1)}
                      className="px-3 py-1.5 text-base hover:bg-line"
                    >
                      −
                    </button>
                    <span className="min-w-[36px] text-center text-base">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.key, item.quantity + 1)}
                      className="px-3 py-1.5 text-base hover:bg-line"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.key)}
                    className="text-[10px] uppercase tracking-[0.16em] text-muted underline underline-offset-4 hover:text-ink"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* SUMMARY */}
        <aside className="h-fit lg:sticky lg:top-32">
          <h2 className="text-[10px] uppercase tracking-[0.22em] text-muted">Summary</h2>
          <dl className="mt-5 space-y-3 border-t border-line pt-5 text-base">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd>{shipping === 0 ? 'Complimentary' : formatPrice(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-lg">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>

          {shipping > 0 && (
            <p className="mt-3 text-sm text-muted">
              Add {formatPrice(5000 - subtotal)} more for free shipping.
            </p>
          )}

          <Link to="/checkout" className="mt-6 block">
            <Button className="w-full">Checkout</Button>
          </Link>
        </aside>
      </div>
    </div>
  );
}