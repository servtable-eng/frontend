import { apiRequest } from '../api';
import type { RestaurantDashboard } from '@/types/dashboard';

export function getRestaurantDashboard(restaurantId: string) {
  return apiRequest<RestaurantDashboard>(`/restaurants/${restaurantId}/dashboard`);
}
