import type { CustomerCartPlate } from '@/contexts/CustomerCartContext';

export type PersistedCustomerCart = {
  cartPlates: CustomerCartPlate[];
  extraQuantities: Record<string, number>;
};

const emptyCart = (): PersistedCustomerCart => ({
  cartPlates: [],
  extraQuantities: {},
});

const canUseStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage);

const isRecord = (value: unknown): value is Record<string, unknown> => (
  typeof value === 'object' && value !== null && !Array.isArray(value)
);

const isValidExtraQuantities = (value: unknown): value is Record<string, number> => (
  isRecord(value) && Object.values(value).every(quantity => typeof quantity === 'number' && quantity >= 0)
);

const isValidCartPlate = (value: unknown): value is CustomerCartPlate => {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === 'string' &&
    Array.isArray(value.plateItems) &&
    Array.isArray(value.extras) &&
    typeof value.buffetSubtotal === 'number' &&
    typeof value.extrasSubtotal === 'number' &&
    typeof value.total === 'number' &&
    typeof value.createdAt === 'string'
  );
};

const isValidCart = (value: unknown): value is PersistedCustomerCart => {
  if (!isRecord(value)) return false;

  return (
    Array.isArray(value.cartPlates) &&
    value.cartPlates.every(isValidCartPlate) &&
    isValidExtraQuantities(value.extraQuantities)
  );
};

export function getCartStorageKey(restaurantId: string) {
  return `servtable-cart:${restaurantId}`;
}

export function loadCartFromStorage(restaurantId: string): PersistedCustomerCart {
  if (!restaurantId || !canUseStorage()) {
    return emptyCart();
  }

  const key = getCartStorageKey(restaurantId);
  const rawCart = window.localStorage.getItem(key);

  if (!rawCart) {
    return emptyCart();
  }

  try {
    const parsed = JSON.parse(rawCart) as unknown;

    if (isValidCart(parsed)) {
      return parsed;
    }
  } catch {
    // Corrupted storage is cleared below so the cart can recover safely.
  }

  clearCartStorage(restaurantId);
  return emptyCart();
}

export function saveCartToStorage(restaurantId: string, cart: PersistedCustomerCart) {
  if (!restaurantId || !canUseStorage()) {
    return;
  }

  window.localStorage.setItem(getCartStorageKey(restaurantId), JSON.stringify(cart));
}

export function clearCartStorage(restaurantId: string) {
  if (!restaurantId || !canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(getCartStorageKey(restaurantId));
}
