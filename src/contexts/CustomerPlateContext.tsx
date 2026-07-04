import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { ClientDishDto } from '@/types/dish';

const MIN_PORTION_WEIGHT = 25;
const MAX_PORTION_WEIGHT = 1000;
const PORTION_WEIGHT_STEP = 25;

function normalizePortionWeight(value: unknown) {
  const numericValue = typeof value === 'number' && Number.isFinite(value) ? value : 250;
  const clampedValue = Math.min(MAX_PORTION_WEIGHT, Math.max(MIN_PORTION_WEIGHT, numericValue));

  return Math.round(clampedValue / PORTION_WEIGHT_STEP) * PORTION_WEIGHT_STEP;
}

export type CustomerPlateItem = {
  id: string;
  dishId: string;
  name: string;
  description: string;
  imageUrl: string;
  portionWeightInGrams: number;
  hasConfirmedWeight: boolean;
  observation: string;
  quantity: number;
};

type CustomerPlateContextValue = {
  plateItems: CustomerPlateItem[];
  totalQuantity: number;
  addDishPortion: (dish: ClientDishDto, portionWeightInGrams: number, observation?: string) => void;
  setDishQuantity: (dish: ClientDishDto, quantity: number) => void;
  updateDishQuantity: (dish: ClientDishDto, delta: number) => void;
  updatePlateItem: (dishId: string, updates: Partial<Pick<CustomerPlateItem, 'portionWeightInGrams' | 'hasConfirmedWeight' | 'observation'>>) => void;
  loadPlate: (items: CustomerPlateItem[]) => void;
  removePlateItem: (dishId: string) => void;
  clearPlate: () => void;
};

const CustomerPlateContext = createContext<CustomerPlateContextValue | null>(null);

const createPlateItemId = () => `plate-item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

function createPlateItem(dish: ClientDishDto, portionWeightInGrams: number, observation = ''): CustomerPlateItem {
  return {
    id: createPlateItemId(),
    dishId: dish.id,
    name: dish.name,
    description: dish.description,
    imageUrl: dish.imageUrl,
    portionWeightInGrams: normalizePortionWeight(portionWeightInGrams),
    hasConfirmedWeight: true,
    observation,
    quantity: 1,
  };
}

export function CustomerPlateProvider({ children }: { children: ReactNode }) {
  const [plateItems, setPlateItems] = useState<CustomerPlateItem[]>([]);

  const addDishPortion = (dish: ClientDishDto, portionWeightInGrams: number, observation = '') => {
    setPlateItems(prev => [...prev, createPlateItem(dish, portionWeightInGrams, observation)]);
  };

  const setDishQuantity = (dish: ClientDishDto, quantity: number) => {
    setPlateItems(prev => {
      const nextQuantity = Math.max(0, quantity);
      const currentItems = prev.filter(item => item.dishId === dish.id);
      const otherItems = prev.filter(item => item.dishId !== dish.id);

      if (nextQuantity === 0) {
        return otherItems;
      }

      const existingItems = currentItems.slice(0, nextQuantity);
      const missingItems = Array.from(
        { length: Math.max(0, nextQuantity - existingItems.length) },
        () => createPlateItem(dish, dish.recommendedWeightInGrams),
      );

      return [...otherItems, ...existingItems, ...missingItems];
    });
  };

  const updateDishQuantity = (dish: ClientDishDto, delta: number) => {
    setPlateItems(prev => {
      if (delta > 0) {
        return [...prev, createPlateItem(dish, dish.recommendedWeightInGrams)];
      }

      const lastIndex = prev.map(item => item.dishId).lastIndexOf(dish.id);
      if (lastIndex < 0) return prev;

      return prev.filter((_, index) => index !== lastIndex);
    });
  };

  const updatePlateItem = (
    dishId: string,
    updates: Partial<Pick<CustomerPlateItem, 'portionWeightInGrams' | 'hasConfirmedWeight' | 'observation'>>,
  ) => {
    setPlateItems(prev => prev.map(item => (
      item.id === dishId ? { ...item, ...updates } : item
    )));
  };

  const removePlateItem = (dishId: string) => {
    setPlateItems(prev => prev.filter(item => item.id !== dishId));
  };

  const loadPlate = (items: CustomerPlateItem[]) => {
    setPlateItems(items.map(item => ({
      ...item,
      id: item.id ?? createPlateItemId(),
      quantity: item.quantity ?? 1,
      hasConfirmedWeight: item.hasConfirmedWeight ?? true,
      portionWeightInGrams: normalizePortionWeight(item.portionWeightInGrams),
    })));
  };

  const clearPlate = () => setPlateItems([]);

  const value = useMemo<CustomerPlateContextValue>(() => ({
    plateItems,
    totalQuantity: plateItems.reduce((total, item) => total + item.quantity, 0),
    addDishPortion,
    setDishQuantity,
    updateDishQuantity,
    updatePlateItem,
    loadPlate,
    removePlateItem,
    clearPlate,
  }), [plateItems]);

  return (
    <CustomerPlateContext.Provider value={value}>
      {children}
    </CustomerPlateContext.Provider>
  );
}

export function useCustomerPlate() {
  const context = useContext(CustomerPlateContext);

  if (!context) {
    throw new Error('useCustomerPlate must be used within CustomerPlateProvider.');
  }

  return context;
}
