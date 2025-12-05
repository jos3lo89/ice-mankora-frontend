import { Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { LogOut, Map } from "lucide-react";
import { ModeToggle } from "@/components/theme/mode-toggle";

const MozoLayout = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen">
      <header className=" p-4 flex justify-between items-center shadow-lg sticky top-0 z-10">
        <div>
          <h1 className="font-bold">Hola, {user?.name}</h1>
          <p className="text-xs opacity-90">Mozo - Ice Mankora</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={logout} className="">
            <LogOut size={20} />
          </Button>
          <ModeToggle />
        </div>
      </header>

      <main className="p-4 max-w-5xl mx-auto">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 w-full border-t p-3 flex justify-around shadow-inner">
        <Button variant="ghost" className="flex flex-col gap-1 h-auto">
          <Map size={24} />
          <span className="text-[10px]">Mapa</span>
        </Button>
      </nav>
    </div>
  );
};

export default MozoLayout;
