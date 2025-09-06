"use client";

import { useState, useCallback, useMemo } from "react";
import { format } from "date-fns";
import {
  Search,
  Edit,
  Trash2,
  CheckCircle2,
  Circle,
  Calendar,
  MoreHorizontal,
  Clock,
  AlertCircle,
  CheckSquare,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTodoStore } from "@/lib/stores/todo-store";
import { toast } from "sonner";
import { Todo } from "@/types/todo";
import { cn } from "@/lib/utils";
import FiltersModal from "./filters-modal";

const CATEGORY_COLORS = {
  Work: "bg-blue-100 text-blue-800 border-blue-200",
  Health: "bg-green-100 text-green-800 border-green-200",
  Finance: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Travel: "bg-purple-100 text-purple-800 border-purple-200",
  Personal: "bg-pink-100 text-pink-800 border-pink-200",
  Education: "bg-indigo-100 text-indigo-800 border-indigo-200",
  Shopping: "bg-orange-100 text-orange-800 border-orange-200",
  Other: "bg-gray-100 text-gray-800 border-gray-200",
};

const PRIORITY_COLORS = {
  low: "text-gray-500",
  medium: "text-yellow-600",
  high: "text-red-600",
};

interface ListViewProps {
  onEditClick: (todo: Todo) => void;
  showFiltersModal: boolean;
  setShowFiltersModal: (show: boolean) => void;
}

