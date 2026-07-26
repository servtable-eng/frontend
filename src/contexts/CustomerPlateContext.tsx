import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import type { ClientDishDto } from '@/types/dish';
import { createPlateItem, ensurePlateItemId, normalizePortionWeight } from './customerPlateItems';

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
  addPlateItem: (item: CustomerPlateItem) => void;
  replacePlateItemByDishId: (dishId: string, item: CustomerPlateItem) => void;
  setDishQuantity: (dish: ClientDishDto, quantity: number) => void;
  updateDishQuantity: (dish: ClientDishDto, delta: number) => void;
  updatePlateItem: (dishId: string, updates: Partial<Pick<CustomerPlateItem, 'portionWeightInGrams' | 'hasConfirmedWeight' | 'observation'>>) => void;
  loadPlate: (items: CustomerPlateItem[]) => void;
  removePlateItem: (dishId: string) => void;
  clearPlate: () => void;
};

const CustomerPlateContext = createContext<CustomerPlateContextValue | null>(null);

export function CustomerPlateProvider({ children }: { children: ReactNode }) {
  const [plateItems, setPlateItems] = useState<CustomerPlateItem[]>([]);

  const addPlateItem = (item: CustomerPlateItem) => {
    setPlateItems(prev => [...prev, item]);
  };

  const replacePlateItemByDishId = (dishId: string, item: CustomerPlateItem) => {
    setPlateItems(prev => prev.map(current => current.dishId === dishId ? item : current));
  };

  const setDishQuantity = (dish: ClientDishDto, quantity: number) => {
    setPlateItems(prev => {
      const nextQuantity = Math.max(0, quantity);
      const currentItem = prev.find(item => item.dishId === dish.id);
      const otherItems = prev.filter(item => item.dishId !== dish.id);

      if (nextQuantity === 0) {
        return otherItems;
      }

      return [...otherItems, currentItem ?? createPlateItem(dish, dish.recommendedWeightInGrams)];
    });
  };

  const updateDishQuantity = (dish: ClientDishDto, delta: number) => {
    setPlateItems(prev => {
      if (delta > 0) {
        if (prev.some(item => item.dishId === dish.id)) return prev;
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
    const seenDishIds = new Set<string>();
    setPlateItems(items
      .filter(item => {
        if (seenDishIds.has(item.dishId)) return false;
        seenDishIds.add(item.dishId);
        return true;
      })
      .map(item => ({
        ...item,
        id: ensurePlateItemId(item),
        quantity: 1,
        hasConfirmedWeight: item.hasConfirmedWeight ?? true,
        portionWeightInGrams: normalizePortionWeight(item.portionWeightInGrams),
      })));
  };

  const clearPlate = useCallback(() => setPlateItems([]), []);

  const value: CustomerPlateContextValue = {
    plateItems,
    totalQuantity: plateItems.reduce((total, item) => total + item.quantity, 0),
    addPlateItem,
    replacePlateItemByDishId,
    setDishQuantity,
    updateDishQuantity,
    updatePlateItem,
    loadPlate,
    removePlateItem,
    clearPlate,
  };

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
