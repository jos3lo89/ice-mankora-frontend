import axiosInstance from "@/lib/axios";
import { type SignInSchema } from "../schemas/auth.schema";

// Definimos la respuesta esperada del backend (ajusta según tu NestJS)
interface LoginResponse {
  userId: string;
  name: string;
  role: "ADMIN" | "MOZO" | "CAJERO";
  allowedFloorIds: string[];
}

export const login = async (data: SignInSchema): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>(
    "/auth/signin",
    data
  );

  return response.data;
};
