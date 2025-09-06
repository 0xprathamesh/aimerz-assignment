import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface Todo {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: "pending" | "completed";
  startDate: string;
  endDate: string;
  priority: "low" | "medium" | "high";
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TodoFilters {
  categories: string[];
  status: "all" | "pending" | "completed";
  search: string;
  priorities: string[];
}

interface TodoState {
  todos: Todo[];
  filteredTodos: Todo[];
  filters: TodoFilters;
  isLoading: boolean;
  error: string | null;

  // Actions
  setTodos: (todos: Todo[]) => void;
  addTodo: (todo: Todo) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  setFilters: (filters: Partial<TodoFilters>) => void;
  clearFilters: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  applyFilters: () => void;
}

const initialFilters: TodoFilters = {
  categories: [],
  status: "all",
  search: "",
  priorities: [],
};

export const useTodoStore = create<TodoState>()(
  immer((set) => ({
    todos: [],
    filteredTodos: [],
    filters: initialFilters,
    isLoading: false,
    error: null,

    setTodos: (todos) =>
      set((state) => {
        state.todos = todos;
        let filtered = [...todos];

        if (state.filters.categories.length > 0) {
          filtered = filtered.filter((todo) =>
            state.filters.categories.includes(todo.category)
          );
        }

        if (state.filters.status !== "all") {
          filtered = filtered.filter(
            (todo) => todo.status === state.filters.status
          );
        }

        if (state.filters.priorities.length > 0) {
          filtered = filtered.filter((todo) =>
            state.filters.priorities.includes(todo.priority)
          );
        }

        if (state.filters.search.trim()) {
          const searchTerm = state.filters.search.toLowerCase();
          filtered = filtered.filter(
            (todo) =>
              todo.title.toLowerCase().includes(searchTerm) ||
              todo.description.toLowerCase().includes(searchTerm)
          );
        }

        filtered.sort(
          (a, b) =>
            new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
        );
        state.filteredTodos = filtered;
      }),

    addTodo: (todo) =>
      set((state) => {
        state.todos.unshift(todo);
        let filtered = [...state.todos];

        if (state.filters.categories.length > 0) {
          filtered = filtered.filter((todo) =>
            state.filters.categories.includes(todo.category)
          );
        }

        if (state.filters.status !== "all") {
          filtered = filtered.filter(
            (todo) => todo.status === state.filters.status
          );
        }

        if (state.filters.priorities.length > 0) {
          filtered = filtered.filter((todo) =>
            state.filters.priorities.includes(todo.priority)
          );
        }

        if (state.filters.search.trim()) {
          const searchTerm = state.filters.search.toLowerCase();
          filtered = filtered.filter(
            (todo) =>
              todo.title.toLowerCase().includes(searchTerm) ||
              todo.description.toLowerCase().includes(searchTerm)
          );
        }

        filtered.sort(
          (a, b) =>
            new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
        );
        state.filteredTodos = filtered;
      }),

    updateTodo: (id, updates) =>
      set((state) => {
        const index = state.todos.findIndex((todo) => todo._id === id);
        if (index !== -1) {
          state.todos[index] = { ...state.todos[index], ...updates };
        }
        let filtered = [...state.todos];

        if (state.filters.categories.length > 0) {
          filtered = filtered.filter((todo) =>
            state.filters.categories.includes(todo.category)
          );
        }

        if (state.filters.status !== "all") {
          filtered = filtered.filter(
            (todo) => todo.status === state.filters.status
          );
        }

        if (state.filters.priorities.length > 0) {
          filtered = filtered.filter((todo) =>
            state.filters.priorities.includes(todo.priority)
          );
        }

        if (state.filters.search.trim()) {
          const searchTerm = state.filters.search.toLowerCase();
          filtered = filtered.filter(
            (todo) =>
              todo.title.toLowerCase().includes(searchTerm) ||
              todo.description.toLowerCase().includes(searchTerm)
          );
        }

        filtered.sort(
          (a, b) =>
            new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
        );
        state.filteredTodos = filtered;
      }),

    deleteTodo: (id) =>
      set((state) => {
        state.todos = state.todos.filter((todo) => todo._id !== id);
        let filtered = [...state.todos];

        if (state.filters.categories.length > 0) {
          filtered = filtered.filter((todo) =>
            state.filters.categories.includes(todo.category)
          );
        }

        if (state.filters.status !== "all") {
          filtered = filtered.filter(
            (todo) => todo.status === state.filters.status
          );
        }

        if (state.filters.priorities.length > 0) {
          filtered = filtered.filter((todo) =>
            state.filters.priorities.includes(todo.priority)
          );
        }

        if (state.filters.search.trim()) {
          const searchTerm = state.filters.search.toLowerCase();
          filtered = filtered.filter(
            (todo) =>
              todo.title.toLowerCase().includes(searchTerm) ||
              todo.description.toLowerCase().includes(searchTerm)
          );
        }

        filtered.sort(
          (a, b) =>
            new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
        );
        state.filteredTodos = filtered;
      }),

    setFilters: (newFilters) =>
      set((state) => {
        state.filters = { ...state.filters, ...newFilters };
        let filtered = [...state.todos];

        if (state.filters.categories.length > 0) {
          filtered = filtered.filter((todo) =>
            state.filters.categories.includes(todo.category)
          );
        }

        if (state.filters.status !== "all") {
          filtered = filtered.filter(
            (todo) => todo.status === state.filters.status
          );
        }

        if (state.filters.priorities.length > 0) {
          filtered = filtered.filter((todo) =>
            state.filters.priorities.includes(todo.priority)
          );
        }

        if (state.filters.search.trim()) {
          const searchTerm = state.filters.search.toLowerCase();
          filtered = filtered.filter(
            (todo) =>
              todo.title.toLowerCase().includes(searchTerm) ||
              todo.description.toLowerCase().includes(searchTerm)
          );
        }

        filtered.sort(
          (a, b) =>
            new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
        );
        state.filteredTodos = filtered;
      }),

    clearFilters: () =>
      set((state) => {
        state.filters = initialFilters;
        let filtered = [...state.todos];

        if (state.filters.categories.length > 0) {
          filtered = filtered.filter((todo) =>
            state.filters.categories.includes(todo.category)
          );
        }

        if (state.filters.status !== "all") {
          filtered = filtered.filter(
            (todo) => todo.status === state.filters.status
          );
        }

        if (state.filters.priorities.length > 0) {
          filtered = filtered.filter((todo) =>
            state.filters.priorities.includes(todo.priority)
          );
        }

        if (state.filters.search.trim()) {
          const searchTerm = state.filters.search.toLowerCase();
          filtered = filtered.filter(
            (todo) =>
              todo.title.toLowerCase().includes(searchTerm) ||
              todo.description.toLowerCase().includes(searchTerm)
          );
        }

        filtered.sort(
          (a, b) =>
            new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
        );
        state.filteredTodos = filtered;
      }),

    setLoading: (loading) =>
      set((state) => {
        state.isLoading = loading;
      }),

    setError: (error) =>
      set((state) => {
        state.error = error;
      }),

    applyFilters: () =>
      set((state) => {
        const { todos, filters } = state;
        let filtered = [...todos];

        if (filters.categories.length > 0) {
          filtered = filtered.filter((todo) =>
            filters.categories.includes(todo.category)
          );
        }

        if (filters.status !== "all") {
          filtered = filtered.filter((todo) => todo.status === filters.status);
        }

        if (filters.priorities.length > 0) {
          filtered = filtered.filter((todo) =>
            filters.priorities.includes(todo.priority)
          );
        }

        if (filters.search.trim()) {
          const searchTerm = filters.search.toLowerCase();
          filtered = filtered.filter(
            (todo) =>
              todo.title.toLowerCase().includes(searchTerm) ||
              todo.description.toLowerCase().includes(searchTerm)
          );
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        filtered = filtered.filter((todo) => {
          const todoEndDate = new Date(todo.endDate);
          todoEndDate.setHours(0, 0, 0, 0);
          return todoEndDate >= today;
        });

        filtered.sort(
          (a, b) =>
            new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
        );

        state.filteredTodos = filtered;
      }),
  }))
);
