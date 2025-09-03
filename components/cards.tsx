import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function CardDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Authentication System</CardTitle>
          <CardDescription>
            Complete user registration and login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Built with NextAuth.js, MongoDB, and secure password hashing.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scalable Architecture</CardTitle>
          <CardDescription>Production-ready setup</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Next.js 15, TypeScript, Tailwind CSS, and MongoDB integration.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Todo Management</CardTitle>
          <CardDescription>Ready for todo features</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Foundation set for building comprehensive todo functionality.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
