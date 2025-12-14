import { useQuery } from "@tanstack/react-query";
import { getCategories, getProducts } from "../service/products.service";

export const useProducts = () => {
  return useQuery({
    queryKey: ["admin-products"],
    queryFn: getProducts,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories-admin"],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};
