"use client";

import { useState } from "react";
import {
  Plus,
  MoreVertical,
  Filter,
  SortAsc,
  SortDesc,
  ChevronDown,
  ChevronRight,
  Pin,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Todo } from "@/types/todo";
import { cn } from "@/lib/utils";
import { CATEGORY_DOT_COLORS, PRIORITY_DOT_COLORS } from "@/lib/constants";
import { BoardColumnSkeleton } from "./todo-list-skeleton";

interface BoardViewProps {
  todos: Todo[];
  onEditClick: (todo: Todo) => void;
  onToggleStatus: (todo: Todo) => void;
  onAddTask: () => void;
  isLoading?: boolean;
}

const COLUMNS = [
  { id: "overdue", title: "Overdue", status: "pending" },
  { id: "recently-assigned", title: "Recently assigned", status: "all" },
  { id: "daily-tasks", title: "Daily Tasks", status: "all" },
  { id: "do-today", title: "Do today", status: "pending" },
  { id: "do-next-week", title: "This week", status: "pending" },
  { id: "do-later", title: "Later", status: "pending" },
  { id: "completed", title: "Completed", status: "completed" },
  { id: "history", title: "History", status: "all" },
];

export default function BoardView({
  todos,
  onEditClick,
  onToggleStatus,
  onAddTask,
  isLoading = false,
}: BoardViewProps) {
  const [sortBy, setSortBy] = useState<{ [key: string]: string }>({});
  const [collapsedColumns, setCollapsedColumns] = useState<Set<string>>(
    new Set()
  );

  const toggleColumnCollapse = (columnId: string) => {
    setCollapsedColumns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(columnId)) {
        newSet.delete(columnId);
      } else {
        newSet.add(columnId);
      }
      return newSet;
    });
  };

  const getTodosForColumn = (columnId: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const validTodos = todos.filter((todo) => {
      if (
        columnId === "recently-assigned" ||
        columnId === "daily-tasks" ||
        columnId === "overdue" ||
        columnId === "completed" ||
        columnId === "history"
      ) {
        return true;
      }
      const todoDate = new Date(todo.endDate);
      todoDate.setHours(0, 0, 0, 0);
      return todoDate >= today;
    });

    let columnTodos: Todo[] = [];

    if (columnId === "overdue") {
      columnTodos = validTodos.filter((todo) => {
        const todoDate = new Date(todo.endDate);
        todoDate.setHours(0, 0, 0, 0);
        return todoDate < today && todo.status === "pending";
      });
    } else if (columnId === "recently-assigned") {
      columnTodos = [...validTodos]
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        )
        .slice(0, 5);
    } else if (columnId === "daily-tasks") {
      columnTodos = validTodos.filter((todo) => todo.category === "Daily");
    } else if (columnId === "do-today") {
      columnTodos = validTodos.filter((todo) => {
        const todoDate = new Date(todo.endDate);
        todoDate.setHours(0, 0, 0, 0);
        return todoDate.toDateString() === today.toDateString();
      });
    } else if (columnId === "do-next-week") {
      columnTodos = validTodos.filter((todo) => {
        const todoDate = new Date(todo.endDate);
        todoDate.setHours(0, 0, 0, 0);
        return todoDate > today && todoDate <= nextWeek;
      });
    } else if (columnId === "do-later") {
      columnTodos = validTodos.filter((todo) => {
        const todoDate = new Date(todo.endDate);
        todoDate.setHours(0, 0, 0, 0);
        return todoDate > nextWeek;
      });
    } else if (columnId === "completed") {
      columnTodos = validTodos.filter((todo) => todo.status === "completed");
    } else if (columnId === "history") {
      columnTodos = [...validTodos].sort(
        (a, b) =>
          new Date(b.updatedAt || 0).getTime() -
          new Date(a.updatedAt || 0).getTime()
      );
    }

    const sortType = sortBy[columnId];
    if (sortType) {
      columnTodos = [...columnTodos].sort((a, b) => {
        switch (sortType) {
          case "title-asc":
            return a.title.localeCompare(b.title);
          case "title-desc":
            return b.title.localeCompare(a.title);
          case "priority-asc":
            const priorityOrder = { low: 1, medium: 2, high: 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          case "priority-desc":
            const priorityOrderDesc = { low: 1, medium: 2, high: 3 };
            return (
              priorityOrderDesc[b.priority] - priorityOrderDesc[a.priority]
            );
          case "date-asc":
            return (
              new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
            );
          case "date-desc":
            return (
              new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
            );
          default:
            return 0;
        }
      });
    }

    return columnTodos;
  };

  const isOverdue = (endDate: string) => {
    return (
      new Date(endDate) < new Date() &&
      new Date(endDate).toDateString() !== new Date().toDateString()
    );
  };

  const isDueToday = (endDate: string) => {
    return new Date(endDate).toDateString() === new Date().toDateString();
  };

  if (isLoading) {
    return (
      <div
        className="flex flex-col md:grid gap-4 md:gap-6 pb-4 overflow-x-auto font-inter"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <BoardColumnSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div
      className="flex flex-col md:grid gap-4 md:gap-6 pb-4 overflow-x-auto font-inter"
      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
    >
      {COLUMNS.map((column) => {
        const columnTodos = getTodosForColumn(column.id);
        const isEmpty = columnTodos.length === 0;
        return (
          <div
            key={column.id}
            className="min-w-[280px] md:min-w-0 flex-shrink-0"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleColumnCollapse(column.id)}
                  className="h-6 w-6 p-0 hover:bg-muted/50"
                >
                  {collapsedColumns.has(column.id) ? (
                    <ChevronRight className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </Button>
                <h3 className="font-semibold text-sm text-foreground">
                  {column.title}
                </h3>
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/20 px-2 py-1 text-xs font-medium rounded-full"
                >
                  {columnTodos.length}
                </Badge>
              </div>

              {columnTodos.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-muted/50"
                    >
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 font-inter text-sm"
                  >
                    <DropdownMenuItem
                      onClick={() =>
                        setSortBy({ ...sortBy, [column.id]: "title-asc" })
                      }
                      className="cursor-pointer font-inter text-sm"
                    >
                      <SortAsc className="mr-2 h-4 w-4" />
                      Sort by Title (A-Z)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        setSortBy({ ...sortBy, [column.id]: "title-desc" })
                      }
                      className="cursor-pointer font-inter"
                    >
                      <SortDesc className="mr-2 h-4 w-4" />
                      Sort by Title (Z-A)
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() =>
                        setSortBy({ ...sortBy, [column.id]: "priority-asc" })
                      }
                      className="cursor-pointer font-inter"
                    >
                      <Filter className="mr-2 h-4 w-4" />
                      Sort by Priority (Low-High)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        setSortBy({ ...sortBy, [column.id]: "priority-desc" })
                      }
                      className="cursor-pointer font-inter"
                    >
                      <Filter className="mr-2 h-4 w-4" />
                      Sort by Priority (High-Low)
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() =>
                        setSortBy({ ...sortBy, [column.id]: "date-asc" })
                      }
                      className="cursor-pointer font-inter"
                    >
                      <SortAsc className="mr-2 h-4 w-4" />
                      Sort by Date (Earliest)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        setSortBy({ ...sortBy, [column.id]: "date-desc" })
                      }
                      className="cursor-pointer font-inter"
                    >
                      <SortDesc className="mr-2 h-4 w-4" />
                      Sort by Date (Latest)
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        const newSortBy = { ...sortBy };
                        delete newSortBy[column.id];
                        setSortBy(newSortBy);
                      }}
                      className="cursor-pointer text-muted-foreground font-inter"
                    >
                      Clear Sort
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            {!collapsedColumns.has(column.id) && (
              <div
                className={cn(
                  "space-y-3",
                  isEmpty ? "min-h-[100px]" : "min-h-[200px]"
                )}
              >
                {columnTodos.map((todo) => (
                  <Card
                    key={todo._id}
                    className="cursor-pointer hover:shadow-md transition-shadow group"
                    onClick={() => onEditClick(todo)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={todo.status === "completed"}
                              onChange={() => onToggleStatus(todo)}
                              onClick={(e) => e.stopPropagation()}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <h4 className="text-sm font-medium line-clamp-2">
                                {todo.title}
                              </h4>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "h-1 w-full rounded-full",
                              CATEGORY_DOT_COLORS[
                                todo.category as keyof typeof CATEGORY_DOT_COLORS
                              ]
                            )}
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "h-2 w-2 rounded-full",
                                PRIORITY_DOT_COLORS[
                                  todo.priority as keyof typeof PRIORITY_DOT_COLORS
                                ]
                              )}
                            />
                            <span className="capitalize">{todo.priority}</span>
                          </div>
                          {isOverdue(todo.endDate) &&
                            todo.status === "pending" && (
                              <Badge variant="destructive" className="text-xs">
                                Overdue
                              </Badge>
                            )}
                          {isDueToday(todo.endDate) &&
                            todo.status === "pending" &&
                            !isOverdue(todo.endDate) && (
                              <Badge
                                variant="outline"
                                className="text-xs border-orange-200 text-orange-600"
                              >
                                Due Today
                              </Badge>
                            )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button
                  variant="ghost"
                  className={cn(
                    "w-full border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 text-muted-foreground hover:text-foreground",
                    isEmpty ? "h-12" : "h-12"
                  )}
                  onClick={onAddTask}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add task
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
