import { createBrowserRouter } from "react-router-dom";
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
  DashboardCajaPage,
  FloorMapPage,
  NotFound,
  SignInPage,
  SplitBillPage,
  TableDetailMozo,
  TableDetailPage,
  TakeOrderPage,
  UserProfile,
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
        element: (
          <Suspense fallback={<Loading />}>
            <DashboardAdminPage />
          </Suspense>
        ),
      },
      {
        path: "/admin/profile",
        element: (
          <Suspense fallback={<Loading />}>
            <UserProfile />
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

      {
        path: "table/:id/detail",
        element: (
          <Suspense fallback={<Loading />}>
            <TableDetailMozo />
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
        path: "dashboard",
        element: (
          <Suspense fallback={<Loading />}>
            <DashboardCajaPage />
          </Suspense>
        ),
      },
      {
        path: "map",
        element: (
          <Suspense fallback={<Loading />}>
            <FloorMapPage />
          </Suspense>
        ),
      },
      {
        path: "profile",
        element: (
          <Suspense fallback={<Loading />}>
            <UserProfile />
          </Suspense>
        ),
      },
      {
        path: "mesas",
        element: (
          <Suspense fallback={<Loading />}>
            <FloorMapPage />
          </Suspense>
        ),
      },
      {
        path: "table/:id/details",
        element: (
          <Suspense fallback={<Loading />}>
            <TableDetailPage />
          </Suspense>
        ),
      },
      {
        path: "table/:id/split",
        element: (
          <Suspense fallback={<Loading />}>
            <SplitBillPage />
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
