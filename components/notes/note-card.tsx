"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pin,
  PinOff,
  Edit,
  Trash2,
  MoreVertical,
  Tag,
  Calendar,
  Link,
} from "lucide-react";
import { Note } from "@/types/note";
import { useNoteStore } from "@/lib/stores/note-store";
import { useTodoStore } from "@/lib/stores/todo-store";
import { toast } from "sonner";
import { format } from "date-fns";

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
}

const PRIORITY_COLORS = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

export default function NoteCard({ note, onEdit }: NoteCardProps) {
  const { updateNote, deleteNote } = useNoteStore();
  const { todos } = useTodoStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleTogglePin = async () => {
    try {
      const response = await fetch(`/api/notes/${note._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isPinned: !note.isPinned,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update note");
      }

      const { note: updatedNote } = await response.json();
      updateNote(updatedNote);
      toast.success(updatedNote.isPinned ? "Note pinned" : "Note unpinned");
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Failed to update note");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this note?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/notes/${note._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      deleteNote(note._id);
      toast.success("Note deleted successfully");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    } finally {
      setIsDeleting(false);
    }
  };

  const linkedTodo = note.todoId
    ? todos.find((todo) => todo._id === note.todoId)
    : null;

  return (
    <Card
      className={`group hover:shadow-md transition-all duration-200 ${
        note.isPinned ? "ring-2 ring-yellow-400" : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{note.title}</h3>
            {note.isPinned && (
              <div className="flex items-center gap-1 mt-1">
                <Pin className="h-3 w-3 text-yellow-600" />
                <span className="text-xs text-yellow-600 font-medium">
                  Pinned
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={PRIORITY_COLORS[note.priority]}
            >
              {note.priority}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(note)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleTogglePin}>
                  {note.isPinned ? (
                    <>
                      <PinOff className="h-4 w-4 mr-2" />
                      Unpin
                    </>
                  ) : (
                    <>
                      <Pin className="h-4 w-4 mr-2" />
                      Pin
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? "Deleting..." : "Delete"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {note.content}
          </p>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{note.category}</Badge>
              {linkedTodo && (
                <div className="flex items-center gap-1">
                  <Link className="h-3 w-3" />
                  <span className="truncate max-w-32">{linkedTodo.title}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(new Date(note.createdAt), "MMM d")}
            </div>
          </div>

          {note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {note.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs flex items-center gap-1"
                >
                  <Tag className="h-2 w-2" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
