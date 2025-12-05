import { createBrowserRouter, Navigate } from "react-router-dom";
import { Suspense } from "react";
import AuthLayout from "@/layout/AuthLayout";
import MozoLayout from "@/layout/MozoLayout";
import CajaLayout from "@/layout/CajaLayout";
import GuestGuard from "@/guards/GuestGuard";
import RoleGuard from "@/guards/RoleGuard";
import RootRedirect from "@/components/RootRedirect";
import { Roles } from "@/enums/roles.enum";
import {
  DashboardAdminPage,
  FloorMapPage,
  NotFound,
  SignInPage,
  TakeOrderPage,
} from "./lazy";
import Loading from "@/components/Loading";
import AuthGuard from "@/guards/AuthGuard";
import AdminLayout from "@/layout/AdminLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />,
  },

  {
    element: (
      <AuthGuard>
        <RoleGuard allowedRoles={[Roles.ADMIN]}>
          <AdminLayout />
        </RoleGuard>
      </AuthGuard>
    ),
    children: [
      {
        path: "/admin/dashboard",
        element: <DashboardAdminPage />,
      },
    ],
  },

  {
    element: (
      <GuestGuard>
        <AuthLayout />
      </GuestGuard>
    ),
    children: [
      {
        path: "/login",
        element: (
          <Suspense fallback={<Loading />}>
            <SignInPage />
          </Suspense>
        ),
      },
    ],
  },

  {
    path: "mozo",
    element: (
      <RoleGuard allowedRoles={[Roles.MOZO]}>
        <MozoLayout />
      </RoleGuard>
    ),
    children: [
      {
        path: "map",
        element: (
          <Suspense fallback={<Loading />}>
            <FloorMapPage />
          </Suspense>
        ),
      },
      {
        path: "order/new",
        element: (
          <Suspense fallback={<Loading />}>
            <TakeOrderPage />
          </Suspense>
        ),
      },
    ],
  },

  {
    path: "/caja",
    element: (
      <RoleGuard allowedRoles={[Roles.CAJERO, Roles.ADMIN]}>
        <CajaLayout />
      </RoleGuard>
    ),
    children: [
      {
        path: "",
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <div>Dashboard de Caja (Pendiente)</div>,
      },
      {
        path: "map",
        element: (
          <Suspense fallback={<Loading />}>
            <FloorMapPage />
          </Suspense>
        ),
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);
