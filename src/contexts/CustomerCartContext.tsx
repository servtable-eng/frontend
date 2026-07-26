import { createContext, useCallback, useContext, useEffect, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { useLocation } from 'react-router-dom';
import { useCustomerPlate, type CustomerPlateItem } from '@/contexts/CustomerPlateContext';
import { createPlateItem } from '@/contexts/customerPlateItems';
import { useRestaurant } from '@/contexts/RestaurantContext';
import type { ClientDishDto } from '@/types/dish';
import { calculatePlateBuffetSubtotal } from '@/utils/buffetPricing';
import { useRestaurantPricePer100g } from '@/hooks/useRestaurantPricePer100g';
import { PlateItemConflictDialog } from '@/components/customer/PlateItemConflictDialog';
import { showSuccess } from '@/components/ToastProvider';
import {
  clearCartStorage,
  loadCartFromStorage,
  removeDuplicateDishItems,
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

export type AddPlateItemResult =
  | { status: 'added' }
  | { status: 'conflict'; existingItem: CustomerPlateItem; incomingItem: CustomerPlateItem };

type PlateItemConflict = {
  existingItem: CustomerPlateItem;
  incomingItem: CustomerPlateItem;
  source: { type: 'current-plate' } | { type: 'cart'; cartPlateId: string };
};

type CustomerCartContextValue = {
  cartPlates: CustomerCartPlate[];
  extraQuantities: Record<string, number>;
  cartTotal: number;
  setExtraQuantities: Dispatch<SetStateAction<Record<string, number>>>;
  plateItemConflict: PlateItemConflict | null;
  requestAddPlateItem: (dish: ClientDishDto, portionWeightInGrams: number, observation?: string) => AddPlateItemResult;
  resolvePlateItemConflict: (choice: 'keep-existing' | 'replace-with-incoming') => void;
  dismissPlateItemConflict: () => void;
  addPlateToCart: (plate: CustomerCartPlateDraft) => CustomerCartPlate;
  updateCartPlate: (plateId: string, plate: CustomerCartPlateUpdate) => void;
  removeCartPlate: (plateId: string) => void;
  clearCart: () => void;
};

const CustomerCartContext = createContext<CustomerCartContextValue | null>(null);

const createCartPlateId = () => `plate-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export function CustomerCartProvider({ children }: { children: ReactNode }) {
  const restaurant = useRestaurant();
  const location = useLocation();
  const { pricePer100g } = useRestaurantPricePer100g();
  const { plateItems, addPlateItem, replacePlateItemByDishId } = useCustomerPlate();
  const [cartPlates, setCartPlates] = useState<CustomerCartPlate[]>([]);
  const [extraQuantities, setExtraQuantities] = useState<Record<string, number>>({});
  const [loadedRestaurantId, setLoadedRestaurantId] = useState('');
  const [plateItemConflict, setPlateItemConflict] = useState<PlateItemConflict | null>(null);
  const skipNextSaveRef = useRef(false);
  const previousPathnameRef = useRef(location.pathname);

  useEffect(() => {
    const storedCart = loadCartFromStorage(restaurant.id);

    setCartPlates(storedCart.cartPlates);
    setExtraQuantities(storedCart.extraQuantities);
    setLoadedRestaurantId(restaurant.id);
  }, [restaurant.id]);

  useEffect(() => {
    if (previousPathnameRef.current !== location.pathname) {
      setPlateItemConflict(null);
      previousPathnameRef.current = location.pathname;
    }
  }, [location.pathname]);

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

    setCartPlates(prev => removeDuplicateDishItems([...prev, cartPlate]));
    return cartPlate;
  };

  const requestAddPlateItem = (
    dish: ClientDishDto,
    portionWeightInGrams: number,
    observation = '',
  ): AddPlateItemResult => {
    const incomingItem = createPlateItem(dish, portionWeightInGrams, observation);
    const currentPlateItem = plateItems.find(item => item.dishId === incomingItem.dishId);

    if (currentPlateItem) {
      setPlateItemConflict({
        existingItem: currentPlateItem,
        incomingItem,
        source: { type: 'current-plate' },
      });
      return { status: 'conflict', existingItem: currentPlateItem, incomingItem };
    }

    for (const cartPlate of cartPlates) {
      const existingItem = cartPlate.plateItems.find(item => item.dishId === incomingItem.dishId);
      if (existingItem) {
        setPlateItemConflict({
          existingItem,
          incomingItem,
          source: { type: 'cart', cartPlateId: cartPlate.id },
        });
        return { status: 'conflict', existingItem, incomingItem };
      }
    }

    addPlateItem(incomingItem);
    return { status: 'added' };
  };

  const dismissPlateItemConflict = () => setPlateItemConflict(null);

  const resolvePlateItemConflict = (choice: 'keep-existing' | 'replace-with-incoming') => {
    if (!plateItemConflict) return;

    if (choice === 'replace-with-incoming') {
      const { incomingItem, source } = plateItemConflict;
      if (source.type === 'current-plate') {
        replacePlateItemByDishId(incomingItem.dishId, incomingItem);
      } else {
        setCartPlates(prev => prev.map(cartPlate => {
          if (cartPlate.id !== source.cartPlateId) return cartPlate;
          const nextItems = cartPlate.plateItems.map(item => (
            item.dishId === incomingItem.dishId ? incomingItem : item
          ));
          const buffetSubtotal = calculatePlateBuffetSubtotal(nextItems, pricePer100g);
          return {
            ...cartPlate,
            plateItems: nextItems,
            buffetSubtotal,
            total: buffetSubtotal + cartPlate.extrasSubtotal,
          };
        }));
      }
      showSuccess('O prato foi atualizado com a nova seleção.');
    } else {
      showSuccess('O prato já adicionado foi mantido.');
    }

    setPlateItemConflict(null);
  };

  const updateCartPlate = (plateId: string, plate: CustomerCartPlateUpdate) => {
    setCartPlates(prev => removeDuplicateDishItems(prev.map(cartPlate => (
      cartPlate.id === plateId ? { ...cartPlate, ...plate } : cartPlate
    ))));
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

  const value: CustomerCartContextValue = {
    cartPlates,
    extraQuantities,
    cartTotal: cartPlates.reduce((sum, plate) => sum + plate.total, 0),
    setExtraQuantities,
    plateItemConflict,
    requestAddPlateItem,
    resolvePlateItemConflict,
    dismissPlateItemConflict,
    addPlateToCart,
    updateCartPlate,
    removeCartPlate,
    clearCart,
  };

  return (
    <CustomerCartContext.Provider value={value}>
      {children}
      <PlateItemConflictDialog
        conflict={plateItemConflict}
        onKeepExisting={() => resolvePlateItemConflict('keep-existing')}
        onReplace={() => resolvePlateItemConflict('replace-with-incoming')}
        onDismiss={dismissPlateItemConflict}
      />
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
