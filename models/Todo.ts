import mongoose, { Document, Schema } from "mongoose";

export interface ITodo extends Document {
  title: string;
  description: string;
  category: string;
  status: "pending" | "completed";
  startDate: Date;
  endDate: Date;
  priority: "low" | "medium" | "high";
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const TodoSchema = new Schema<ITodo>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
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
          "Other",
        ],
        message: "Invalid category",
      },
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: {
        values: ["pending", "completed"],
        message: "Status must be either pending or completed",
      },
      default: "pending",
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
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
TodoSchema.index({ userId: 1, endDate: 1 });
TodoSchema.index({ userId: 1, status: 1 });
TodoSchema.index({ userId: 1, category: 1 });
TodoSchema.index({ userId: 1, title: "text", description: "text" });

const Todo = mongoose.models.Todo || mongoose.model<ITodo>("Todo", TodoSchema);

export default Todo;
