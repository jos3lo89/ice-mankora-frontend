import axiosInstance from "@/lib/axios";
import { type SignInSchema } from "../schemas/auth.schema";
import type { SigninI } from "../interface/signin.interface";

export const login = async (userData: SignInSchema): Promise<SigninI> => {
  const { data } = await axiosInstance.post<SigninI>("/auth/signin", userData);
  return data;
};
