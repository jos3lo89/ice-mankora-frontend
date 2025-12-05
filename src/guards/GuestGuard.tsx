import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import type { PropsWithChildren } from "react";

const GuestGuard = ({ children }: PropsWithChildren) => {
  const { user, isAuth } = useAuthStore();

  if (isAuth && user) {
    return <Navigate to="/" replace />;
  }

  return children;
};
export default GuestGuard;
