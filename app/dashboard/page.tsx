import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Todo from "@/models/Todo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Calendar, CheckSquare, Plus, BarChart3 } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  let todoStats = {
    total: 0,
    completed: 0,
    pending: 0,
  };
  let recentTodos: Array<{
    _id: string;
    title: string;
    category: string;
    status: string;
  }> = [];

  if (session?.user?.id) {
    try {
      await connectDB();
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
    } catch (error) {
      console.error("Error fetching todo stats:", error);
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
            <CardTitle className="text-sm font-medium">User Profile</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{session?.user.name}</div>
            <p className="text-xs text-muted-foreground">
              {session?.user.email}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Get started with your todo management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/dashboard/todos/create">
              <Button className="w-full justify-start gap-2">
                <Plus className="h-4 w-4" />
                Create New Todo
              </Button>
            </Link>
            <Link href="/dashboard/todos">
              <Button variant="outline" className="w-full justify-start gap-2">
                <CheckSquare className="h-4 w-4" />
                View All Todos
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest todo activities</CardDescription>
          </CardHeader>
          <CardContent>
            {recentTodos.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No recent activity. Start by creating your first todo!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTodos.map((todo) => (
                  <div
                    key={todo._id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {todo.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {todo.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
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
                  </div>
                ))}
                <Link href="/dashboard/todos">
                  <Button variant="outline" className="w-full">
                    View All Todos
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
