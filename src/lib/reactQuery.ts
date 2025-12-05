import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false, // Para que no recargue al cambiar de pestaña (opcional)
      // staleTime: 1000 * 60 * 5, // 5 minutos de caché por defecto
    },
  },
});
