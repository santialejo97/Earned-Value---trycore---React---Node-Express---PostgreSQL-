import { useQuery } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router";
import { appRouter } from "./router/app.router";
import type { PropsWithChildren } from "react";
import { useAuthStore } from "./auth/store/auth.store";
import { Providers } from "./components/providers/Providers";


const CheckAuthProvider = ({ children }: PropsWithChildren) => {
    const { checkAuthStatus } = useAuthStore()

    const { isLoading } = useQuery({
        queryKey: ['auth'],
        queryFn: checkAuthStatus,
        retry: false,
        refetchInterval: 1000 * 60 * 1.5,
        refetchOnWindowFocus: true
    })

    if (isLoading) {
        // TODO componente de carga
    }

    return children
}

export const EarnedApp = () => {
    return (
        <Providers>
            <CheckAuthProvider>
                <RouterProvider router={appRouter}></RouterProvider>
            </CheckAuthProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </Providers>

    )
}

