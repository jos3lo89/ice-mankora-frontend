import axiosInstance from "@/lib/axios";
import type { UserProfile } from "../types/user.types";

export const getUserProfile = async (): Promise<UserProfile> => {
  const { data } = await axiosInstance.get("/users/profile");
  return data;
};

export interface RegisterUserI {
  name: string;
  dni: string;
  username: string;
  password: string;
  role: string;
  floors: string[];
}

export const registerUser = async (userData: RegisterUserI) => {
  const { data } = await axiosInstance.post("/users", userData);
  return data;
};

export interface FLoorsUserRegisterI {
  id: string;
  name: string;
  level: number;
}

export const getFloorForUserRegister = async () => {
  const { data } = await axiosInstance.get<FLoorsUserRegisterI[]>(
    "floors/for-user-register",
  );
  return data;
};
