import type { CustomerPlateItem } from '@/contexts/CustomerPlateContext';

export function calculateBuffetPrice(portionWeightInGrams: number, pricePer100g: number) {
  return (portionWeightInGrams / 100) * pricePer100g;
}

export function calculatePlateBuffetSubtotal(items: CustomerPlateItem[], pricePer100g: number) {
  return items.reduce(
    (sum, item) => sum + calculateBuffetPrice(item.portionWeightInGrams, pricePer100g) * item.quantity,
    0,
  );
}
