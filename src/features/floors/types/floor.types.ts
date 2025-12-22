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
  tables: Table[];
}

export interface Table {
  id: string;
  number: number;
  status: TableStatus;
}
