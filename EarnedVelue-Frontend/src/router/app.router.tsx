import { createBrowserRouter, Navigate } from "react-router";
import { lazy } from "react";

import { Login } from "../auth/pages/login/Login";
import { Register } from "../auth/pages/register/Register";


const AuthLayout = lazy(() => import('../auth/layouts/AuthLayout'))

export const appRouter = createBrowserRouter([
    {
        path: '/auth',
        element: <AuthLayout />,
        children: [
            {
                index: true,
                element: <Navigate to='/auth/login'></Navigate>
            },
            {
                path: 'login',
                element: <Login />
            },
            {
                path: 'register',
                element: <Register />
            }
        ]

    }
])