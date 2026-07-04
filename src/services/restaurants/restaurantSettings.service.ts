import { apiRequest } from '@/services/api';
import type { RestaurantSettings } from '@/types/restaurant';

export function getRestaurantSettings(restaurantId: string) {
  return apiRequest<RestaurantSettings>(`/restaurants/${restaurantId}/settings`);
}

export function updateRestaurantPricePer100g(restaurantId: string, pricePer100g: number) {
  return apiRequest<RestaurantSettings>(`/restaurants/${restaurantId}/settings/price-per-100g`, {
    method: 'PATCH',
    body: { pricePer100g },
  });
}
