import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDish } from "../services/dishes/dish.service";
import { DISHES_QUERY_KEY } from "./useDishes";
import type { DishDto, DishPayload } from "../types/dish";

export function useCreateDish(restaurantId: string) {
  const queryClient = useQueryClient();

  return useMutation<DishDto, Error, DishPayload>({
    mutationFn: (payload) => createDish(restaurantId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DISHES_QUERY_KEY });
    },
  });
}
