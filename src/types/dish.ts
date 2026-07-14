export type FoodCategory =
  | "PRATO_PRINCIPAL"
  | "ENTRADA"
  | "SALADA"
  | "SOBREMESA"
  | "BEBIDA"
  | string;

export type DishCategory = FoodCategory;
export type DishStockStatus = "NORMAL" | "LOW" | "OUT_OF_STOCK" | string;

export type ClientDishDto = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  recommendedWeightInGrams: number;
  available?: boolean;
  availableQuantityInGrams?: number | null;
  lowStockThresholdInGrams?: number | null;
  stockStatus?: DishStockStatus | null;
  category?: string;
};

export type RestaurantDishDto = {
  id: string;
  imageUrl: string;
  name: string;
  category: DishCategory;
  buffetPosition: number | string;
  costPerKg: number;
  recommendedWeightInGrams: number;
  availableQuantityInGrams?: number | null;
  lowStockThresholdInGrams?: number | null;
  stockStatus?: DishStockStatus | null;
  available: boolean;
};

export type DishDto = {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  ingredients: string[];
  category: DishCategory;
  imageUrl: string;
  photoUpdatedAt?: string | null;
  costPerKg: number;
  recommendedWeightInGrams: number;
  availableQuantityInGrams?: number | null;
  lowStockThresholdInGrams?: number | null;
  stockStatus?: DishStockStatus | null;
  buffetPosition: number;
  available: boolean;
};

export type Dish = DishDto;

export type DishPayload = {
  name: string;
  description: string;
  ingredients: string[];
  category: DishCategory;
  costPerKg: number;
  recommendedWeightInGrams: number;
  availableQuantityInGrams?: number;
  lowStockThresholdInGrams?: number;
  available: boolean;
};

export type DishStockPayload = {
  available: true;
  availableQuantityInGrams: number;
  lowStockThresholdInGrams: number;
};

export type DishAddStockPayload = {
  quantityToAddInGrams: number;
};
