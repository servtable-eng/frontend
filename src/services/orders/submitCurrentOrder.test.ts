import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearCartStorage, getCartStorageKey, loadCartFromStorage } from '@/contexts/customerCartStorage';
import { addRecentOrder, getRecentOrders, RECENT_ORDERS_STORAGE_KEY } from './recentOrders.storage';
import { submitCurrentOrder, type OrderSubmissionGuard } from './submitCurrentOrder';

const restaurantId = 'restaurant-1';
const customerInfoKey = 'servtable_customer_info';
const newGuard = (): OrderSubmissionGuard => ({ pending: false, successHandled: false });

beforeEach(() => localStorage.clear());

describe('current order submission', () => {
  it('saves the recent order before clearing state after a successful submission', async () => {
    const events: string[] = [];
    const order = { id: 'order-6' };

    const result = await submitCurrentOrder({
      guard: newGuard(),
      create: async () => {
        events.push('created');
        return order;
      },
      saveRecentOrder: created => {
        events.push('recent');
        addRecentOrder({ orderId: created.id, customerName: 'Ana', tableNumber: '12', createdAt: '2026-07-15' });
      },
      clearCurrentOrder: () => events.push('cleared'),
    });

    expect(result).toBe(order);
    expect(events).toEqual(['created', 'recent', 'cleared']);
    expect(getRecentOrders()[0].orderId).toBe('order-6');
  });

  it('keeps all order data and allows retry after a failed submission', async () => {
    const clearCurrentOrder = vi.fn();
    const guard = newGuard();
    const create = vi.fn().mockRejectedValueOnce(new Error('network')).mockResolvedValueOnce({ id: 'retry' });

    await expect(submitCurrentOrder({ guard, create, saveRecentOrder: vi.fn(), clearCurrentOrder })).rejects.toThrow('network');
    expect(clearCurrentOrder).not.toHaveBeenCalled();
    expect(guard.pending).toBe(false);

    await expect(submitCurrentOrder({ guard, create, saveRecentOrder: vi.fn(), clearCurrentOrder })).resolves.toEqual({ id: 'retry' });
  });

  it('prevents a double click from creating or clearing the order twice', async () => {
    let resolveRequest!: (order: { id: string }) => void;
    const request = new Promise<{ id: string }>(resolve => { resolveRequest = resolve; });
    const create = vi.fn(() => request);
    const clearCurrentOrder = vi.fn();
    const options = { guard: newGuard(), create, saveRecentOrder: vi.fn(), clearCurrentOrder };

    const first = submitCurrentOrder(options);
    const second = submitCurrentOrder(options);
    expect(await second).toBeNull();
    resolveRequest({ id: 'one' });
    await first;

    expect(create).toHaveBeenCalledTimes(1);
    expect(clearCurrentOrder).toHaveBeenCalledTimes(1);
  });

  it('does not rehydrate cart data after cleanup and a simulated page reload', () => {
    localStorage.setItem(getCartStorageKey(restaurantId), JSON.stringify({
      cartPlates: [{ id: 'plate', plateItems: [], extras: [], buffetSubtotal: 10, extrasSubtotal: 2, total: 12, createdAt: 'now' }],
      extraQuantities: { extra: 2 },
    }));

    clearCartStorage(restaurantId);
    expect(loadCartFromStorage(restaurantId)).toEqual({ cartPlates: [], extraQuantities: {} });
  });

  it('preserves only the five most recent order IDs during cleanup', () => {
    for (let index = 1; index <= 6; index += 1) {
      addRecentOrder({ orderId: `order-${index}`, customerName: 'Ana', tableNumber: '12', createdAt: String(index) });
    }
    clearCartStorage(restaurantId);

    expect(getRecentOrders().map(order => order.orderId)).toEqual(['order-6', 'order-5', 'order-4', 'order-3', 'order-2']);
    expect(localStorage.getItem(RECENT_ORDERS_STORAGE_KEY)).not.toBeNull();
  });

  it('preserves customer name and phone while removing the restaurant cart key', () => {
    const customer = { customerName: 'Ana Silva', customerPhone: '11999999999' };
    localStorage.setItem(customerInfoKey, JSON.stringify(customer));
    localStorage.setItem(getCartStorageKey(restaurantId), '{}');

    clearCartStorage(restaurantId);

    expect(JSON.parse(localStorage.getItem(customerInfoKey) ?? '{}')).toEqual(customer);
    expect(localStorage.getItem(getCartStorageKey(restaurantId))).toBeNull();
  });
});
