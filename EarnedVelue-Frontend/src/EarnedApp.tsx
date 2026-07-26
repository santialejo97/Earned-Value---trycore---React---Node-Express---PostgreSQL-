import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router";
import { appRouter } from "./router/app.router";
import { ThemeProvider } from "./components/theme-provider";

const queryClient = new QueryClient()

export const EarnedApp = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <RouterProvider router={appRouter}></RouterProvider>
                <ReactQueryDevtools initialIsOpen={false} />
            </ThemeProvider>
        </QueryClientProvider>
    )
}

