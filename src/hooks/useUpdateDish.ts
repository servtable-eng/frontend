import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDish } from "../services/dishes/dish.service";
import { DISHES_QUERY_KEY } from "./useDishes";
import type { DishDto, DishPayload } from "../types/dish";

type UpdateDishInput = DishPayload & { id: string };

export function useUpdateDish() {
  const queryClient = useQueryClient();

  return useMutation<DishDto, Error, UpdateDishInput>({
    mutationFn: ({ id, ...payload }) => updateDish(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DISHES_QUERY_KEY });
    },
  });
}
