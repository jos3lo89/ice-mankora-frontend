import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addItemsToOrder,
  cancelOrder,
  getActiveOrder,
  orderItemsApi,
  requestPreAccount,
} from "../services/orders.service";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/stores/useCartStore";
import { AxiosError } from "axios";

export const useActiveOrder = (tableId: string) => {
  return useQuery({
    queryKey: ["active-order", tableId],
    queryFn: () => getActiveOrder(tableId),
    retry: 1,
    throwOnError: (error: any) => {
      // Si es 404, no es un error real - la mesa simplemente no tiene orden activa
      if (error?.response?.status === 404) {
        return false; // No lanzar error
      }
      return true; // Otros errores sí se lanzan
    },
  });
};

export const useRequestPreCount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: requestPreAccount,
    onSuccess: () => {
      toast.success("Pre-cuenta solicitada.");
      queryClient.invalidateQueries({ queryKey: ["floors"] });
    },
  });
};

// si se usa
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

export const useDeactivateOrderItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderItemsApi.deactivateItem,
    onSuccess: () => {
      toast.success("Item desactivado correctamente");
      queryClient.invalidateQueries({ queryKey: ["active-order"] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message);
      } else {
        toast.error("Error al desactivar el item");
      }
    },
  });
};
