import axiosInstance from "@/lib/axios";
import type {
  CreateSalePayload,
  DNIResponse,
  PrintData,
  RUCResponse,
  SaleResponse,
} from "../types/billing.types";
import axios from "axios";

const PERUDEVS_API_KEY = import.meta.env.VITE_PERUDEVS_API_KEY;

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

export const searchDNI = async (dni: string): Promise<DNIResponse> => {
  try {
    const { data } = await axios.get(
      `https://api.perudevs.com/api/v1/dni/simple`,
      {
        params: {
          document: dni,
          key: PERUDEVS_API_KEY,
        },
      }
    );
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.mensaje || "Error al consultar DNI");
  }
};

// ===== API EXTERNA: RUC =====

export const searchRUC = async (ruc: string): Promise<RUCResponse> => {
  try {
    const { data } = await axios.get(`https://api.perudevs.com/api/v1/ruc`, {
      params: {
        document: ruc,
        key: PERUDEVS_API_KEY,
      },
    });
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.mensaje || "Error al consultar RUC");
  }
};

// ernuqwenrqoernoqwenr
