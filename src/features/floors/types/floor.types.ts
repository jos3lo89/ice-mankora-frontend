export const TableStatus = {
  LIBRE: "LIBRE",
  OCUPADA: "OCUPADA",
  PIDIENDO_CUENTA: "PIDIENDO_CUENTA",
  SUCIA: "SUCIA",
} as const;

export type TableStatus = (typeof TableStatus)[keyof typeof TableStatus];

export interface Floor {
  id: string;
  name: string;
  level: number;
  createdAt: string;
  updatedAt: string;
  tables: Table[];
}

export interface Table {
  id: string;
  number: number;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  floorId: string;
  status: TableStatus;
  posX: number;
  posY: number;
}
