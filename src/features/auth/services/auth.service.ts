import axiosInstance from "@/lib/axios";
import { type SignInSchema } from "../schemas/auth.schema";
import type { Roles } from "@/enums/roles.enum";

interface LoginResponse {
  userId: string;
  name: string;
  role: Roles;
  allowedFloorIds: string[];
}

export const login = async (data: SignInSchema): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>(
    "/auth/signin",
    data
  );

  return response.data;
};
