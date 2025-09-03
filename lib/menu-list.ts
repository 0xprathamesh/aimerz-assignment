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

export function getMenuList(
  pathname: string,
  _userType: string = "user"
): MenuGroup[] {
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
          href: "/dashboard/todos/create",
          label: "Create Todo",
          icon: Plus,
          active: isActive("/dashboard/todos/create"),
        },
      ],
    },
    {
      groupLabel: "Organization",
      menus: [
        {
          href: "/dashboard/calendar",
          label: "Calendar",
          icon: Calendar,
          active: isActive("/dashboard/calendar"),
        },
        {
          href: "/dashboard/analytics",
          label: "Analytics",
          icon: BarChart3,
          active: isActive("/dashboard/analytics"),
        },
        {
          href: "/dashboard/team",
          label: "Team",
          icon: Users,
          active: isActive("/dashboard/team"),
        },
      ],
    },
    {
      groupLabel: "Tools",
      menus: [
        {
          href: "/dashboard/categories",
          label: "Categories",
          icon: Filter,
          active: isActive("/dashboard/categories"),
        },
        {
          href: "/dashboard/archive",
          label: "Archive",
          icon: Archive,
          active: isActive("/dashboard/archive"),
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
