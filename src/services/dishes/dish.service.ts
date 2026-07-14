import { apiRequest } from "../api";
import type { ClientDishDto, DishAddStockPayload, DishDto, DishPayload, DishStockPayload, RestaurantDishDto } from "../../types/dish";

export function getDishesForClient(restaurantId: string) {
  return apiRequest<ClientDishDto[]>(`/restaurants/${restaurantId}/client/dishes`);
}

export function getDishesForRestaurant(restaurantId: string) {
  return apiRequest<RestaurantDishDto[]>(`/restaurants/${restaurantId}/dishes`);
}

export function getDish(dishId: string) {
  return apiRequest<DishDto>(`/dishes/${dishId}`);
}

function createDishFormData(payload: DishPayload, imageFile?: File | null) {
  const formData = new FormData();
  formData.append('dish', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
  if (imageFile) formData.append('image', imageFile);
  return formData;
}

export function createDish(restaurantId: string, payload: DishPayload, imageFile?: File | null) {
  return apiRequest<DishDto>(`/restaurants/${restaurantId}/dishes`, {
    method: "POST",
    body: createDishFormData(payload, imageFile),
  });
}

export function updateDish(dishId: string, payload: DishPayload, imageFile?: File | null) {
  return apiRequest<DishDto>(`/dishes/${dishId}`, {
    method: "PUT",
    body: createDishFormData(payload, imageFile),
  });
}

export function enableDish(dishId: string, payload?: DishStockPayload) {
  return apiRequest<DishDto>(`/dishes/${dishId}/enable`, {
    method: "PATCH",
    ...(payload ? { body: payload } : {}),
  });
}

export function disableDish(dishId: string) {
  return apiRequest<DishDto>(`/dishes/${dishId}/disable`, { method: "PATCH" });
}

export function deleteDish(dishId: string) {
  return apiRequest<DishDto>(`/dishes/${dishId}`, { method: "DELETE" });
}

export function addDishStock(restaurantId: string, dishId: string, payload: DishAddStockPayload) {
  return apiRequest<RestaurantDishDto>(`/restaurants/${restaurantId}/dishes/${dishId}/stock/add`, {
    method: "PATCH",
    body: payload,
  });
}
