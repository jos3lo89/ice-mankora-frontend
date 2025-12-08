import { Outlet, Link } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  Menu,
  Map,
  LogOut,
  ClipboardList,
  UtensilsCrossed,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/components/theme/theme-provider";
import { OrderSummary } from "@/features/orders/components/OrderSummary";

const MozoLayout = () => {
  const { user, logout } = useAuthStore();
  const { setTheme } = useTheme();

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
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-4 h-16 flex items-center justify-between">
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
            </nav>
          </SheetContent>
        </Sheet>

        <div className="font-semibold text-lg flex items-center gap-2 text-pink-600">
          <UtensilsCrossed size={20} />
          <span>Ice Mankora</span>
        </div>

        <div className="flex items-center gap-2">
          <OrderSummary />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8 border">
                  <AvatarImage src="" alt={user?.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
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

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="ml-2">Apariencia</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                      <Sun className="mr-2 h-4 w-4" />
                      <span>Claro</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                      <Moon className="mr-2 h-4 w-4" />
                      <span>Oscuro</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                      <Laptop className="mr-2 h-4 w-4" />
                      <span>Sistema</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 custom-scroll relative">
        <Outlet />
      </main>
    </div>
  );
};

export default MozoLayout;
