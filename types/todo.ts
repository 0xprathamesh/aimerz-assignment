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
