import { Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";

const CajaLayout = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Lateral */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col p-4">
        <div className="mb-8 font-bold text-xl text-primary">
          CAJA PRINCIPAL
        </div>
        <nav className="flex-1 space-y-2">
          <Button variant="secondary" className="w-full justify-start">
            Facturación
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Cierre de Caja
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Mapa Mesas
          </Button>
        </nav>
        <Button variant="destructive" onClick={logout}>
          Cerrar Turno
        </Button>
      </aside>

      {/* Contenido */}
      <main className="flex-1 p-8 overflow-auto">
        <header className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold">Panel de Caja</h2>
          <span>{user?.name}</span>
        </header>
        <Outlet />
      </main>
    </div>
  );
};

export default CajaLayout;
