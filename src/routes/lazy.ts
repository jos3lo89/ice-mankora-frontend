import { lazy } from "react";

export const SignInPage = lazy(
  () => import("@/features/auth/pages/SignInPage")
);
export const FloorMapPage = lazy(
  () => import("@/features/floors/pages/FloorMapPage")
);
export const NotFound = lazy(() => import("@/pages/NotFound"));

export const DashboardAdminPage = lazy(
  () => import("@/features/admin/pages/DashboardPage")
);

export const TakeOrderPage = lazy(
  () => import("@/features/orders/pages/TakeOrderPage")
);

export const DashboardCajaPage = lazy(
  () => import("@/features/caja/pages/DashboardPage")
);

export const UserProfile = lazy(
  () => import("@/features/users/pages/UserProfile")
);
