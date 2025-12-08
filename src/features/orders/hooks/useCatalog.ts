import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  getProducts,
  createOrder,
  getOrderPrintLogs,
  retryPrint,
} from "../services/orders.service";
import { toast } from "sonner";
import { useCartStore } from "@/stores/useCartStore";
import { useNavigate } from "react-router-dom";

export const useCatalog = () => {
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  return { categoriesQuery, productsQuery };
};

export const useCreateOrder = () => {
  const navigate = useNavigate();
  const clearCart = useCartStore((state) => state.clearCart);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      toast.success("Pedido enviado");
      clearCart();
      navigate("/mozo/map");

      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error al enviar pedido");
    },
  });
};

// ✅ NUEVO: Hook para obtener logs de impresión
export const useOrderPrintLogs = (orderId: string) => {
  return useQuery({
    queryKey: ["print-logs", orderId],
    queryFn: () => getOrderPrintLogs(orderId),
    enabled: !!orderId,
    refetchInterval: 5000, // Refrescar cada 5 segundos
  });
};

// ✅ NUEVO: Hook para reintentar impresión
export const useRetryPrint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: retryPrint,
    onSuccess: () => {
      toast.success("Reintentando impresión...");
      queryClient.invalidateQueries({ queryKey: ["print-logs"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Error al reintentar impresión"
      );
    },
  });
};
