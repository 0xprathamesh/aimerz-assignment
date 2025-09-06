"use client";

import { List, Calendar, Kanban, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ViewType = "list" | "board" | "calendar";

interface ViewSwitcherProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onAddTask: () => void;
}

export default function ViewSwitcher({
  currentView,
  onViewChange,
  onAddTask,
}: ViewSwitcherProps) {
  const views = [
    { id: "list" as const, label: "List", icon: List },
    { id: "board" as const, label: "Board", icon: Kanban },
    { id: "calendar" as const, label: "Calendar", icon: Calendar },
  ];

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-1 bg-muted p-1 rounded-lg">
        {views.map((view) => {
          const Icon = view.icon;
          return (
            <Button
              key={view.id}
              variant={currentView === view.id ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange(view.id)}
              className={cn(
                "flex items-center gap-2",
                currentView === view.id && "shadow-sm"
              )}
            >
              <Icon className="h-4 w-4" />
              {view.label}
            </Button>
          );
        })}
      </div>
      <div className="md:flex hidden items-center gap-2">
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
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
                  useUiStore.getState().setDashboardBackground(opt.id as any)
                }
                className="cursor-pointer"
              >
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu> */}
        <Button
          onClick={onAddTask}
          size="sm"
          className="flex items-center gap-2 "
        >
          <Plus className="h-4 w-4" />
          Add task
        </Button>
      </div>
    </div>
  );
}
