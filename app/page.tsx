import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Aimerz Todo App</h1>
            <p className="text-muted-foreground">
              Scalable todo list with authentication
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/auth/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">
              Manage Your Tasks Efficiently
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A modern, scalable todo application built with Next.js, featuring
              secure authentication and beautiful user interface.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card>
              <CardHeader>
                <CardTitle>Secure Authentication</CardTitle>
                <CardDescription>
                  Safe user registration and login
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Built with NextAuth.js and MongoDB for secure user management.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scalable Architecture</CardTitle>
                <CardDescription>Built for growth</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Next.js 15 with TypeScript and Tailwind CSS for
                  production-ready applications.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AWS Ready</CardTitle>
                <CardDescription>Cloud deployment ready</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Designed for easy deployment to AWS with proper environment
                  configuration.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="pt-8">
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8 py-6">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
