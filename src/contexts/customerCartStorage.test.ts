import { beforeEach, describe, expect, it } from 'vitest';
import { getCartStorageKey, loadCartFromStorage } from './customerCartStorage';

const restaurantId = 'restaurant-duplicate-test';

beforeEach(() => localStorage.clear());

describe('customer cart storage normalization', () => {
  it('keeps the first item for each dishId and persists the normalized cart', () => {
    const first = {
      id: 'first',
      dishId: 'dish-1',
      name: 'Primeiro',
      description: '',
      imageUrl: '',
      portionWeightInGrams: 100,
      hasConfirmedWeight: true,
      observation: 'primeira',
      quantity: 1,
    };
    const duplicate = { ...first, id: 'second', portionWeightInGrams: 200, observation: 'segunda' };
    const stored = {
      cartPlates: [
        { id: 'plate-1', plateItems: [first], extras: [], buffetSubtotal: 10, extrasSubtotal: 0, total: 10, createdAt: 'now' },
        { id: 'plate-2', plateItems: [duplicate], extras: [], buffetSubtotal: 20, extrasSubtotal: 0, total: 20, createdAt: 'later' },
      ],
      extraQuantities: {},
    };
    localStorage.setItem(getCartStorageKey(restaurantId), JSON.stringify(stored));

    const loaded = loadCartFromStorage(restaurantId);
    const items = loaded.cartPlates.flatMap(plate => plate.plateItems);

    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ id: 'first', portionWeightInGrams: 100, observation: 'primeira' });
    const persisted = JSON.parse(localStorage.getItem(getCartStorageKey(restaurantId)) ?? '{}');
    expect(persisted.cartPlates.flatMap((plate: { plateItems: unknown[] }) => plate.plateItems)).toHaveLength(1);
  });
});
