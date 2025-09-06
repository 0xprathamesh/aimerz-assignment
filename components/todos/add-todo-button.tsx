"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddTodoButtonProps {
  onClick: () => void;
  className?: string;
}

export default function AddTodoButton({
  onClick,
  className,
}: AddTodoButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="sm"
      className={`h-9 px-4 text-sm font-medium ${className}`}
    >
      <Plus className="h-4 w-4 mr-2" />
      Add Todo
    </Button>
  );
}
