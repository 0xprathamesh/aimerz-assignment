import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function TodosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Todos</h1>
          <p className="text-muted-foreground">
            Manage and organize your tasks
          </p>
        </div>
        <Link href="/dashboard/todos/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Todo
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Todos</CardTitle>
          <CardDescription>
            All your tasks and reminders in one place
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No todos yet. Create your first todo to get started!
            </p>
            <Link href="/dashboard/todos/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Todo
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
