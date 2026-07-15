export type Restaurant = {
  id: string;
  name: string;
  pricePer100g?: number;
};

export type RestaurantSettings = {
  id: string;
  name: string;
  pricePer100g: number;
  defaultOrderEstimateMinutes: number;
};
