import { Roles } from "@/enums/roles.enum";
import { Box, BoxIcon, Home, Table, UserPlus } from "lucide-react";

export const organization = {
  name: "Ice Mankora",
  description: "",
  logo: "/logo.webp",
};

export const sideBarData = {
  teams: {
    name: "Ice Mankora",
    description: "",
    logo: "/logo.webp",
  },
  navMain: {
    [Roles.ADMIN]: [
      {
        title: "Inicio",
        url: "/admin/dashboard",
        icon: Home,
      },
      {
        title: "Productos",
        url: "/admin/products",
        icon: Box,
      },

      {
        title: "Usuarios",
        url: "#",
        icon: UserPlus,
        isActive: true,
        items: [
          {
            title: "Registrar Usuario",
            url: "/admin/register-user",
          },
        ],
      },

      {
        title: "Caja",
        url: "#",
        icon: BoxIcon,
        items: [
          {
            title: "Apertura-cierre de Caja",
            url: "/admin/cash-register",
          },
        ],
      },

      {
        title: "Categorías",
        url: "#",
        icon: BoxIcon,
        items: [
          {
            title: "Gestión de Categorías",
            url: "/admin/categories-management",
          },
        ],
      },
    ],

    [Roles.CAJERO]: [
      {
        title: "Inicio",
        url: "/caja/dashboard",
        icon: Home,
      },
      {
        title: "Mesas",
        url: "/caja/mesas",
        icon: Table,
      },

      {
        title: "Caja",
        url: "#",
        icon: BoxIcon,
        items: [
          {
            title: "Apertura-cierre de Caja",
            url: "/caja/cash-register",
          },
        ],
      },
    ],

    [Roles.MOZO]: [
      {
        title: "Página Principal",
        url: "/",
        icon: Home,
      },
    ],
  },
};
