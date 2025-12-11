import axiosInstance from "@/lib/axios";
import { type SignInSchema } from "../schemas/auth.schema";
import type { LoginResponse } from "../interface/signin.interface";

export const login = async (data: SignInSchema): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>(
    "/auth/signin",
    data
  );

  return response.data;
};
