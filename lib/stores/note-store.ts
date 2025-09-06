import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Note, NoteFilters, CreateNoteData, UpdateNoteData } from "@/types/note";

interface NoteState {
  notes: Note[];
  filteredNotes: Note[];
  filters: NoteFilters;
  isLoading: boolean;
  error: string | null;

  setNotes: (notes: Note[]) => void;
  addNote: (note: Note) => void;
  updateNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  applyFilters: () => void;
  setFilters: (filters: Partial<NoteFilters>) => void;
  clearFilters: () => void;
}

const initialFilters: NoteFilters = {
  categories: [],
  priorities: [],
  search: "",
  isPinned: null,
  tags: [],
};

export const useNoteStore = create<NoteState>()(
  immer((set) => ({
    notes: [],
    filteredNotes: [],
    filters: initialFilters,
    isLoading: false,
    error: null,

    setNotes: (notes) =>
      set((state) => {
        state.notes = notes;
        let filtered = [...notes];

        if (state.filters.categories.length > 0) {
          filtered = filtered.filter((note) =>
            state.filters.categories.includes(note.category)
          );
        }

        if (state.filters.priorities.length > 0) {
          filtered = filtered.filter((note) =>
            state.filters.priorities.includes(note.priority)
          );
        }

        if (state.filters.isPinned !== null) {
          filtered = filtered.filter((note) => note.isPinned === state.filters.isPinned);
        }

        if (state.filters.search.trim()) {
          const searchTerm = state.filters.search.toLowerCase();
          filtered = filtered.filter(
            (note) =>
              note.title.toLowerCase().includes(searchTerm) ||
              note.content.toLowerCase().includes(searchTerm) ||
              note.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
          );
        }

        if (state.filters.tags.length > 0) {
          filtered = filtered.filter((note) =>
            state.filters.tags.some((tag) => note.tags.includes(tag))
          );
        }

        filtered.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        state.filteredNotes = filtered;
      }),

    addNote: (note) =>
      set((state) => {
        state.notes.unshift(note);
        let filtered = [...state.notes];

        if (state.filters.categories.length > 0) {
          filtered = filtered.filter((note) =>
            state.filters.categories.includes(note.category)
          );
        }

        if (state.filters.priorities.length > 0) {
          filtered = filtered.filter((note) =>
            state.filters.priorities.includes(note.priority)
          );
        }

        if (state.filters.isPinned !== null) {
          filtered = filtered.filter((note) => note.isPinned === state.filters.isPinned);
        }

        if (state.filters.search.trim()) {
          const searchTerm = state.filters.search.toLowerCase();
          filtered = filtered.filter(
            (note) =>
              note.title.toLowerCase().includes(searchTerm) ||
              note.content.toLowerCase().includes(searchTerm) ||
              note.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
          );
        }

        if (state.filters.tags.length > 0) {
          filtered = filtered.filter((note) =>
            state.filters.tags.some((tag) => note.tags.includes(tag))
          );
        }

        filtered.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        state.filteredNotes = filtered;
      }),

    updateNote: (updatedNote) =>
      set((state) => {
        const index = state.notes.findIndex((note) => note._id === updatedNote._id);
        if (index !== -1) {
          state.notes[index] = updatedNote;
        }

        let filtered = [...state.notes];

        if (state.filters.categories.length > 0) {
          filtered = filtered.filter((note) =>
            state.filters.categories.includes(note.category)
          );
        }

        if (state.filters.priorities.length > 0) {
          filtered = filtered.filter((note) =>
            state.filters.priorities.includes(note.priority)
          );
        }

        if (state.filters.isPinned !== null) {
          filtered = filtered.filter((note) => note.isPinned === state.filters.isPinned);
        }

        if (state.filters.search.trim()) {
          const searchTerm = state.filters.search.toLowerCase();
          filtered = filtered.filter(
            (note) =>
              note.title.toLowerCase().includes(searchTerm) ||
              note.content.toLowerCase().includes(searchTerm) ||
              note.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
          );
        }

        if (state.filters.tags.length > 0) {
          filtered = filtered.filter((note) =>
            state.filters.tags.some((tag) => note.tags.includes(tag))
          );
        }

        filtered.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        state.filteredNotes = filtered;
      }),

    deleteNote: (id) =>
      set((state) => {
        state.notes = state.notes.filter((note) => note._id !== id);
        state.filteredNotes = state.filteredNotes.filter((note) => note._id !== id);
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
        let filtered = [...state.notes];

        if (state.filters.categories.length > 0) {
          filtered = filtered.filter((note) =>
            state.filters.categories.includes(note.category)
          );
        }

        if (state.filters.priorities.length > 0) {
          filtered = filtered.filter((note) =>
            state.filters.priorities.includes(note.priority)
          );
        }

        if (state.filters.isPinned !== null) {
          filtered = filtered.filter((note) => note.isPinned === state.filters.isPinned);
        }

        if (state.filters.search.trim()) {
          const searchTerm = state.filters.search.toLowerCase();
          filtered = filtered.filter(
            (note) =>
              note.title.toLowerCase().includes(searchTerm) ||
              note.content.toLowerCase().includes(searchTerm) ||
              note.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
          );
        }

        if (state.filters.tags.length > 0) {
          filtered = filtered.filter((note) =>
            state.filters.tags.some((tag) => note.tags.includes(tag))
          );
        }

        filtered.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        state.filteredNotes = filtered;
      }),

    setFilters: (newFilters) =>
      set((state) => {
        state.filters = { ...state.filters, ...newFilters };
        let filtered = [...state.notes];

        if (state.filters.categories.length > 0) {
          filtered = filtered.filter((note) =>
            state.filters.categories.includes(note.category)
          );
        }

        if (state.filters.priorities.length > 0) {
          filtered = filtered.filter((note) =>
            state.filters.priorities.includes(note.priority)
          );
        }

        if (state.filters.isPinned !== null) {
          filtered = filtered.filter((note) => note.isPinned === state.filters.isPinned);
        }

        if (state.filters.search.trim()) {
          const searchTerm = state.filters.search.toLowerCase();
          filtered = filtered.filter(
            (note) =>
              note.title.toLowerCase().includes(searchTerm) ||
              note.content.toLowerCase().includes(searchTerm) ||
              note.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
          );
        }

        if (state.filters.tags.length > 0) {
          filtered = filtered.filter((note) =>
            state.filters.tags.some((tag) => note.tags.includes(tag))
          );
        }

        filtered.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        state.filteredNotes = filtered;
      }),

    clearFilters: () =>
      set((state) => {
        state.filters = initialFilters;
        state.filteredNotes = [...state.notes].sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
      }),
  }))
);