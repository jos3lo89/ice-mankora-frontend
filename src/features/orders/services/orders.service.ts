import axiosInstance from "@/lib/axios";
import type { Order, PrintLog } from "../types/order.types";
import type { CategoryI } from "../types/category.interface";
import type { ProductsI } from "../types/product.interface";

// se usa
export const getCategories = async (): Promise<CategoryI[]> => {
  const { data } = await axiosInstance.get<CategoryI[]>(`/catalog/categories`);
  return data;
};

// se usa
export const getProducts = async (): Promise<ProductsI[]> => {
  const { data } = await axiosInstance.get<ProductsI[]>(`/catalog/products`);
  return data;
};

export interface CreateOrderPayload {
  tableId: string;
  items: Item[];
}

export interface Item {
  productId: string;
  quantity: number;
  notes: string | null;
  variantIds: string[];
}

// se usa
export const createOrder = async (payload: CreateOrderPayload) => {
  const { data } = await axiosInstance.post("/orders", payload);
  return data;
};

export const getActiveOrder = async (tableId: string): Promise<Order> => {
  const { data } = await axiosInstance.get<Order>(`/orders/active/${tableId}`);
  return data;
};

export const requestPreAccount = async (orderId: string) => {
  const { data } = await axiosInstance.post(`/orders/${orderId}/pre-count`);
  return data;
};

export interface AddItemsPayload {
  orderId: string;
  items: Item[];
}

export const addItemsToOrder = async ({ orderId, items }: AddItemsPayload) => {
  const { data } = await axiosInstance.post(`/orders/${orderId}/add-items`, {
    items,
  });
  return data;
};

export interface CancelOrderPayload {
  orderId: string;
  reason: string;
  authCode: string;
}

export const cancelOrder = async ({
  orderId,
  reason,
  authCode,
}: CancelOrderPayload) => {
  const { data } = await axiosInstance.patch(`/orders/${orderId}/cancel`, {
    reason,
    authCode,
  });
  return data;
};

// ✅ NUEVO: Obtener logs de impresión
export const getOrderPrintLogs = async (orderId: string) => {
  const { data } = await axiosInstance.get<PrintLog[]>(
    `/orders/${orderId}/print-logs`,
  );
  return data;
};

// ✅ NUEVO: Reintentar impresión
export const retryPrint = async (printLogId: string) => {
  const { data } = await axiosInstance.post(
    `/orders/print-logs/${printLogId}/retry`,
  );
  return data;
};

export const orderItemsApi = {
  deactivateItem: async (itemId: string) => {
    const { data } = await axiosInstance.patch(`/orders/items/${itemId}/deactivate`);
    return data;
  },
};