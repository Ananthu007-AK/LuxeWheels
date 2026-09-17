import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('lux_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('lux_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist:', e);
    }
  }, [wishlist]);

  const toggleWishlist = (car) => {
    if (!car) return;
    const carId = car._id || car.id;
    const exists = wishlist.some((item) => (item._id || item.id) === carId);

    if (exists) {
      setWishlist((prev) => prev.filter((item) => (item._id || item.id) !== carId));
      showToast(`${car.make} ${car.model} removed from favorites`, 'info');
    } else {
      setWishlist((prev) => [...prev, car]);
      showToast(`${car.make} ${car.model} added to favorites!`, 'success');
    }
  };

  const removeFromWishlist = (carId) => {
    if (!carId) return;
    setWishlist((prev) => prev.filter((item) => (item._id || item.id) !== carId));
    showToast('Vehicle removed from favorites', 'info');
  };

  const isWishlisted = (carId) => {
    if (!carId) return false;
    return wishlist.some((item) => (item._id || item.id) === carId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isWishlisted,
        isInWishlist: isWishlisted,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
