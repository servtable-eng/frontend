import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { ClientDishDto } from '@/types/dish';
import type { PortionSize } from '@/types/order';

export type CustomerPlateItem = {
  dishId: string;
  name: string;
  description: string;
  imageUrl: string;
  portionSize: PortionSize;
  observation: string;
  quantity: number;
};

type CustomerPlateContextValue = {
  plateItems: CustomerPlateItem[];
  totalQuantity: number;
  setDishQuantity: (dish: ClientDishDto, quantity: number) => void;
  updateDishQuantity: (dish: ClientDishDto, delta: number) => void;
  updatePlateItem: (dishId: string, updates: Partial<Pick<CustomerPlateItem, 'portionSize' | 'observation'>>) => void;
  loadPlate: (items: CustomerPlateItem[]) => void;
  removePlateItem: (dishId: string) => void;
  clearPlate: () => void;
};

const CustomerPlateContext = createContext<CustomerPlateContextValue | null>(null);

export function CustomerPlateProvider({ children }: { children: ReactNode }) {
  const [plateItems, setPlateItems] = useState<CustomerPlateItem[]>([]);

  const setDishQuantity = (dish: ClientDishDto, quantity: number) => {
    setPlateItems(prev => {
      const nextQuantity = Math.max(0, quantity);
      const current = prev.find(item => item.dishId === dish.id);

      if (nextQuantity === 0) {
        return prev.filter(item => item.dishId !== dish.id);
      }

      const nextItem: CustomerPlateItem = {
        dishId: dish.id,
        name: dish.name,
        description: dish.description,
        imageUrl: dish.imageUrl,
        portionSize: current?.portionSize ?? 'MEDIUM',
        observation: current?.observation ?? '',
        quantity: nextQuantity,
      };

      if (!current) {
        return [...prev, nextItem];
      }

      return prev.map(item => (item.dishId === dish.id ? nextItem : item));
    });
  };

  const updateDishQuantity = (dish: ClientDishDto, delta: number) => {
    setPlateItems(prev => {
      const currentQuantity = prev.find(item => item.dishId === dish.id)?.quantity ?? 0;
      const nextQuantity = Math.max(0, currentQuantity + delta);

      if (nextQuantity === 0) {
        return prev.filter(item => item.dishId !== dish.id);
      }

      const current = prev.find(item => item.dishId === dish.id);
      const nextItem: CustomerPlateItem = {
        dishId: dish.id,
        name: dish.name,
        description: dish.description,
        imageUrl: dish.imageUrl,
        portionSize: current?.portionSize ?? 'MEDIUM',
        observation: current?.observation ?? '',
        quantity: nextQuantity,
      };

      if (!current) {
        return [...prev, nextItem];
      }

      return prev.map(item => (item.dishId === dish.id ? nextItem : item));
    });
  };

  const updatePlateItem = (
    dishId: string,
    updates: Partial<Pick<CustomerPlateItem, 'portionSize' | 'observation'>>,
  ) => {
    setPlateItems(prev => prev.map(item => (
      item.dishId === dishId ? { ...item, ...updates } : item
    )));
  };

  const removePlateItem = (dishId: string) => {
    setPlateItems(prev => prev.filter(item => item.dishId !== dishId));
  };

  const loadPlate = (items: CustomerPlateItem[]) => {
    setPlateItems(items);
  };

  const clearPlate = () => setPlateItems([]);

  const value = useMemo<CustomerPlateContextValue>(() => ({
    plateItems,
    totalQuantity: plateItems.reduce((total, item) => total + item.quantity, 0),
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
