import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'marlow_cart';

export function CartProvider({ children }) {
  // Lazy initialiser: reads localStorage once on mount, not every render
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist on every change — this is "cart persistence" from §2.4
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

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