import { Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { LogOut, Map } from "lucide-react";
import { ModeToggle } from "@/components/theme/mode-toggle";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import BackButton from "@/components/BackButton";

const MozoLayout = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="h-screen flex flex-col">
      <header className="p-4 flex justify-between items-center shadow-lg dark:bg-gray-800 bg-gray-50">
        <div>
          <h1 className="font-semibold">Hola, {user?.name}</h1>
        </div>

        <div className="flex gap-2">
          <BackButton to="/mozo/map" title="Mesas" />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <LogOut size={20} />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Cerrar sesión?</AlertDialogTitle>
                <AlertDialogDescription>
                  Se cerrará tu sesión actual. Tendrás que iniciar sesión
                  nuevamente.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700"
                  onClick={logout}
                >
                  Cerrar sesión
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <ModeToggle />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4  custom-scroll">
        <Outlet />
      </main>

      <nav className="border-t p-3 flex justify-around shadow-inner dark:bg-gray-800 bg-gray-50">
        <Button variant="ghost" className="flex flex-col gap-1 h-auto">
          <Map size={24} />
          <span className="text-[10px]">Mapa</span>
        </Button>
      </nav>
    </div>
  );
};

export default MozoLayout;
