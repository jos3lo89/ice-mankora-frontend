import { useMutation } from "@tanstack/react-query";
import { login } from "../services/auth.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";
// import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  // const navigate = useNavigate();
  const setLogin = useAuthStore((state) => state.setLogin);

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setLogin(data);
      toast.success(`Bienvenido, ${data.name}`);

      // if (data.user.role === "ADMIN") {
      //   navigate("/admin/dashboard");
      // } else {
      //   navigate("/map");
      // }
    },
    onError: (error: any) => {
      console.log("error use login", error);
      const message =
        error.response?.data?.message || "Error al iniciar sesión";
      toast.error(message);
    },
  });
};
