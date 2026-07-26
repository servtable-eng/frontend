import type { CustomerPlateItem } from './CustomerPlateContext';
import type { ClientDishDto } from '@/types/dish';

const MIN_PORTION_WEIGHT = 25;
const MAX_PORTION_WEIGHT = 1000;
const PORTION_WEIGHT_STEP = 25;

const createPlateItemId = () => `plate-item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export function normalizePortionWeight(value: unknown) {
  const numericValue = typeof value === 'number' && Number.isFinite(value) ? value : 250;
  const clampedValue = Math.min(MAX_PORTION_WEIGHT, Math.max(MIN_PORTION_WEIGHT, numericValue));

  return Math.round(clampedValue / PORTION_WEIGHT_STEP) * PORTION_WEIGHT_STEP;
}

export function createPlateItem(
  dish: ClientDishDto,
  portionWeightInGrams: number,
  observation = '',
): CustomerPlateItem {
  return {
    id: createPlateItemId(),
    dishId: dish.id,
    name: dish.name,
    description: dish.description,
    imageUrl: dish.imageUrl,
    portionWeightInGrams: normalizePortionWeight(portionWeightInGrams),
    hasConfirmedWeight: true,
    observation,
    quantity: 1,
  };
}

export function ensurePlateItemId(item: CustomerPlateItem) {
  return item.id || createPlateItemId();
}
