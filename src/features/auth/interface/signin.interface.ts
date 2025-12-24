import type { Roles } from "@/enums/roles.enum";

export interface SigninI {
  id: string;
  name: string;
  dni: string;
  username: string;
  role: Roles;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
