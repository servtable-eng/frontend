import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import type { CustomerPlateItem } from '@/contexts/CustomerPlateContext';
import { useRestaurant } from '@/contexts/RestaurantContext';
import {
  clearCartStorage,
  loadCartFromStorage,
  saveCartToStorage,
} from '@/contexts/customerCartStorage';

export type CustomerCartExtra = {
  extraItemId: string;
  name: string;
  imageUrl: string;
  salePrice: number;
  quantity: number;
};

export type CustomerCartPlate = {
  id: string;
  plateItems: CustomerPlateItem[];
  extras: CustomerCartExtra[];
  buffetSubtotal: number;
  extrasSubtotal: number;
  total: number;
  createdAt: string;
};

export type CustomerCartPlateDraft = Omit<CustomerCartPlate, 'id' | 'createdAt'> & {
  id?: string;
  createdAt?: string;
};

export type CustomerCartPlateUpdate = Partial<Omit<CustomerCartPlate, 'id' | 'createdAt'>>;

type CustomerCartContextValue = {
  cartPlates: CustomerCartPlate[];
  extraQuantities: Record<string, number>;
  cartTotal: number;
  setExtraQuantities: Dispatch<SetStateAction<Record<string, number>>>;
  addPlateToCart: (plate: CustomerCartPlateDraft) => CustomerCartPlate;
  updateCartPlate: (plateId: string, plate: CustomerCartPlateUpdate) => void;
  removeCartPlate: (plateId: string) => void;
  clearCart: () => void;
};

const CustomerCartContext = createContext<CustomerCartContextValue | null>(null);

const createCartPlateId = () => `plate-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export function CustomerCartProvider({ children }: { children: ReactNode }) {
  const restaurant = useRestaurant();
  const [cartPlates, setCartPlates] = useState<CustomerCartPlate[]>([]);
  const [extraQuantities, setExtraQuantities] = useState<Record<string, number>>({});
  const [loadedRestaurantId, setLoadedRestaurantId] = useState('');
  const skipNextSaveRef = useRef(false);

  useEffect(() => {
    const storedCart = loadCartFromStorage(restaurant.id);

    setCartPlates(storedCart.cartPlates);
    setExtraQuantities(storedCart.extraQuantities);
    setLoadedRestaurantId(restaurant.id);
  }, [restaurant.id]);

  useEffect(() => {
    if (loadedRestaurantId !== restaurant.id) {
      return;
    }

    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false;
      return;
    }

    saveCartToStorage(restaurant.id, {
      cartPlates,
      extraQuantities,
    });
  }, [cartPlates, extraQuantities, loadedRestaurantId, restaurant.id]);

  const addPlateToCart = (plate: CustomerCartPlateDraft) => {
    const cartPlate: CustomerCartPlate = {
      ...plate,
      id: plate.id ?? createCartPlateId(),
      createdAt: plate.createdAt ?? new Date().toISOString(),
    };

    setCartPlates(prev => [...prev, cartPlate]);
    return cartPlate;
  };

  const updateCartPlate = (plateId: string, plate: CustomerCartPlateUpdate) => {
    setCartPlates(prev => prev.map(cartPlate => (
      cartPlate.id === plateId ? { ...cartPlate, ...plate } : cartPlate
    )));
  };

  const removeCartPlate = (plateId: string) => {
    setCartPlates(prev => prev.filter(cartPlate => cartPlate.id !== plateId));
  };

  const clearCart = useCallback(() => {
    skipNextSaveRef.current = true;
    setCartPlates([]);
    setExtraQuantities({});
    clearCartStorage(restaurant.id);
  }, [restaurant.id]);

  const value = useMemo<CustomerCartContextValue>(() => ({
    cartPlates,
    extraQuantities,
    cartTotal: cartPlates.reduce((sum, plate) => sum + plate.total, 0),
    setExtraQuantities,
    addPlateToCart,
    updateCartPlate,
    removeCartPlate,
    clearCart,
  }), [cartPlates, extraQuantities, clearCart]);

  return (
    <CustomerCartContext.Provider value={value}>
      {children}
    </CustomerCartContext.Provider>
  );
}

export function useCustomerCart() {
  const context = useContext(CustomerCartContext);

  if (!context) {
    throw new Error('useCustomerCart must be used within CustomerCartProvider.');
  }

  return context;
}
