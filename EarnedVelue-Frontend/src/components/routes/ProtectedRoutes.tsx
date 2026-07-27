import { useAuthStore } from "@/auth/store/auth.store";
import type { PropsWithChildren } from "react";
import { Navigate } from "react-router";



export const AuthenticatedRoute = ({ children }: PropsWithChildren) => {
    const { authStatus } = useAuthStore()
    if (authStatus == 'checking') return null
    if (authStatus == 'not-authenticated') return <Navigate to={'/auth/login'}></Navigate>

    return children
}

export const NotAuthenticatedRoute = ({ children }: PropsWithChildren) => {
    const { authStatus } = useAuthStore()
    if (authStatus == 'checking') return null
    if (authStatus == 'authenticated') return <Navigate to={'/'}></Navigate>

    return children
}