import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar/AppSidebar";
import SideBarNavMenu from "@/components/sidebar/SidebarNavMenu";

const CajaLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SideBarNavMenu />
        <section className="p-4">
          <Outlet />
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default CajaLayout;
