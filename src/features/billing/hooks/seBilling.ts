import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSale, getPrintData } from "../services/billing.service";
import { toast } from "sonner";

export const useCreateSale2 = (
  onSuccessCallback?: (saleId: string) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSale,
    onSuccess: (data) => {
      toast.success(`Venta generada: ${data.numeroComprobante}`);

      queryClient.invalidateQueries({ queryKey: ["floors"] });
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      // queryClient.invalidateQueries({ queryKey: ["active-order"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      if (onSuccessCallback) {
        onSuccessCallback(data.id);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error al procesar el pago");
    },
  });
};

// src/features/billing/hooks/seBilling.ts

export const useCreateSale = (
  onSuccessCallback?: (saleId: string, orderStatus?: any) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSale,
    onSuccess: (data) => {
      toast.success(`Venta generada: ${data.numeroComprobante}`);

      queryClient.invalidateQueries({ queryKey: ["floors"] });
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      if (onSuccessCallback) {
        onSuccessCallback(data.id, data.orderStatus);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error al procesar el pago");
    },
  });
};

export const usePrintData = (saleId: string | null) => {
  return useQuery({
    queryKey: ["print-data", saleId],
    queryFn: () => getPrintData(saleId!),
    enabled: !!saleId,
  });
};
