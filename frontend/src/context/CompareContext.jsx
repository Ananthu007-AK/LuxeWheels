import React, { createContext, useContext, useState } from 'react';
import { useToast } from './ToastContext';

const CompareContext = createContext(null);

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();

  const addToCompare = (car) => {
    if (!car) return;
    const carId = car._id || car.id;
    const exists = compareList.some((c) => (c._id || c.id) === carId);

    if (exists) {
      removeFromCompare(carId);
      return;
    }

    if (compareList.length >= 3) {
      showToast('You can compare up to 3 vehicles at a time', 'info');
      return;
    }

    setCompareList((prev) => [...prev, car]);
    showToast(`${car.make} ${car.model} added to comparison!`, 'success');
  };

  const removeFromCompare = (carId) => {
    setCompareList((prev) => prev.filter((c) => (c._id || c.id) !== carId));
  };

  const clearCompare = () => {
    setCompareList([]);
    setIsModalOpen(false);
  };

  const isComparing = (carId) => {
    return compareList.some((c) => (c._id || c.id) === carId);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isComparing,
        isInCompare: isComparing,
        isModalOpen,
        setIsModalOpen,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};
