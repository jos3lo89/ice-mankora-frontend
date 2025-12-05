import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Organization } from "./Organization";
import { NavMain } from "./NavMain";
import NavUser from "./NavUser";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";

const AppSidebar = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const role = user?.role;

  if (!role) navigate("/signin");

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <Organization />
      </SidebarHeader>
      <SidebarContent>
        <NavMain role={role} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
