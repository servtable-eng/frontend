import { apiRequest } from '../api';
import type { CreateOrderPayload, OrderDetails, OrderDto, OrderStatus, OrderSummary } from '@/types/order';

export function createOrder(payload: CreateOrderPayload) {
  return apiRequest<OrderDto>('/orders', {
    method: 'POST',
    body: payload,
  });
}

export function getOrdersForRestaurant(restaurantId: string) {
  return apiRequest<OrderSummary[]>(`/restaurants/${restaurantId}/orders`);
}

export function getOrder(orderId: string) {
  return apiRequest<OrderDetails>(`/orders/${orderId}`);
}

export function updateOrderStatus(orderId: string, status: OrderStatus) {
  return apiRequest<OrderDetails>(`/orders/${orderId}/status`, {
    method: 'PATCH',
    body: { status },
  });
}
