import type { PropsWithChildren } from "react"
import { TooltipProvider } from "../ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"
import { ThemeProvider } from "../theme-provider"


const queryClient = new QueryClient()

export const Providers = ({ children }: PropsWithChildren) => {
    return (
        <QueryClientProvider client={queryClient}>
            <Toaster />
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

                <TooltipProvider>
                    {children}
                </TooltipProvider>

            </ThemeProvider>
        </QueryClientProvider>
    )
}
