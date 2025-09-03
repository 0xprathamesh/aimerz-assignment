import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Track your productivity and todo completion rates
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Completion Rate</CardTitle>
            <CardDescription>Your task completion percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">No data yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Time</CardTitle>
            <CardDescription>Time spent per task</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0m</div>
            <p className="text-xs text-muted-foreground">No data yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Productivity Score</CardTitle>
            <CardDescription>Your overall productivity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No data yet</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
          <CardDescription>
            Detailed insights into your todo management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Analytics will appear here once you start using the todo app.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
