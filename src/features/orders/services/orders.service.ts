import axiosInstance from "@/lib/axios";
import type { Category, Product } from "../types/catalog.types";
import type { Order, PrintLog } from "../types/order.types";

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
    variantIds?: string[];
  }[];
}

export const createOrder = async (payload: CreateOrderPayload) => {
  console.log("que se envia: ->>>>>", payload);

  const { data } = await axiosInstance.post("/orders", payload);

  console.log("retorno de back ->>>>", data);

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
  items: {
    productId: string;
    quantity: number;
    notes?: string;
    variantIds?: string[];
  }[];
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
    `/orders/${orderId}/print-logs`
  );
  return data;
};

// ✅ NUEVO: Reintentar impresión
export const retryPrint = async (printLogId: string) => {
  const { data } = await axiosInstance.post(
    `/orders/print-logs/${printLogId}/retry`
  );
  return data;
};
