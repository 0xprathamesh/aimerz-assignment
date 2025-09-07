import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Todo from "@/models/Todo";
import Note from "@/models/Note";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CheckSquare,
  Plus,
  BarChart3,
  FileText,
  Pin,
  BookOpen,
  Target,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  let todoStats = {
    total: 0,
    completed: 0,
    pending: 0,
  };
  let noteStats = {
    total: 0,
    pinned: 0,
    highPriority: 0,
  };
  let recentTodos: Array<{
    _id: string;
    title: string;
    category: string;
    status: string;
  }> = [];
  let recentNotes: Array<{
    _id: string;
    title: string;
    category: string;
    priority: string;
    isPinned: boolean;
  }> = [];

  if (session?.user?.id) {
    try {
      await connectDB();

      // Todo stats
      const total = await Todo.countDocuments({ userId: session.user.id });
      const completed = await Todo.countDocuments({
        userId: session.user.id,
        status: "completed",
      });
      const pending = await Todo.countDocuments({
        userId: session.user.id,
        status: "pending",
      });

      todoStats = { total, completed, pending };

      // Note stats
      const noteTotal = await Note.countDocuments({ userId: session.user.id });
      const notePinned = await Note.countDocuments({
        userId: session.user.id,
        isPinned: true,
      });
      const noteHighPriority = await Note.countDocuments({
        userId: session.user.id,
        priority: "high",
      });

      noteStats = {
        total: noteTotal,
        pinned: notePinned,
        highPriority: noteHighPriority,
      };

      // Recent todos
      const todos = await Todo.find({ userId: session.user.id })
        .select("_id title category status")
        .sort({ updatedAt: -1 })
        .limit(4)
        .lean();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recentTodos = todos.map((todo: any) => ({
        _id: todo._id.toString(),
        title: todo.title,
        category: todo.category,
        status: todo.status,
      }));

      // Recent notes
      const notes = await Note.find({ userId: session.user.id })
        .select("_id title category priority isPinned")
        .sort({ updatedAt: -1 })
        .limit(4)
        .lean();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recentNotes = notes.map((note: any) => ({
        _id: note._id.toString(),
        title: note.title,
        category: note.category,
        priority: note.priority,
        isPinned: note.isPinned,
      }));
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }

  return (
    <div className="space-y-8">
      {/* <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {session?.user.firstName}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your todos today.
        </p>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Todos</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todoStats.total}</div>
            <p className="text-xs text-muted-foreground">
              {todoStats.total === 0 ? "No todos yet" : "All your tasks"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {todoStats.completed}
            </div>
            <p className="text-xs text-muted-foreground">
              {todoStats.completed === 0
                ? "All caught up!"
                : `${Math.round(
                    (todoStats.completed / todoStats.total) * 100
                  )}% completion rate`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {todoStats.pending}
            </div>
            <p className="text-xs text-muted-foreground">
              {todoStats.pending === 0
                ? "No pending tasks"
                : "Tasks to complete"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{noteStats.total}</div>
            <p className="text-xs text-muted-foreground">
              {noteStats.total === 0
                ? "No notes yet"
                : `${noteStats.pinned} pinned`}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Manage your todos and notes efficiently
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 gap-3">
              <Link href="/dashboard/todos">
                <Button className="w-full justify-start gap-3 h-12">
                  <Plus className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Create New Todo</div>
                    <div className="text-xs opacity-70">Add a new task</div>
                  </div>
                </Button>
              </Link>

              <Link href="/dashboard/notes">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-12"
                >
                  <BookOpen className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Create New Note</div>
                    <div className="text-xs opacity-70">Jot down ideas</div>
                  </div>
                </Button>
              </Link>

              <div className="grid grid-cols-2 gap-3">
                <Link href="/dashboard/todos">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 h-10"
                  >
                    <CheckSquare className="h-4 w-4" />
                    View Todos
                  </Button>
                </Link>
                <Link href="/dashboard/notes">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 h-10"
                  >
                    <FileText className="h-4 w-4" />
                    View Notes
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest todos and notes</CardDescription>
          </CardHeader>
          <CardContent>
            {recentTodos.length === 0 && recentNotes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No recent activity. Start by creating your first todo or note!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
        
                {recentTodos.slice(0, 2).map((todo) => (
                  <div
                    key={`todo-${todo._id}`}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <CheckSquare className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {todo.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {todo.category}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        todo.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {todo.status}
                    </span>
                  </div>
                ))}

               
                {recentNotes.slice(0, 2).map((note) => (
                  <div
                    key={`note-${note._id}`}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">
                            {note.title}
                          </p>
                          {note.isPinned && (
                            <Pin className="h-3 w-3 text-yellow-600" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {note.category} • {note.priority} priority
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        note.priority === "high"
                          ? "bg-red-100 text-red-800"
                          : note.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {note.priority}
                    </span>
                  </div>
                ))}

                <div className="flex gap-2 pt-2">
                  <Link href="/dashboard/todos" className="flex-1">
                    <Button variant="outline" className="w-full text-xs">
                      View All Todos
                    </Button>
                  </Link>
                  <Link href="/dashboard/notes" className="flex-1">
                    <Button variant="outline" className="w-full text-xs">
                      View All Notes
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
