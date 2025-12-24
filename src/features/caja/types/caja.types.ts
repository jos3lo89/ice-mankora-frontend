export interface CashRegisterDetailsPdf {
  cashRegister: CashRegister;
  totales: Totales;
  ventas: Ventas;
  movimientos: Movimientos;
  estadisticas: Estadisticas;
}

export interface CashRegister {
  id: string;
  userId: string;
  openTime: string;
  closeTime: any;
  initialMoney: number;
  finalMoney: any;
  systemMoney: number;
  difference: any;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  movements: Movement[];
  duracionHoras: number;
}

export interface User {
  id: string;
  name: string;
  username: string;
  role: string;
}

export interface Movement {
  id: string;
  cashRegisterId: string;
  amount: string;
  type: string;
  description: string;
  isAutomatic: boolean;
  createdAt: string;
  updatedAt: string;
  metadata: Metadata;
}

export interface Metadata {
  mozoId?: string;
  saleId?: string;
  orderId?: string;
  tableId?: string;
  cajeroId?: string;
  mozoName?: string;
  wasSplit?: boolean;
  tableName?: string;
  cajeroName?: string;
  clientName?: string;
  itemsCount?: number;
  orderNumber?: number;
  paymentMethod?: string;
  comprobanteTipo?: string;
  numeroComprobante?: string;
  type?: string;
  items?: Item[];
  reason?: string;
  floorId?: string;
  mozeroId?: string;
  cancelledAt?: string;
  tableNumber?: number;
  totalPedido?: number;
  authorizedBy?: string;
  authorizedByName?: string;
  movementType?: string;
  registeredAt?: string;
  registeredBy?: RegisteredBy;
}

export interface Item {
  price: number;
  quantity: number;
  subtotal: number;
  productId: string;
  productName: string;
}

export interface RegisteredBy {
  id: string;
  name: string;
  username: string;
}

export interface Totales {
  inicial: number;
  ventas: number;
  ingresosExtras: number;
  egresos: number;
  esperado: number;
  contado: any;
  diferencia: any;
}

export interface Ventas {
  total: number;
  monto: number;
  porMetodo: PorMetodo;
  porTipo: PorTipo;
  listado: Listado[];
}

export interface PorMetodo {
  EFECTIVO: Efectivo;
}

export interface Efectivo {
  count: number;
  total: number;
  sales: Sale[];
}

export interface Sale {
  id: string;
  numeroComprobante: string;
  total: number;
  createdAt: string;
}

export interface PorTipo {
  TICKET: Ticket;
}

export interface Ticket {
  count: number;
  total: number;
}

export interface Listado {
  id: string;
  numeroComprobante: string;
  type: string;
  paymentMethod: string;
  total: number;
  igv: number;
  valorVenta: number;
  cliente: string;
  clienteDoc: string;
  cajero: string;
  mesa: string;
  ordenNumero: number;
  createdAt: string;
  metadata: Metadata2;
}

export interface Metadata2 {
  mesa: string;
  mozo: string;
  orden: string;
  cajero: string;
  esDivision: boolean;
  totalItems: number;
  itemsPagados: number;
}

export interface Movimientos {
  ventasAutomaticas: VentasAutomatica[];
  ingresosExtras: IngresosExtra[];
  egresos: Egreso[];
  cancelaciones: Cancelacione[];
}

export interface VentasAutomatica {
  id: string;
  cashRegisterId: string;
  amount: number;
  type: string;
  description: string;
  isAutomatic: boolean;
  createdAt: string;
  updatedAt: string;
  metadata: Metadata3;
}

export interface Metadata3 {
  mozoId: string;
  saleId: string;
  orderId: string;
  tableId: string;
  cajeroId: string;
  mozoName: string;
  wasSplit: boolean;
  tableName: string;
  cajeroName: string;
  clientName: string;
  itemsCount: number;
  orderNumber: number;
  paymentMethod: string;
  comprobanteTipo: string;
  numeroComprobante: string;
}

export interface IngresosExtra {
  id: string;
  cashRegisterId: string;
  amount: number;
  type: string;
  description: string;
  isAutomatic: boolean;
  createdAt: string;
  updatedAt: string;
  metadata: Metadata4;
}

export interface Metadata4 {
  movementType: string;
  registeredAt: string;
  registeredBy: RegisteredBy2;
}

export interface RegisteredBy2 {
  id: string;
  name: string;
  username: string;
}

export interface Egreso {
  id: string;
  cashRegisterId: string;
  amount: number;
  type: string;
  description: string;
  isAutomatic: boolean;
  createdAt: string;
  updatedAt: string;
  metadata: Metadata5;
}

export interface Metadata5 {
  movementType: string;
  registeredAt: string;
  registeredBy: RegisteredBy3;
}

export interface RegisteredBy3 {
  id: string;
  name: string;
  username: string;
}

export interface Cancelacione {
  id: string;
  orderId: string;
  orderNumber: number;
  tableName: string;
  tableNumber: number;
  reason: string;
  authorizedBy: string;
  itemsCount: number;
  items: Item2[];
  totalPedido: number;
  cancelledAt: string;
  createdAt: string;
}

export interface Item2 {
  price: number;
  quantity: number;
  subtotal: number;
  productId: string;
  productName: string;
}

export interface Estadisticas {
  ventaPromedio: number;
  ventaMasAlta: number;
  ventaMasBaja: number;
  totalCancelaciones: number;
  montoCancelado: number;
}
