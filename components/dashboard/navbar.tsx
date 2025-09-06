"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { UserNav } from "@/components/dashboard/user-nav";
import { SheetMenu } from "@/components/dashboard/sheet-menu";
import BackendStatus from "@/components/backend-status";
import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/lib/stores/ui-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  title: string;
}
type DashboardBg = "none" | "slate" | "zinc" | "gradient" | "dots";
//  <header className="fixed top-0 inset-x-0 z-20 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">

export function Navbar({ title }: NavbarProps) {
  return (
    <header className="fixed top-0 inset-x-2 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
          <h1 className="font-bold">{title}</h1>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <BackendStatus />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex items-center gap-2"
              >
                <Palette className="h-4 w-4" />
                Customize
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {[
                { id: "none", label: "Default" },
                { id: "slate", label: "Slate" },
                { id: "zinc", label: "Zinc" },
                { id: "gradient", label: "Gradient" },
                { id: "dots", label: "Dots" },
              ].map((opt) => (
                <DropdownMenuItem
                  key={opt.id}
                  onClick={() =>
                    useUiStore
                      .getState()
                      .setDashboardBackground(opt.id as DashboardBg)
                  }
                  className="cursor-pointer"
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
