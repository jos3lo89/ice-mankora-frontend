export const ComprobanteType = {
  BOLETA: "BOLETA",
  FACTURA: "FACTURA",
  TICKET: "TICKET",
} as const;

export type ComprobanteType =
  (typeof ComprobanteType)[keyof typeof ComprobanteType];

export const PaymentMethod = {
  EFECTIVO: "EFECTIVO",
  TARJETA: "TARJETA",
  YAPE: "YAPE",
  PLIN: "PLIN",
} as const;

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export interface CreateSalePayload {
  orderId: string;
  type: ComprobanteType;
  paymentMethod: PaymentMethod;
  clientDocType?: string; // "1" (DNI), "6" (RUC)
  clientDocNumber?: string;
  clientName?: string;
  clientAddress?: string;
}

export interface SaleResponse {
  id: string;
  serie: string;
  correlativo: number;
  numeroComprobante: string;
  total: number;
}

export interface PrintData {
  company: {
    ruc: string;
    name: string;
    address: string;
    logo?: string;
  };
  document: {
    type: ComprobanteType;
    number: string;
    date: string;
    currency: string;
  };
  client: {
    name: string;
    doc: string;
    address: string;
  };
  items: {
    quantity: number;
    description: string;
    totalItem: number;
  }[];
  totals: {
    subtotal: number;
    igv: number;
    total: number;
    totalLetters: string;
  };
}
