import { useEffect, useState } from 'react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { getRestaurantSettings } from '@/services/restaurants/restaurantSettings.service';

const priceCache = new Map<string, number>();

export function useRestaurantPricePer100g() {
  const restaurant = useRestaurant();
  const cachedPrice = restaurant.id ? priceCache.get(restaurant.id) : undefined;
  const initialPrice = cachedPrice ?? restaurant.pricePer100g ?? 0;
  const [pricePer100g, setPricePer100g] = useState(initialPrice);
  const [isLoadingPricePer100g, setIsLoadingPricePer100g] = useState(Boolean(restaurant.id && initialPrice <= 0));
  const [isRefreshingPricePer100g, setIsRefreshingPricePer100g] = useState(Boolean(restaurant.id && initialPrice > 0));

  useEffect(() => {
    let isActive = true;

    if (!restaurant.id) {
      setPricePer100g(restaurant.pricePer100g ?? 0);
      return;
    }

    if (typeof restaurant.pricePer100g === 'number' && restaurant.pricePer100g > 0) {
      setPricePer100g(restaurant.pricePer100g);
    }

    const hasUsablePrice = (priceCache.get(restaurant.id) ?? restaurant.pricePer100g ?? 0) > 0;
    setIsLoadingPricePer100g(!hasUsablePrice);
    setIsRefreshingPricePer100g(hasUsablePrice);

    getRestaurantSettings(restaurant.id)
      .then(settings => {
        if (!isActive) return;
        priceCache.set(restaurant.id, settings.pricePer100g);
        setPricePer100g(settings.pricePer100g);
      })
      .catch(() => {
        if (isActive) setPricePer100g(restaurant.pricePer100g ?? 0);
      })
      .finally(() => {
        if (!isActive) return;
        setIsLoadingPricePer100g(false);
        setIsRefreshingPricePer100g(false);
      });

    return () => {
      isActive = false;
    };
  }, [restaurant.id, restaurant.pricePer100g]);

  return {
    pricePer100g,
    isLoadingPricePer100g,
    isRefreshingPricePer100g,
  };
}
