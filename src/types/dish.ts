export type FoodCategory =
  | "PRATO_PRINCIPAL"
  | "ENTRADA"
  | "SALADA"
  | "SOBREMESA"
  | "BEBIDA"
  | string;

export type DishCategory = FoodCategory;

export type ClientDishDto = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  recommendedWeightInGrams: number;
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
  buffetPosition: number;
  available: boolean;
};

export type Dish = DishDto;

export type DishPayload = {
  name: string;
  description: string;
  ingredients: string[];
  category: DishCategory;
  imageUrl: string;
  costPerKg: number;
  recommendedWeightInGrams: number;
  available: boolean;
};
