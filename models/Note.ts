import mongoose, { Document, Schema } from "mongoose";

export interface INote extends Document {
  title: string;
  content: string;
  category: string;
  priority: "low" | "medium" | "high";
  isPinned: boolean;
  todoId?: string; // Reference to todo if this note is pinned to a task
  tags: string[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      maxlength: [5000, "Content cannot exceed 5000 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: [
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
        ],
        message: "Invalid category",
      },
    },
    priority: {
      type: String,
      required: [true, "Priority is required"],
      enum: {
        values: ["low", "medium", "high"],
        message: "Priority must be low, medium, or high",
      },
      default: "medium",
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    todoId: {
      type: String,
      ref: "Todo",
      required: false,
    },
    tags: {
      type: [String],
      default: [],
    },
    userId: {
      type: String,
      required: [true, "User ID is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
NoteSchema.index({ userId: 1, createdAt: -1 });
NoteSchema.index({ userId: 1, isPinned: 1 });
NoteSchema.index({ userId: 1, category: 1 });
NoteSchema.index({ userId: 1, priority: 1 });
NoteSchema.index({ userId: 1, todoId: 1 });
NoteSchema.index({ userId: 1, title: "text", content: "text" });

const Note = mongoose.models.Note || mongoose.model<INote>("Note", NoteSchema);

export default Note;
