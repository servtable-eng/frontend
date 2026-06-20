import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { Restaurant } from '@/types/restaurant';

type RestaurantContextValue = Restaurant;

const DEFAULT_RESTAURANT_NAME = 'Restaurante Sabor & Arte';

const RestaurantContext = createContext<RestaurantContextValue | null>(null);

function getConfiguredRestaurantName() {
  return (
    import.meta.env.VITE_RESTAURANT_NAME ??
    new URLSearchParams(window.location.search).get('restaurantName') ??
    window.localStorage.getItem('restaurantName') ??
    DEFAULT_RESTAURANT_NAME
  );
}

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const restaurant = useMemo<RestaurantContextValue>(() => ({
    id: "5e125073-383c-4edc-827b-372cf2c68ab7",
    name: getConfiguredRestaurantName(),
  }), []);

  return (
    <RestaurantContext.Provider value={restaurant}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const restaurant = useContext(RestaurantContext);
  if (!restaurant) {
    throw new Error('useRestaurant must be used within RestaurantProvider');
  }
  return restaurant;
}
