import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDish } from "../services/dishes/dish.service";
import { DISHES_QUERY_KEY } from "./useDishes";

export function useDeleteDish() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DISHES_QUERY_KEY });
    },
  });
}
