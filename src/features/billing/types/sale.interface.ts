import type { ComprobanteType } from "./billing.types";

export interface SaleResponse {
  id: string;
  numeroComprobante: string;
  type: ComprobanteType;
  total: number;
  cashMovement?: {
    cashRegisterId: string;
    amount: number;
    type: string;
    registered: boolean;
  };
  orderStatus?: {
    allItemsPaid: boolean;
    totalItems: number;
    paidItems: number;
    orderClosed: boolean;
  };
}

export interface PrintData {
  company: {
    ruc: string;
    name: string;
    address: string;
    logo: string;
  };
  document: {
    type: string;
    number: string;
    date: string | Date;
    currency: string;
  };
  client: {
    name: string;
    doc: string;
    docType: string;
    address: string;
  };
  items: Array<{
    quantity: number;
    description: string;
    precioUnitario: number;
    totalItem: number;
  }>;
  totals: {
    subtotal: number;
    igv: number;
    total: number;
    totalLetters: string;
  };
  payment: {
    method: string;
    montoPagado?: number;
    vuelto?: number;
  };
  sunat: {
    hash?: string;
    status: string;
  };
  metadata: {
    mesa: string;
    orden: string;
    cajero: string;
    fecha: string;
    hora: string;
  };
}
