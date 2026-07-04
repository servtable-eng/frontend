import { useEffect, useState } from 'react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { getRestaurantSettings } from '@/services/restaurants/restaurantSettings.service';

export function useRestaurantPricePer100g() {
  const restaurant = useRestaurant();
  const [pricePer100g, setPricePer100g] = useState(restaurant.pricePer100g ?? 0);
  const [isLoadingPricePer100g, setIsLoadingPricePer100g] = useState(false);

  useEffect(() => {
    if (!restaurant.id) {
      setPricePer100g(restaurant.pricePer100g ?? 0);
      return;
    }

    if (typeof restaurant.pricePer100g === 'number' && restaurant.pricePer100g > 0) {
      setPricePer100g(restaurant.pricePer100g);
    }

    setIsLoadingPricePer100g(true);

    getRestaurantSettings(restaurant.id)
      .then(settings => setPricePer100g(settings.pricePer100g))
      .catch(() => setPricePer100g(restaurant.pricePer100g ?? 0))
      .finally(() => setIsLoadingPricePer100g(false));
  }, [restaurant.id, restaurant.pricePer100g]);

  return {
    pricePer100g,
    isLoadingPricePer100g,
  };
}
