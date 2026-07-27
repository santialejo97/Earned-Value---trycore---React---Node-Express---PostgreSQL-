import { createBrowserRouter, Navigate } from "react-router";
import { lazy } from "react";

import { Login } from "../auth/pages/login/Login";
import { Register } from "../auth/pages/register/Register";
import { ProjectLayout } from "@/project/layouts/ProjectLayout";
import { ActivitiesPage } from "@/project/pages/activities/ActivitiesPage";
import { ProjectsPage } from "@/project/pages/projects/ProjectsPage";
import { AuthenticatedRoute, NotAuthenticatedRoute } from "@/components/routes/ProtectedRoutes";


const AuthLayout = lazy(() => import('../auth/layouts/AuthLayout'))

export const appRouter = createBrowserRouter([
    {
        path: '/',
        element: <AuthenticatedRoute><ProjectLayout /></AuthenticatedRoute>,
        children: [
            {
                index: true,
                element: <Navigate to="/projects" replace />
            },
            {
                path: 'projects',
                element: <ProjectsPage />
            },
            {
                path: 'activities',
                element: <ActivitiesPage />
            },
        ]
    },
    {
        path: '/auth',
        element: <NotAuthenticatedRoute><AuthLayout /></NotAuthenticatedRoute>,
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

    },
    {
        path: '*',
        element: <Navigate to={'/'} />
    }
])