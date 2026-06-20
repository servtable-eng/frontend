import { apiRequest } from '../api';
import type { CreateOrderPayload, OrderDto } from '@/types/order';

export function createOrder(payload: CreateOrderPayload) {
  return apiRequest<OrderDto>('/orders', {
    method: 'POST',
    body: payload,
  });
}
