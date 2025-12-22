// src/services/categories.service.ts
import axiosInstance from "@/lib/axios";
import type { Category } from "../types/category.types";

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await axiosInstance.get("/categories");
    return data;
  },

  getOne: async (id: string): Promise<Category> => {
    const { data } = await axiosInstance.get(`/categories/${id}`);
    return data;
  },

  create: async (category: {
    name: string;
    slug: string;
    parentId?: string;
    floorIds: string[];
  }): Promise<Category> => {
    const { data } = await axiosInstance.post("/categories", category);
    return data;
  },

  update: async (
    id: string,
    category: Partial<{
      name: string;
      slug: string;
      parentId?: string;
      floorIds: string[];
    }>,
  ): Promise<Category> => {
    const { data } = await axiosInstance.patch(`/categories/${id}`, category);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/categories/${id}`);
  },
};
