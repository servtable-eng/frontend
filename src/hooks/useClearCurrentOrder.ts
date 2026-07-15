import { useCallback } from 'react';
import { useCustomerCart } from '@/contexts/CustomerCartContext';
import { useCustomerPlate } from '@/contexts/CustomerPlateContext';

/** Clears only the transient state used to build the current order. */
export function useClearCurrentOrder() {
  const { clearCart } = useCustomerCart();
  const { clearPlate } = useCustomerPlate();

  return useCallback(function clearCurrentOrder() {
    // clearCart removes the restaurant-scoped persisted cart synchronously.
    clearCart();
    clearPlate();
  }, [clearCart, clearPlate]);
}
