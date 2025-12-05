import { useAuthStore } from "@/stores/useAuthStore";
import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

const AuthGuard = ({ children }: PropsWithChildren) => {
  const { isAuth, user } = useAuthStore();

  if (!isAuth || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
export default AuthGuard;
