import { Roles } from "@/enums/roles.enum";
import { Box, Home, Table } from "lucide-react";

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
      // {
      //   title: "Caja",
      //   url: "#",
      //   icon: UserPlus,
      //   isActive: true,
      //   items: [
      //     {
      //       title: "Llamar lista",
      //       url: "/attendance/call",
      //     },
      //   ],
      // },
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
