import { apiRequest } from "../api";
import type { ClientDishDto, DishDto, DishPayload, RestaurantDishDto } from "../../types/dish";

export function getDishesForClient(restaurantId: string) {
  return apiRequest<ClientDishDto[]>(`/restaurants/${restaurantId}/client/dishes`);
}

export function getDishesForRestaurant(restaurantId: string) {
  return apiRequest<RestaurantDishDto[]>(`/restaurants/${restaurantId}/dishes`);
}

export function getDish(dishId: string) {
  return apiRequest<DishDto>(`/dishes/${dishId}`);
}

export function createDish(restaurantId: string, payload: DishPayload) {
  return apiRequest<DishDto>(`/restaurants/${restaurantId}/dishes`, {
    method: "POST",
    body: payload,
  });
}

export function updateDish(dishId: string, payload: DishPayload) {
  return apiRequest<DishDto>(`/dishes/${dishId}`, {
    method: "PUT",
    body: payload,
  });
}

export function enableDish(dishId: string) {
  return apiRequest<DishDto>(`/dishes/${dishId}/enable`, { method: "PATCH" });
}

export function disableDish(dishId: string) {
  return apiRequest<DishDto>(`/dishes/${dishId}/disable`, { method: "PATCH" });
}

export function deleteDish(dishId: string) {
  return apiRequest<void>(`/dishes/${dishId}`, { method: "DELETE" });
}
