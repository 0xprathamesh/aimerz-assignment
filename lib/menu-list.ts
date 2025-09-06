import React from "react";
import {
  CheckSquare,
  Calendar,
  BarChart3,
  Settings,
  Users,
  FileText,
  Home,
  Plus,
  Filter,
  Archive,
} from "lucide-react";

interface MenuItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  active: boolean;
  submenus?: MenuItem[];
}

interface MenuGroup {
  groupLabel: string;
  menus: MenuItem[];
}

export function getMenuList(pathname: string): MenuGroup[] {
  const isActive = (href: string) => pathname === href;

  return [
    {
      groupLabel: "Main",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: Home,
          active: isActive("/dashboard"),
        },
        {
          href: "/dashboard/todos",
          label: "My Todos",
          icon: CheckSquare,
          active: isActive("/dashboard/todos"),
        },
        {
          href: "/dashboard/notes",
          label: "Notes",
          icon: FileText,
          active: isActive("/dashboard/notes"),
        },
      ],
    },
    {
      groupLabel: "Tools",
      menus: [

        {
          href: "/dashboard/analytics",
          label: "Analytics",
          icon: BarChart3,
          active: isActive("/dashboard/analytics"),
        },
      ],
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/dashboard/settings",
          label: "Settings",
          icon: Settings,
          active: isActive("/dashboard/settings"),
        },
      ],
    },
  ];
}
