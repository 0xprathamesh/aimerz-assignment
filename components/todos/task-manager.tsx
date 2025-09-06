"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTodoStore } from "@/lib/stores/todo-store";
import TodoForm from "@/components/todos/todo-form";
import ViewSwitcher from "@/components/todos/view-switcher";
import ListView from "@/components/todos/list-view";
import BoardView from "@/components/todos/board-view";
import CalendarView from "@/components/todos/calendar-view";
import { Todo } from "@/types/todo";

type ViewType = "list" | "board" | "calendar";

export default function TaskManager() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { todos, setTodos, setLoading, setError, isLoading } = useTodoStore();

  const [currentView, setCurrentView] = useState<ViewType>("list");
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/todos");
        if (!response.ok) {
          throw new Error("Failed to fetch todos");
        }

        const { todos } = await response.json();
        setTodos(todos);
      } catch (error) {
        console.error("Error fetching todos:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch todos"
        );
      } finally {
        setLoading(false);
      }
    };

    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (status === "authenticated" && session?.user?.id) {
      fetchTodos();
    }
  }, [status, session, router, setTodos, setLoading, setError]);

  const handleCreateClick = () => {
    setEditingTodo(null);
    setShowForm(true);
  };

  const handleEditClick = (todo: Todo) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTodo(null);
    setSelectedDate(null);
  };

  const handleAddTaskForDate = (date: Date) => {
    setSelectedDate(date);
    setEditingTodo(null);
    setShowForm(true);
  };

  const handleToggleStatus = async (todo: Todo) => {
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

      const { updateTodo } = useTodoStore.getState();
      updateTodo(todo._id, { status: newStatus });
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="space-y-6 mt-4">
      <ViewSwitcher
        currentView={currentView}
        onViewChange={setCurrentView}
        onAddTask={handleCreateClick}
      />

      {currentView === "list" && (
        <ListView
          onEditClick={handleEditClick}
          showFiltersModal={showFiltersModal}
          setShowFiltersModal={setShowFiltersModal}
        />
      )}

      {currentView === "board" && (
        <BoardView
          todos={todos}
          onEditClick={handleEditClick}
          onToggleStatus={handleToggleStatus}
          onAddTask={handleCreateClick}
          isLoading={isLoading}
        />
      )}

      {currentView === "calendar" && (
        <CalendarView
          todos={todos}
          onEditClick={handleEditClick}
          onAddTask={handleCreateClick}
          onAddTaskForDate={handleAddTaskForDate}
          isLoading={isLoading}
        />
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <TodoForm
              todo={editingTodo}
              onClose={handleFormClose}
              selectedDate={selectedDate}
            />
          </div>
        </div>
      )}
    </div>
  );
}
