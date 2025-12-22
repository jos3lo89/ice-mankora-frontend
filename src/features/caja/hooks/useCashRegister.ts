import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cashRegisterApi } from "../services/caja.service";

export const useCashRegister = () => {
  const queryClient = useQueryClient();

  // Consultar caja abierta hoy
  const { data: todayCashRegister, isLoading } = useQuery({
    queryKey: ["cash-register", "today"],
    queryFn: cashRegisterApi.getTodayOpen,
    refetchInterval: 30000, // Actualizar cada 30s
  });

  // Abrir caja
  const openMutation = useMutation({
    mutationFn: cashRegisterApi.open,
    onSuccess: () => {
      toast.success("Caja abierta exitosamente");
      queryClient.invalidateQueries({ queryKey: ["cash-register"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error al abrir caja");
    },
  });

  // Cerrar caja
  const closeMutation = useMutation({
    mutationFn: ({ id, finalMoney }: { id: string; finalMoney: number }) =>
      cashRegisterApi.close(id, finalMoney),
    onSuccess: () => {
      toast.success("Caja cerrada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["cash-register"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error al cerrar caja");
    },
  });

  return {
    todayCashRegister,
    isLoading,
    isCashRegisterOpen: !!todayCashRegister,
    openCashRegister: openMutation.mutate,
    closeCashRegister: closeMutation.mutate,
    isOpening: openMutation.isPending,
    isClosing: closeMutation.isPending,
  };
};
