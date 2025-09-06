"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTodoStore } from "@/lib/stores/todo-store";
import { toast } from "sonner";
import {
  CATEGORIES,
  PRIORITIES,
  CATEGORY_DOT_COLORS,
  PRIORITY_DOT_COLORS,
  Priority,
} from "@/lib/constants";

interface TodoFormProps {
  todo?: {
    _id: string;
    title: string;
    description: string;
    category: string;
    status: "pending" | "completed";
    startDate: string;
    endDate: string;
    priority: "low" | "medium" | "high";
  } | null;
  onClose?: () => void;
  selectedDate?: Date | null;
}

export default function TodoForm({
  todo,
  onClose,
  selectedDate,
}: TodoFormProps) {
  const router = useRouter();
  const { addTodo, updateTodo, setError } = useTodoStore();

  const [formData, setFormData] = useState({
    title: todo?.title || "",
    description: todo?.description || "",
    category: todo?.category || "",
    status: todo?.status || "pending",
    priority: todo?.priority || "medium",
    startDate: todo?.startDate
      ? new Date(todo.startDate)
      : selectedDate || new Date(),
    endDate: todo?.endDate
      ? new Date(todo.endDate)
      : selectedDate || new Date(),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title cannot exceed 100 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length > 500) {
      newErrors.description = "Description cannot exceed 500 characters";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    } else {
      if (!todo) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(formData.startDate);
        startDate.setHours(0, 0, 0, 0);

        if (startDate < today) {
          newErrors.startDate = "Start date cannot be in the past";
        }
      }
    }

    if (formData.category !== "Daily") {
      if (!formData.endDate) {
        newErrors.endDate = "End date is required";
      } else {
        if (!todo) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const endDate = new Date(formData.endDate);
          endDate.setHours(0, 0, 0, 0);

          if (endDate < today) {
            newErrors.endDate = "End date cannot be in the past";
          }
        }

        if (formData.endDate < formData.startDate) {
          newErrors.endDate = "End date must be on or after start date";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        const element = document.getElementById(firstError);
        element?.focus();
      }
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const normalizeDate = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const utcDate = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
        return utcDate.toISOString();
      };

      const todoData = {
        ...formData,
        startDate: normalizeDate(formData.startDate),
        endDate:
          formData.category === "Daily"
            ? normalizeDate(formData.startDate)
            : normalizeDate(formData.endDate),
      };

      const url = todo ? `/api/todos/${todo._id}` : "/api/todos";
      const method = todo ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todoData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save todo");
      }

      const { todo: savedTodo } = await response.json();

      if (todo) {
        updateTodo(todo._id, savedTodo);
        toast.success("Todo updated successfully");
      } else {
        addTodo(savedTodo);
        toast.success("Todo created successfully");
      }

      if (onClose) {
        onClose();
      } else {
        router.push("/dashboard/todos");
      }
    } catch (error) {
      console.error("Error saving todo:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save todo";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | Date) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto dark:bg-accent bg-background">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {todo ? "Edit Todo" : "Create New Todo"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter todo title"
                className={`${errors.title ? "border-destructive" : ""} dark:bg-accent bg-background`}
                maxLength={100}
                aria-describedby={errors.title ? "title-error" : undefined}
              />
              {errors.title && (
                <p id="title-error" className="text-sm text-destructive">
                  {errors.title}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger
                  className={`${
                    errors.category ? "border-destructive" : ""
                  } dark:bg-accent bg-background`}
                >
                  <SelectValue
                    placeholder="Select category"
                    className="dark:bg-accent bg-background"
                  >
                    {formData.category && (
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "h-3 w-3 rounded-full",
                            CATEGORY_DOT_COLORS[
                              formData.category as keyof typeof CATEGORY_DOT_COLORS
                            ]
                          )}
                        />
                        {formData.category}
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "h-3 w-3 rounded-full",
                            CATEGORY_DOT_COLORS[
                              category as keyof typeof CATEGORY_DOT_COLORS
                            ]
                          )}
                        />
                        {category}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: Priority) =>
                  handleInputChange("priority", value)
                }
              >
                <SelectTrigger className=" dark:bg-accent bg-background ">
                  <SelectValue>
                    {formData.priority && (
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "h-3 w-3 rounded-full",
                            PRIORITY_DOT_COLORS[
                              formData.priority as keyof typeof PRIORITY_DOT_COLORS
                            ]
                          )}
                        />
                        {formData.priority.charAt(0).toUpperCase() +
                          formData.priority.slice(1)}
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "h-3 w-3 rounded-full",
                            PRIORITY_DOT_COLORS[priority]
                          )}
                        />
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter todo description"
              className={`${errors.description ? "border-destructive" : ""} dark:bg-accent bg-background`}
              rows={3}
              maxLength={500}
              aria-describedby={
                errors.description ? "description-error" : undefined
              }
            />
            {errors.description && (
              <p id="description-error" className="text-sm text-destructive">
                {errors.description}
              </p>
            )}
          </div>

          <div
            className={`grid grid-cols-1 gap-4 ${
              formData.category !== "Daily" ? "md:grid-cols-2" : ""
            }`}
          >
            <div className="space-y-2">
              <Label>Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      errors.startDate ? "border-destructive" : ""
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate
                      ? format(formData.startDate, "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) =>
                      date && handleInputChange("startDate", date)
                    }
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.startDate && (
                <p className="text-sm text-destructive">{errors.startDate}</p>
              )}
            </div>

            {formData.category !== "Daily" && (
              <div className="space-y-2">
                <Label>End Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        errors.endDate ? "border-destructive" : ""
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.endDate
                        ? format(formData.endDate, "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) =>
                        date && handleInputChange("endDate", date)
                      }
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return (
                          date < today ||
                          (formData.startDate && date < formData.startDate)
                        );
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.endDate && (
                  <p className="text-sm text-destructive">{errors.endDate}</p>
                )}
              </div>
            )}
          </div>

          {todo && (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "pending" | "completed") =>
                  handleInputChange("status", value)
                }
              >
                <SelectTrigger className="dark:bg-accent bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {todo ? "Updating..." : "Creating..."}
                </>
              ) : todo ? (
                "Update Todo"
              ) : (
                "Create Todo"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose || (() => router.back())}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
