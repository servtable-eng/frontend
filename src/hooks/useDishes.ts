import { useQuery } from "@tanstack/react-query";
import { getDishesForRestaurant } from "../services/dishes/dish.service";

export const DISHES_QUERY_KEY = ["dishes"] as const;

export function useDishes(restaurantId: string) {
  return useQuery({
    queryKey: [...DISHES_QUERY_KEY, restaurantId],
    queryFn: () => getDishesForRestaurant(restaurantId),
    select: (data) =>
      data.slice().sort((a, b) => Number(a.buffetPosition) - Number(b.buffetPosition)),
    enabled: Boolean(restaurantId),
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
}
