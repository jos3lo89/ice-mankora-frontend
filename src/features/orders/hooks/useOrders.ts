import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addItemsToOrder,
  cancelOrder,
  getActiveOrder,
  requestPreAccount,
} from "../services/orders.service";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/stores/useCartStore";

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
      queryClient.invalidateQueries({ queryKey: ["floors"] });
    },
  });
};

export const useAddItems = () => {
  const navigate = useNavigate();
  const clearCart = useCartStore((state) => state.clearCart);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addItemsToOrder,
    onSuccess: () => {
      toast.success("Nuevos items agregados correctamente");
      clearCart();
      queryClient.invalidateQueries({ queryKey: ["active-order"] });
      navigate(-1);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error al agregar items");
    },
  });
};

export const useCancelOrder = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => {
      toast.success("Orden anulada y mesa liberada.");
      queryClient.invalidateQueries({ queryKey: ["floors"] });
      navigate(-1);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error al anular Orden");
    },
  });
};
