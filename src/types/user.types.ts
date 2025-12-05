import type { Roles } from "@/enums/roles.enum";

export interface User {
  userId: string;
  name: string;
  role: Roles;
  allowedFloorIds: string[];
}
