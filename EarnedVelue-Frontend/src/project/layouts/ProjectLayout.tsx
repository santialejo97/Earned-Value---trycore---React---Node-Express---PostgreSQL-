
import { Outlet } from "react-router"
import { AppSidebar } from "../components/AppSidebar"
import { CustomerHeader } from "../components/CustomerHeader"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"


export const ProjectLayout = () => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <CustomerHeader />
                <div className="flex flex-1 flex-col p-6 md:p-10">
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
