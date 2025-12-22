import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getFloorForUserRegister,
  getUserProfile,
  registerUser,
} from "../services/user.service";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const useUser = () => {
  const getUserProfileQuery = useQuery({
    queryKey: ["user-profile"],
    queryFn: getUserProfile,
  });

  return { getUserProfileQuery };
};

export const useFloorForUserRegister = () => {
  const query = useQuery({
    queryKey: ["user", "for-user-register"],
    queryFn: getFloorForUserRegister,
  });
  return query;
};

export const useRegisterUser = () => {
  const mutate = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success("Usuario registrado con éxito");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Error al registrar el usuario");
      }
    },
  });

  return { mutate };
};
