import AppSidebar from "@/components/sidebar/AppSidebar";
import SideBarNavMenu from "@/components/sidebar/SidebarNavMenu";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SideBarNavMenu />
        <section className="p-4 w-full max-w-full overflow-hidden">
          <Outlet />
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
};
export default AdminLayout;
