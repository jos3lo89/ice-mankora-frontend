import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../layout/AuthLayout";

export const router = createBrowserRouter([
    {
        element: <AuthLayout />,
        children: [
            {
                path: "/",
                element: <h1>Home</h1>,
            },
        ],
    },
]);