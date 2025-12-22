import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { DollarSign, Utensils } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  if (!user) {
    return null;
  }

  const route = user.role === "CAJERO" ? "caja" : "admin";

  const links = [
    {
      title: "Caja",
      icon: DollarSign,
      path: `/${route}/cash-register`,
      color: "text-green-600",
      bg: "",
    },
    // {
    //   title: "Categorías",
    //   icon: Package,
    //   path: `/${route}/categories-management`,
    //   color: "text-blue-600",
    //   bg: "",
    // },
    // {
    //   title: "Usuarios",
    //   icon: Users,
    //   path: `/${route}/register-user`,
    //   color: "text-purple-600",
    //   bg: "",
    // },
    {
      title: "Mesas",
      icon: Utensils,
      path: `/${route}/mesas`,
      color: "text-orange-600",
      bg: "",
    },
    // {
    //   title: "Pedidos",
    //   icon: ClipboardList,
    //   path: `/${route}/orders`,
    //   color: "text-cyan-600",
    //   bg: "",
    // },
    // {
    //   title: "Ventas",
    //   icon: ShoppingCart,
    //   path: `/${route}/sales`,
    //   color: "text-pink-600",
    //   bg: "",
    // },
    // {
    //   title: "Reportes",
    //   icon: BarChart3,
    //   path: `/${route}/reports`,
    //   color: "text-indigo-600",
    //   bg: "",
    // },
    // {
    //   title: "Pisos",
    //   icon: FolderOpen,
    //   path: `/${route}/floors`,
    //   color: "text-amber-600",
    //   bg: "",
    // },
  ];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {links.map(({ title, icon: Icon, path, color, bg }) => (
            <Card
              key={path}
              className={`${bg} border-none cursor-pointer transition-all hover:scale-105 hover:shadow-lg`}
              onClick={() => navigate(path)}
            >
              <div className="p-6 flex flex-col items-center gap-3">
                <Icon className={`h-12 w-12 ${color}`} />
                <h3 className="font-semibold text-center">{title}</h3>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
