import { apiRequest } from '../api';
import type { ExtraDto, ExtraItemPayload, ExtraItemResponse } from '@/types/extra';

export function getExtrasForRestaurant(restaurantId: string) {
  return apiRequest<ExtraDto[]>(`/restaurants/${restaurantId}/extras`);
}

export function getExtraItemsForRestaurant(restaurantId: string) {
  return apiRequest<ExtraItemResponse[]>(`/restaurants/${restaurantId}/extras`);
}

export function createExtraItem(restaurantId: string, payload: ExtraItemPayload) {
  return apiRequest<ExtraItemResponse>(`/restaurants/${restaurantId}/extras`, {
    method: 'POST',
    body: payload,
  });
}

export function updateExtraItem(extraItemId: string, payload: ExtraItemPayload) {
  return apiRequest<ExtraItemResponse>(`/extras/${extraItemId}`, {
    method: 'PUT',
    body: payload,
  });
}

export function deleteExtraItem(extraItemId: string) {
  return apiRequest<void>(`/extras/${extraItemId}`, { method: 'DELETE' });
}

export function enableExtraItem(extraItemId: string) {
  return apiRequest<ExtraItemResponse>(`/extras/${extraItemId}/enable`, { method: 'PATCH' });
}

export function disableExtraItem(extraItemId: string) {
  return apiRequest<ExtraItemResponse>(`/extras/${extraItemId}/disable`, { method: 'PATCH' });
}
