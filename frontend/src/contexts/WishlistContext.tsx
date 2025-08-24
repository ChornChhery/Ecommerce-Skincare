// contexts/WishlistContext.tsx
'use client';
import { createContext, useContext, useState } from 'react';

const WishlistContext = createContext<{
  wishlist: Set<number>;
  toggleWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
}>({
  wishlist: new Set(),
  toggleWishlist: () => {},
  isInWishlist: () => false,
});

export const useWishlist = () => useContext(WishlistContext);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());

  const toggleWishlist = (productId: number) => {
    setWishlist(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const isInWishlist = (productId: number) => wishlist.has(productId);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}