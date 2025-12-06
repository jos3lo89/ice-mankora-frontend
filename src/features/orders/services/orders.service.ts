import axiosInstance from "@/lib/axios";
import type { Category, Product } from "../types/catalog.types";

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await axiosInstance.get("/catalog/categories");
  return data;
};

export const getProducts = async (): Promise<Product[]> => {
  const { data } = await axiosInstance.get("/catalog/products");
  return data;
};

export interface CreateOrderPayload {
  tableId: string;
  items: {
    productId: string;
    quantity: number;
    notes?: string;
    variantsDetail?: string;
  }[];
}

export const createOrder = async (payload: CreateOrderPayload) => {
  const { data } = await axiosInstance.post("/orders", payload);
  return data;
};
