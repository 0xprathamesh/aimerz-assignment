"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, StickyNote, Pin } from "lucide-react";
import { useNoteStore } from "@/lib/stores/note-store";
import { useTodoStore } from "@/lib/stores/todo-store";
import NoteCard from "./note-card";
import NoteForm from "./note-form";
import NotesFilters from "./notes-filters";
import { Note } from "@/types/note";

export default function NotesManager() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { notes, filteredNotes, setNotes, setLoading, setError, isLoading } =
    useNoteStore();
  const { todos } = useTodoStore();

  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/notes");
        if (!response.ok) {
          throw new Error("Failed to fetch notes");
        }

        const { notes } = await response.json();
        setNotes(notes);
      } catch (error) {
        console.error("Error fetching notes:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch notes"
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
      fetchNotes();
    }
  }, [status, session, router, setNotes, setLoading, setError]);

  const handleCreateClick = () => {
    setEditingNote(null);
    setShowForm(true);
  };

  const handleEditClick = (note: Note) => {
    setEditingNote(note);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingNote(null);
  };

  const pinnedNotes = filteredNotes.filter((note) => note.isPinned);
  const regularNotes = filteredNotes.filter((note) => !note.isPinned);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Notes</h1>
            <p className="text-muted-foreground">Manage your notes and ideas</p>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2 mb-4" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notes</h1>
          <p className="text-muted-foreground">Manage your notes and ideas</p>
        </div>
        <Button onClick={handleCreateClick} className="gap-2">
          <Plus className="h-4 w-4" />
          New Note
        </Button>
      </div>

      <NotesFilters />

      {filteredNotes.length === 0 ? (
        <Card className="p-12 text-center">
          <CardContent>
            <StickyNote className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No notes found</h3>
            <p className="text-muted-foreground mb-4">
              {notes.length === 0
                ? "Create your first note to get started"
                : "Try adjusting your filters to see more notes"}
            </p>
            <Button onClick={handleCreateClick} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Note
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">

          {pinnedNotes.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Pin className="h-5 w-5 text-yellow-600" />
                <h2 className="text-xl font-semibold">Pinned Notes</h2>
                <span className="text-sm text-muted-foreground">
                  ({pinnedNotes.length})
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pinnedNotes.map((note) => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    onEdit={handleEditClick}
                  />
                ))}
              </div>
            </div>
          )}

      
          {regularNotes.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <StickyNote className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-xl font-semibold">
                  {pinnedNotes.length > 0 ? "All Notes" : "Notes"}
                </h2>
                <span className="text-sm text-muted-foreground">
                  ({regularNotes.length})
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularNotes.map((note) => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    onEdit={handleEditClick}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {showForm && <NoteForm note={editingNote || undefined} onClose={handleFormClose} />}
    </div>
  );
}
