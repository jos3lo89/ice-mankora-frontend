import axiosInstance from "@/lib/axios";
import type { UserProfile } from "../types/user.types";

export const getUserProfile = async (): Promise<UserProfile> => {
  const { data } = await axiosInstance.get("/users/profile");
  return data;
};
