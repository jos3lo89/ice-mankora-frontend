import { Outlet, Link } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  Menu,
  Map,
  LogOut,
  ClipboardList,
  UtensilsCrossed,
} from "lucide-react";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";

// Componentes Shadcn
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MozoLayout = () => {
  const { user, logout } = useAuthStore();

  // Obtener iniciales para el avatar (ej: Juan Perez -> JP)
  const getInitials = (name: string) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"
    );
  };

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      {/* --- HEADER SUPERIOR --- */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-4 h-16 flex items-center justify-between">
        {/* IZQUIERDA: Menú Hamburguesa */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="-ml-2">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle className="text-left text-xl font-bold">
                Menú
              </SheetTitle>
              <SheetDescription></SheetDescription>
            </SheetHeader>

            {/* Navegación dentro del Sheet */}
            <nav className="flex flex-col gap-4 mt-8">
              <SheetClose asChild>
                <Link
                  to="/mozo/map"
                  className="flex items-center gap-3 px-2 py-2 text-lg font-medium hover:bg-accent rounded-md transition-colors"
                >
                  <Map className="h-5 w-5" />
                  Mapa de Mesas
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                  to="/mozo/orders"
                  className="flex items-center gap-3 px-2 py-2 text-lg font-medium hover:bg-accent rounded-md transition-colors"
                >
                  <ClipboardList className="h-5 w-5" />
                  Mis Pedidos
                </Link>
              </SheetClose>

              {/* Agrega más enlaces aquí si necesitas */}
            </nav>
          </SheetContent>
        </Sheet>

        {/* CENTRO: Título o Logo (Opcional, puede ir vacío) */}
        <div className="font-semibold text-lg flex items-center gap-2 text-pink-600">
          <UtensilsCrossed size={20} />
          <span>Ice Mankora</span>
        </div>

        {/* DERECHA: Usuario y Tema */}
        <div className="flex items-center gap-2">
          <ModeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8 border">
                  <AvatarImage src="" alt={user?.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {getInitials(user?.name || "")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Mozo / Personal
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={logout}
                className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex-1 overflow-y-auto p-4 custom-scroll relative">
        <Outlet />
      </main>
    </div>
  );
};

export default MozoLayout;
