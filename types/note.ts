export interface Note {
  _id: string;
  title: string;
  content: string;
  category: string;
  priority: "low" | "medium" | "high";
  isPinned: boolean;
  todoId?: string;
  tags: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteFilters {
  categories: string[];
  priorities: string[];
  search: string;
  isPinned: boolean | null;
  tags: string[];
}

export interface CreateNoteData {
  title: string;
  content: string;
  category: string;
  priority: "low" | "medium" | "high";
  isPinned?: boolean;
  todoId?: string;
  tags?: string[];
}

export interface UpdateNoteData extends Partial<CreateNoteData> {
  _id: string;
}
