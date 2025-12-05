import type { Roles } from "@/enums/roles.enum";
import { useAuthStore } from "@/stores/useAuthStore";
import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

type props = PropsWithChildren<{ allowedRoles: Roles[] }>;

const RoleGuard = ({ children, allowedRoles }: props) => {
  const { user } = useAuthStore();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};
export default RoleGuard;
