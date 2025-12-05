import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

const RootRedirect = () => {
  const { isAuth, user } = useAuthStore();

  if (!isAuth || !user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case "ADMIN":
      return <Navigate to="/admin/dashboard" replace />;
    case "CAJERO":
      return <Navigate to="/caja/dashboard" replace />;
    case "MOZO":
      return <Navigate to="/mozo/map" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default RootRedirect;
