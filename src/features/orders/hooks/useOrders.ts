import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getActiveOrder, requestPreAccount } from "../services/orders.service";
import { toast } from "sonner";

export const useActiveOrder = (tableId: string) => {
  return useQuery({
    queryKey: ["active-order", tableId],
    queryFn: () => getActiveOrder(tableId),
    retry: 1,
  });
};

export const useRequestPreCount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: requestPreAccount,
    onSuccess: () => {
      toast.success("Pre-cuenta solicitada. Mesa en Amarillo.");
      queryClient.invalidateQueries({ queryKey: ["floors"] }); // Actualiza el mapa
    },
  });
};
