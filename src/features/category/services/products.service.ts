import axiosInstance from "@/lib/axios";
import type { Product } from "../types/category.types";

export const productsApi = {
  getAll: async (categoryId?: string): Promise<Product[]> => {
    const { data } = await axiosInstance.get("products", {
      params: categoryId ? { categoryId } : undefined,
    });

    console.log("productos por catgegoria: ", data);

    return data;
  },

  getOne: async (id: string): Promise<Product> => {
    const { data } = await axiosInstance.get(`products/${id}`);
    return data;
  },

  create: async (product: {
    name: string;
    description?: string;
    price: number;
    categoryId: string;
    isStockManaged?: boolean;
    stockDaily?: number;
    stockWarehouse?: number;
    taxType?: string;
    igvRate?: number;
    isActive?: boolean;
  }): Promise<Product> => {
    const { data } = await axiosInstance.post("/products", product);
    return data;
  },

  update: async (id: string, product: Partial<Product>): Promise<Product> => {
    const { data } = await axiosInstance.patch(`/products/${id}`, product);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/products/${id}`);
  },
};
