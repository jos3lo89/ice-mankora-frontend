import axiosInstance from "@/lib/axios";
import type { Floor } from "../types/floor.types";

export const getFloors = async (): Promise<Floor[]> => {
  const { data } = await axiosInstance.get<Floor[]>("/floors/tables");
  return data;
};
