"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Pin, PinOff, Tag, Plus } from "lucide-react";
import { Note, CreateNoteData, UpdateNoteData } from "@/types/note";
import { useNoteStore } from "@/lib/stores/note-store";
import { useTodoStore } from "@/lib/stores/todo-store";
import { toast } from "sonner";

interface NoteFormProps {
  note?: Note;
  onClose: () => void;
  todoId?: string;
}

const CATEGORIES = [
  "Work",
  "Health",
  "Finance",
  "Travel",
  "Personal",
  "Education",
  "Shopping",
  "Daily",
  "Ideas",
  "Meeting",
  "Project",
  "Other",
];

const PRIORITIES = [
  { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "high", label: "High", color: "bg-red-100 text-red-800" },
];

export default function NoteForm({ note, onClose, todoId }: NoteFormProps) {
  const { addNote, updateNote } = useNoteStore();
  const { todos } = useTodoStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const [formData, setFormData] = useState<CreateNoteData>({
    title: note?.title || "",
    content: note?.content || "",
    category: note?.category || "Personal",
    priority: note?.priority || "medium",
    isPinned: note?.isPinned || false,
    todoId: note?.todoId || todoId || "",
    tags: note?.tags || [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = note ? `/api/notes/${note._id}` : "/api/notes";
      const method = note ? "PUT" : "POST";
      const body = note ? { ...formData, _id: note._id } : formData;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to save note");
      }

      const { note: savedNote } = await response.json();

      if (note) {
        updateNote(savedNote);
        toast.success("Note updated successfully");
      } else {
        addNote(savedNote);
        toast.success("Note created successfully");
      }

      onClose();
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Failed to save note");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !(formData.tags || []).includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: (formData.tags || []).filter((tag) => tag !== tagToRemove),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const selectedTodo = todos.find((todo) => todo._id === formData.todoId);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-accent bg-background">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{note ? "Edit Note" : "Create New Note"}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter note title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Enter note content"
                rows={6}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger className="dark:bg-accent bg-background">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: "low" | "medium" | "high") =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger className="dark:bg-accent bg-background">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="todoId">Link to Todo (Optional)</Label>
              <Select
                value={formData.todoId || "none"}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    todoId: value === "none" ? undefined : value,
                  })
                    
                }
              >
                <SelectTrigger className="dark:bg-accent bg-background">
                  <SelectValue placeholder="Select a todo to link" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No todo linked</SelectItem>
                  {todos.map((todo) => (
                    <SelectItem key={todo._id} value={todo._id}>
                      {todo.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedTodo && (
                <p className="text-sm text-muted-foreground">
                  Linked to: {selectedTodo.title}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a tag"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddTag}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {(formData.tags || []).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {(formData.tags || []).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant={formData.isPinned ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  setFormData({ ...formData, isPinned: !formData.isPinned })
                }
              >
                {formData.isPinned ? (
                  <Pin className="h-4 w-4 mr-2" />
                ) : (
                  <PinOff className="h-4 w-4 mr-2" />
                )}
                {formData.isPinned ? "Pinned" : "Pin Note"}
              </Button>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : note ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
