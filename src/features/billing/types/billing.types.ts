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
  TRANSFERENCIA: "TRANSFERENCIA",
} as const;

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export interface CreateSalePayload {
  orderId: string;
  type: ComprobanteType;
  paymentMethod: PaymentMethod;

  // ✅ Nuevo: Datos de pago
  montoPagado?: number; // Cuánto entregó el cliente
  vuelto?: number; // Cuánto se le devuelve

  // Cliente
  clientDocType?: string; // "1" DNI, "6" RUC
  clientDocNumber?: string;
  clientName?: string;
  clientAddress?: string;
  clientEmail?: string;

  // División de cuenta
  itemIds?: string[]; // Si es pago parcial
}

export interface SaleResponse {
  id: string;
  numeroComprobante: string;
  type: ComprobanteType;
  precioVentaTotal: string;
  fechaEmision: Date;
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
    date: Date;
    currency: string;
  };
  client: {
    name: string;
    doc: string;
    docType: string;
    address: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    precioUnitario: number;
    totalItem: number;
  }>;
  totals: {
    subtotal: string;
    igv: string;
    total: string;
    totalLetters: string;
  };
  payment: {
    method: PaymentMethod;
    montoPagado?: number;
    vuelto?: number;
  };
  sunat: {
    hash?: string;
    status: string;
  };
  // ✅ Nuevos campos legales
  metadata: {
    cajero: string;
    mesa: string;
    orden: string;
    fecha: string;
    hora: string;
  };
}

// ✅ Tipos para APIs externas
export interface DNIResponse {
  estado: boolean;
  mensaje: string;
  resultado: {
    id: string;
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string;
    nombre_completo: string;
    codigo_verificacion: string;
  };
}

export interface RUCResponse {
  estado: boolean;
  mensaje: string;
  resultado: {
    id: string;
    razon_social: string;
    condicion: string;
    estado: string;
    direccion: string;
    departamento: string;
    provincia: string;
    distrito: string;
  };
}
