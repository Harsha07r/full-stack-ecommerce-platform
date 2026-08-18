import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { getWishlist, addToWishlist, removeFromWishlist } from '../services/wishlistService';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const userId = user?._id;
  const [ids, setIds] = useState(new Set());
  const [activeUserId, setActiveUserId] = useState(userId);

  // Reset directly during render on account switch (same pattern
  // CartContext uses) so logging out never leaves the previous account's
  // wishlist visible for even one frame.
  if (userId !== activeUserId) {
    setIds(new Set());
    setActiveUserId(userId);
  }

  // Hydrate from the server whenever a user is logged in.
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    getWishlist()
      .then((products) => {
        if (!cancelled) setIds(new Set(products.map((p) => p.id)));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const isWishlisted = (productId) => ids.has(productId);

  // Updates the heart instantly, then syncs with the server; reverts on
  // failure so the UI never lies about what's actually saved.
  const toggle = async (productId) => {
    const wasWishlisted = ids.has(productId);
    setIds((prev) => {
      const next = new Set(prev);
      if (wasWishlisted) next.delete(productId);
      else next.add(productId);
      return next;
    });

    try {
      if (wasWishlisted) await removeFromWishlist(productId);
      else await addToWishlist(productId);
    } catch {
      setIds((prev) => {
        const next = new Set(prev);
        if (wasWishlisted) next.add(productId);
        else next.delete(productId);
        return next;
      });
    }
  };

  return (
    <WishlistContext.Provider value={{ isWishlisted, toggle }}>
      {children}
    </WishlistContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- hook belongs next to the context it reads
export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider');
  return ctx;
}
