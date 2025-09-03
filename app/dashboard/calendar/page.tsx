import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">
          View your todos in calendar format
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todo Calendar</CardTitle>
          <CardDescription>
            Schedule and organize your tasks by date
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Calendar view coming soon. Create some todos first!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
