import axiosInstance from "@/lib/axios";
import type { CashRegisterDetailsPdf } from "../types/caja.types";

export interface CashRegisterDetails {
  cashRegister: {
    id: string;
    userId: string;
    openTime: string;
    closeTime: string | null;
    initialMoney: number;
    finalMoney: number | null;
    systemMoney: number;
    difference: number | null;
    status: "ABIERTA" | "CERRADA";
    duracionHoras: number;
    user: {
      id: string;
      name: string;
      username: string;
      role: string;
    };
  };
  totales: {
    inicial: number;
    ventas: number;
    ingresosExtras: number;
    egresos: number;
    esperado: number;
    contado: number | null;
    diferencia: number | null;
  };
  ventas: {
    total: number;
    monto: number;
    porMetodo: Record<string, { count: number; total: number }>;
    porTipo: Record<string, { count: number; total: number }>;
    listado: Array<any>;
  };
  movimientos: {
    ventasAutomaticas: Array<any>;
    ingresosExtras: Array<any>;
    egresos: Array<any>;
    cancelaciones: Array<any>;
  };
  estadisticas: {
    ventaPromedio: number;
    ventaMasAlta: number;
    ventaMasBaja: number;
    totalCancelaciones: number;
    montoCancelado: number;
  };
}

export interface CreateManualMovementDto {
  amount: number;
  type: "INGRESO" | "EGRESO";
  description: string;
}

export interface CashRegister {
  id: string;
  userId: string;
  openTime: string;
  closeTime: string | null;
  initialMoney: string;
  finalMoney: string | null;
  systemMoney: string | null;
  difference: string | null;
  status: "ABIERTA" | "CERRADA";
  user: {
    id: string;
    name: string;
    username: string;
  };
}

export interface CashRegisterHistory {
  id: string;
  userId: string;
  openTime: string;
  closeTime?: string;
  initialMoney: number;
  finalMoney?: number;
  systemMoney?: number;
  difference?: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  _count: Count;
}

export interface User {
  name: string;
  username: string;
}

export interface Count {
  movements: number;
}

export const cashRegisterApi = {
  getTodayOpen: async (): Promise<CashRegister | null> => {
    const { data } = await axiosInstance.get("/cash-register/today");
    return data;
  },

  open: async (initialMoney: number): Promise<CashRegister> => {
    const { data } = await axiosInstance.post("/cash-register/open", {
      initialMoney,
    });
    return data;
  },

  close: async (id: string, finalMoney: number) => {
    const { data } = await axiosInstance.post(`/cash-register/${id}/close`, {
      finalMoney,
    });
    return data;
  },

  getSummary: async (id: string) => {
    const { data } = await axiosInstance.get(`/cash-register/${id}/summary`);
    return data;
  },

  addMovement: async (
    id: string,
    movement: {
      amount: number;
      type: "INGRESO" | "EGRESO";
      description: string;
    }
  ) => {
    const { data } = await axiosInstance.post(
      `/cash-register/${id}/movements`,
      movement
    );
    return data;
  },

  addManualMovement: async (
    cashRegisterId: string,
    data: CreateManualMovementDto
  ) => {
    const response = await axiosInstance.post(
      `/cash-register/${cashRegisterId}/manual-movement`,
      data
    );
    return response.data;
  },

  getManualMovements: async (cashRegisterId: string) => {
    const { data } = await axiosInstance.get(
      `/cash-register/${cashRegisterId}/manual-movements`
    );
    return data;
  },

  getHistory: async (
    days: number = 30,
    startDate?: string,
    endDate?: string
  ) => {
    const params = new URLSearchParams();
    params.append("days", days.toString());
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const { data } = await axiosInstance.get<CashRegisterHistory[]>(
      `/cash-register/history?${params.toString()}`
    );
    return data;
  },

  getDetails: async (cashRegisterId: string): Promise<CashRegisterDetails> => {
    const { data } = await axiosInstance.get<CashRegisterDetails>(
      `/cash-register/${cashRegisterId}/details`
    );
    return data;
  },

  getDetailsPdf: async (id: string): Promise<CashRegisterDetailsPdf> => {
    const { data } = await axiosInstance.get(`/cash-register/${id}/details`);
    return data;
  },
};
