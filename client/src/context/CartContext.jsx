import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);
const GUEST_KEY = 'marlow_cart_guest';
const cartKeyFor = (userId) => (userId ? `marlow_cart_${userId}` : GUEST_KEY);

function readCart(key) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// Combine two item lists, summing quantities for lines that share a key.
function mergeItems(a, b) {
  const merged = a.map((i) => ({ ...i }));
  for (const item of b) {
    const existing = merged.find((i) => i.key === item.key);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      merged.push(item);
    }
  }
  return merged;
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const userId = user?._id;

  // Lazy initialiser: reads the right cart (guest or this user's) once on mount
  const [items, setItems] = useState(() => readCart(cartKeyFor(userId)));
  const [activeUserId, setActiveUserId] = useState(userId);
  const guestKeyClearedFor = useRef(null);

  // Cart is scoped per account so logging out never leaves the previous
  // user's items visible, and logging back in restores that user's own
  // saved cart. Adjusting state directly during render — React's documented
  // pattern for resetting state when a prop/context value changes — avoids
  // the extra render pass a useEffect-based reset would cause. Whatever was
  // in the guest cart at login gets folded in too, since checkout requires
  // auth — a guest builds a cart, hits "checkout", gets sent to log in, and
  // shouldn't lose those items.
  if (userId !== activeUserId) {
    const nextItems = userId
      ? mergeItems(readCart(cartKeyFor(userId)), readCart(GUEST_KEY))
      : readCart(GUEST_KEY);
    setItems(nextItems);
    setActiveUserId(userId);
  }

  // Once merged into an account, the guest cart is consumed — clear it so a
  // future anonymous session on this browser doesn't inherit old items.
  useEffect(() => {
    if (userId && guestKeyClearedFor.current !== userId) {
      localStorage.removeItem(GUEST_KEY);
      guestKeyClearedFor.current = userId;
    }
  }, [userId]);

  // Persist on every change, under whichever key is currently active
  useEffect(() => {
    localStorage.setItem(cartKeyFor(userId), JSON.stringify(items));
  }, [items, userId]);

  // A line item is identified by product + size, not product alone
  const addItem = (product, size, quantity = 1) => {
    const key = `${product.id}__${size}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [
        ...prev,
        {
          key,
          id: product.id,
          name: product.name,
          colour: product.colour,
          price: product.price,
          image: product.image,
          size,
          quantity,
        },
      ];
    });
  };

  const removeItem = (key) => setItems((prev) => prev.filter((i) => i.key !== key));

  const updateQuantity = (key, quantity) => {
    if (quantity < 1) return removeItem(key);
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, quantity } : i)));
  };

  const clearCart = () => setItems([]);

  // Derived on every render — never stored in state
  const itemCount = items.reduce((n, i) => n + i.quantity, 0);
  const subtotal = items.reduce((n, i) => n + i.price * i.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= 5000 ? 0 : 199;
  const total = subtotal + shipping;

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal, shipping, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- hook belongs next to the context it reads
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
