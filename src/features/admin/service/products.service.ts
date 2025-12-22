import axiosInstance from "@/lib/axios";
import type { ProductsI } from "../interfaces/products.interface";
import type { CategoriesI } from "../interfaces/categories.interface";

export const getProducts = async () => {
  const { data } = await axiosInstance.get<ProductsI[]>("catalog/products");
  return data;
};

export const updateProductStatus = async (id: string, isActive: boolean) => {
  const { data } = await axiosInstance.patch(`catalog/products/${id}/status`, {
    isActive,
  });
  return data;
};

export const createProduct = async (product: any) => {
  const { data } = await axiosInstance.post("catalog/products", product);
  return data;
};

export const updateProduct = async (id: string, product: any) => {
  const { data } = await axiosInstance.put(`catalog/products/${id}`, product);
  return data;
};

export const getCategories = async () => {
  const { data } = await axiosInstance.get<CategoriesI[]>(
    "categories/find-todo",
  );

  return data;
};
