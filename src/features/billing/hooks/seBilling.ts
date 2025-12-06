import { useMutation, useQuery } from "@tanstack/react-query";
import { createSale, getPrintData } from "../services/billing.service";
import { toast } from "sonner";

export const useCreateSale = (onSuccessCallback?: (saleId: string) => void) => {
  return useMutation({
    mutationFn: createSale,
    onSuccess: (data) => {
      toast.success(`Venta generada: ${data.numeroComprobante}`);
      if (onSuccessCallback) onSuccessCallback(data.id);
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
