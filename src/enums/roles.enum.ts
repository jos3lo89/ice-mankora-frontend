export const Roles = {
  ADMIN: "ADMIN",
  MOZO: "MOZO",
  CAJERO: "CAJERO",
} as const;

export type Roles = (typeof Roles)[keyof typeof Roles];
