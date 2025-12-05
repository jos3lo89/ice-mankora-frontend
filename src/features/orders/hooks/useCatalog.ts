import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getCategories,
  getProducts,
  createOrder,
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

  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      toast.success("Pedido enviado a cocina 👨‍🍳");
      clearCart(); // Limpiamos carrito
      navigate("/mozo/map"); // Volvemos al mapa
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error al enviar pedido");
    },
  });
};
