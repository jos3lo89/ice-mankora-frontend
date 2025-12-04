import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../layout/AuthLayout";
import SignIn from "@/features/auth/SignIn";

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/",
        element: <SignIn />,
      },
    ],
  },
]);
