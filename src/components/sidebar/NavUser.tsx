import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { useAuthStore } from "@/stores/useAuthStore";
import { Loader2 } from "lucide-react";
import UserMenu from "./UserMenu";

const NavUser = () => {
  const { user, logout } = useAuthStore();

  if (!user) {
    return <Loader2 className="animate-spin w-6 h-6" />;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <UserMenu user={user} logout={logout} />
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default NavUser;
