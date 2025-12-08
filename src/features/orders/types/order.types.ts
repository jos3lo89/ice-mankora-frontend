import type { Product } from "./catalog.types";

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  variantsDetail?: string;
  saleId: string | null;
  product: Product; // por verce
}

export interface Order {
  id: string;
  tableId: string;
  userId: string;
  status: "PENDIENTE" | "PREPARADO" | "ENTREGADO" | "CANCELADO";
  dailyNumber: number; // ✅ NUEVO
  orderDate: string; // ✅ NUEVO
  table: {
    id: string;
    number: number;
    name: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    status: string; // mejorar con enums
    posX: number;
    posY: number;
    floor: {
      id: string;
      name: string;
      level: number;
      printerIp?: string; // ✅ NUEVO
      printerPort: number; // ✅ NUEVO
      createdAt: string;
      updatedAt: string;
    };
  };
  user: {
    id: string;
    name: string;
    dni: string;
    username: string;
    role: string; // mejorar con enum
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  items: OrderItem[];
  printLogs?: PrintLog[]; // ✅ NUEVO
  createdAt: string;
  total?: number;
}

// ✅ NUEVO: Tipo para logs de impresión
export interface PrintLog {
  id: string;
  orderId: string;
  floorId: string; // ✅ CORRECCIÓN: Por piso
  floor: {
    id: string;
    name: string;
    level: number;
    printerIp?: string;
  };
  status: "PENDING" | "PRINTED" | "FAILED" | "RETRYING";
  attemptCount: number;
  lastAttempt?: string;
  errorMessage?: string;
  printerIp?: string;
  sentData?: any;
  createdAt: string;
  updatedAt: string;
}
