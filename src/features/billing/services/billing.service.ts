import axiosInstance from "@/lib/axios";
import type {
  CreateSalePayload,
  PrintData,
  SaleResponse,
} from "../types/billing.types";

export const createSale = async (
  payload: CreateSalePayload
): Promise<SaleResponse> => {
  const { data } = await axiosInstance.post("/billing/pay", payload);
  return data;
};

export const getPrintData = async (saleId: string): Promise<PrintData> => {
  const { data } = await axiosInstance.get(`/billing/${saleId}/print-data`);
  return data;
};
