import { useMutation } from "@tanstack/react-query";
import { login } from "../services/auth.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

export const useLogin = () => {
  const { setLogin } = useAuthStore();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setLogin(data);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Error al iniciar sesión";
      toast.error(message, {
        position: "top-center",
      });
    },
  });
};
