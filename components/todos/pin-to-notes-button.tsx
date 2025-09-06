"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pin, Plus } from "lucide-react";
import { Todo } from "@/types/todo";
import { useNoteStore } from "@/lib/stores/note-store";
import { toast } from "sonner";

interface PinToNotesButtonProps {
  todo: Todo;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

export default function PinToNotesButton({
  todo,
  variant = "ghost",
  size = "sm",
}: PinToNotesButtonProps) {
  const { addNote } = useNoteStore();
  const [isCreating, setIsCreating] = useState(false);

  const handlePinToNotes = async () => {
    setIsCreating(true);
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `Note for: ${todo.title}`,
          content: `Task: ${todo.title}\n\nDescription: ${
            todo.description
          }\n\nStatus: ${todo.status}\n\nPriority: ${
            todo.priority
          }\n\nDue: ${new Date(todo.endDate).toLocaleDateString()}`,
          category: todo.category,
          priority: todo.priority,
          isPinned: true,
          todoId: todo._id,
          tags: ["todo", "pinned"],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create note");
      }

      const { note } = await response.json();
      addNote(note);
      toast.success("Todo pinned to notes");
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error("Failed to pin todo to notes");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handlePinToNotes}
      disabled={isCreating}
      className="gap-2"
    >
      {isCreating ? (
        <Plus className="h-4 w-4 animate-spin" />
      ) : (
        <Pin className="h-4 w-4" />
      )}
      {isCreating ? "Creating..." : "Pin to Notes"}
    </Button>
  );
}
