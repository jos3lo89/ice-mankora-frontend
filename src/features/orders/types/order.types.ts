import type { Product } from "./catalog.types";

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  notes?: string;
  variantsDetail?: string;
  product: Product;
}

export interface Order {
  id: string;
  tableId: string;
  status: "PENDIENTE" | "PREPARADO" | "ENTREGADO" | "CANCELADO";
  items: OrderItem[];
  createdAt: string;
  total?: number;
}