export default function ListView({
  onEditClick,
  showFiltersModal,
  setShowFiltersModal,
}: ListViewProps) {
  const {
    filteredTodos,
    filters,
    setFilters,
    clearFilters,
    updateTodo,
    deleteTodo,
    isLoading,
  } = useTodoStore();

  const [showDescription, setShowDescription] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const handleSearch = useCallback(
    (value: string) => {
      setFilters({ search: value });
    },
    [setFilters]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowFiltersModal(false);
      }
    },
    [setShowFiltersModal]
  );

  const handleToggleStatus = useCallback(
    async (todo: Todo) => {
      try {
        const newStatus = todo.status === "pending" ? "completed" : "pending";

        const response = await fetch(`/api/todos/${todo._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) {
          throw new Error("Failed to update todo");
        }

        updateTodo(todo._id, { status: newStatus });
        toast.success(`Todo marked as ${newStatus}`);
        setAnnouncement(`Todo "${todo.title}" marked as ${newStatus}`);
      } catch (error) {
        console.error("Error updating todo:", error);
        toast.error("Failed to update todo");
      }
    },
    [updateTodo]
  );

  const handleDelete = useCallback(
    async (todo: Todo) => {
      if (!confirm("Are you sure you want to delete this todo?")) {
        return;
      }

      try {
        const response = await fetch(`/api/todos/${todo._id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete todo");
        }

        deleteTodo(todo._id);
        toast.success("Todo deleted successfully");
        setAnnouncement(`Todo "${todo.title}" deleted`);
      } catch (error) {
        console.error("Error deleting todo:", error);
        toast.error("Failed to delete todo");
      }
    },
    [deleteTodo]
  );

  const getPriorityIcon = useCallback((priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-3 w-3" />;
      case "medium":
        return <Clock className="h-3 w-3" />;
      case "low":
        return <Circle className="h-3 w-3" />;
      default:
        return <Circle className="h-3 w-3" />;
    }
  }, []);

  const isOverdue = useCallback((endDate: string) => {
    return (
      new Date(endDate) < new Date() &&
      new Date(endDate).toDateString() !== new Date().toDateString()
    );
  }, []);

  const isDueToday = useCallback((endDate: string) => {
    return new Date(endDate).toDateString() === new Date().toDateString();
  }, []);

  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter((value) =>
      Array.isArray(value) ? value.length > 0 : value !== "" && value !== "all"
    ).length;
  }, [filters]);

  const getRowClassName = useCallback(
    (todo: Todo) => {
      return cn(
        "hover:bg-muted/50 transition-colors group border-l-2",
        todo.status === "completed" && "opacity-60 bg-muted/30",
        isOverdue(todo.endDate) &&
          todo.status === "pending" &&
          "border-l-red-500",
        isDueToday(todo.endDate) &&
          todo.status === "pending" &&
          !isOverdue(todo.endDate) &&
          "border-l-orange-500",
        todo.status === "completed" && "border-l-green-500",
        !isOverdue(todo.endDate) &&
          !isDueToday(todo.endDate) &&
          todo.status === "pending" &&
          "border-l-transparent"
      );
    },
    [isOverdue, isDueToday]
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="w-24">Priority</TableHead>
                <TableHead className="w-32">Category</TableHead>
                <TableHead className="w-40">Due Date</TableHead>
                <TableHead className="w-24">Status</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        role="region"
        aria-live="polite"
        aria-label="Todo actions"
        className="sr-only"
      >
        {announcement}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search todos..."
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10 h-9 dark:bg-accent bg-background"
            aria-label="Search todos"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDescription(!showDescription)}
            className="flex items-center gap-2 h-9 px-3 dark:bg-accent bg-background font-normal"
          >
            {showDescription ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            {showDescription ? "Hide" : "Show"} Description
          </Button>
          <FiltersModal
            filters={filters}
            setFilters={setFilters}
            clearFilters={clearFilters}
            activeFiltersCount={activeFiltersCount}
            totalTodos={filteredTodos.length}
            isOpen={showFiltersModal}
            onOpenChange={setShowFiltersModal}
          />
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12 text-center">
                <Checkbox className="h-4 w-4" />
              </TableHead>
              <TableHead className="font-semibold">Title</TableHead>
              {showDescription && (
                <TableHead className="font-semibold min-w-[200px]">
                  Description
                </TableHead>
              )}
              <TableHead className="w-20 text-center font-semibold">
                Priority
              </TableHead>
              <TableHead className="w-28 text-center font-semibold">
                Category
              </TableHead>
              <TableHead className="w-32 text-center font-semibold">
                Due Date
              </TableHead>
              <TableHead className="w-20 text-center font-semibold">
                Status
              </TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTodos.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={showDescription ? 8 : 7}
                  className="h-32 text-center"
                >
                  <div className="text-muted-foreground">
                    <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No todos found</p>
                    <p className="text-xs text-muted-foreground/70">
                      {filters.search ||
                      filters.categories.length > 0 ||
                      filters.status !== "all"
                        ? "Try adjusting your filters"
                        : "Create your first todo to get started"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredTodos.map((todo) => (
                <TableRow key={todo._id} className={getRowClassName(todo)}>
                  <TableCell className="text-center">
                    <button
                      onClick={() => handleToggleStatus(todo)}
                      className="p-1 rounded hover:bg-muted transition-colors"
                      aria-label={`Mark as ${
                        todo.status === "pending" ? "completed" : "pending"
                      }`}
                    >
                      {todo.status === "completed" ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground hover:text-green-600" />
                      )}
                    </button>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "font-medium text-sm",
                          todo.status === "completed" &&
                            "line-through text-muted-foreground"
                        )}
                      >
                        {todo.title}
                      </span>
                      {isOverdue(todo.endDate) && todo.status === "pending" && (
                        <Badge
                          variant="destructive"
                          className="text-xs px-1.5 py-0"
                        >
                          Overdue
                        </Badge>
                      )}
                      {isDueToday(todo.endDate) &&
                        todo.status === "pending" &&
                        !isOverdue(todo.endDate) && (
                          <Badge
                            variant="outline"
                            className="text-xs px-1.5 py-0 border-orange-200 text-orange-600"
                          >
                            Today
                          </Badge>
                        )}
                    </div>
                  </TableCell>

                  {showDescription && (
                    <TableCell>
                      <p
                        className={cn(
                          "text-xs text-muted-foreground line-clamp-2 max-w-[200px]",
                          todo.status === "completed" && "line-through"
                        )}
                      >
                        {todo.description}
                      </p>
                    </TableCell>
                  )}

                  <TableCell className="text-center">
                    <div
                      className={cn(
                        "flex items-center justify-center gap-1 text-xs font-medium",
                        PRIORITY_COLORS[
                          todo.priority as keyof typeof PRIORITY_COLORS
                        ]
                      )}
                    >
                      {getPriorityIcon(todo.priority)}
                      <span className="capitalize">{todo.priority}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        CATEGORY_COLORS[
                          todo.category as keyof typeof CATEGORY_COLORS
                        ]
                      )}
                    >
                      {todo.category}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{format(new Date(todo.endDate), "MMM dd")}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge
                      variant={
                        todo.status === "completed" ? "secondary" : "outline"
                      }
                      className="text-xs"
                    >
                      {todo.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          onClick={() => onEditClick(todo)}
                          className="cursor-pointer text-xs"
                        >
                          <Edit className="mr-2 h-3 w-3" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(todo)}
                          className="cursor-pointer text-xs"
                        >
                          {todo.status === "completed" ? (
                            <>
                              <Circle className="mr-2 h-3 w-3" />
                              Mark Pending
                            </>
                          ) : (
                            <>
                              <CheckSquare className="mr-2 h-3 w-3" />
                              Mark Complete
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(todo)}
                          className="text-destructive focus:text-destructive cursor-pointer text-xs"
                        >
                          <Trash2 className="mr-2 h-3 w-3" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
