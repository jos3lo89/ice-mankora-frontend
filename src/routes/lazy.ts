import { lazy } from "react";

export const SignInPage = lazy(
  () => import("@/features/auth/pages/SignInPage"),
);
export const FloorMapPage = lazy(
  () => import("@/features/floors/pages/FloorMapPage"),
);
export const NotFound = lazy(() => import("@/pages/NotFound"));

export const DashboardAdminPage = lazy(
  () => import("@/features/admin/pages/DashboardPage"),
);

export const TakeOrderPage = lazy(
  () => import("@/features/orders/pages/TakeOrderPage"),
);

export const DashboardCajaPage = lazy(
  () => import("@/features/caja/pages/DashboardPage"),
);

export const UserProfile = lazy(
  () => import("@/features/users/pages/UserProfile"),
);

export const TableDetailPage = lazy(
  () => import("@/features/orders/pages/TableDetailPage"),
);

export const SplitBillPage = lazy(
  () => import("@/features/billing/pages/SplitBillPage"),
);

export const TableDetailMozo = lazy(
  () => import("@/features/orders/pages/TableDetailMozo"),
);

export const ProductsPage = lazy(
  () => import("@/features/admin/pages/ProductsPage"),
);

export const RegisterUserPage = lazy(
  () => import("@/features/users/pages/RegisterUserPage"),
);

export const CashRegisterPage = lazy(
  () => import("@/features/caja/pages/CashRegisterPage"),
);

export const CashRegisterDetailsPage = lazy(
  () => import("@/features/caja/pages/CashRegisterDetailsPage"),
);

export const CategoriesManagementPage = lazy(
  () => import("@/features/category/pages/CategoriesManagementPage"),
);
