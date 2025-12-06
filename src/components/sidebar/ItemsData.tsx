import { Roles } from "@/enums/roles.enum";
import { UserPlus, Home } from "lucide-react";

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
        title: "Asistencia",
        url: "#",
        icon: UserPlus,
        isActive: true,
        items: [
          {
            title: "Llamar lista",
            url: "/attendance/call",
          },
        ],
      },
    ],

    [Roles.CAJERO]: [
      {
        title: "Inicio",
        url: "/",
        icon: Home,
      },
      {
        title: "Caja",
        url: "#",
        icon: UserPlus,
        isActive: true,
        items: [
          {
            title: "Llamar lista",
            url: "/attendance/call",
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
