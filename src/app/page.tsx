import { auth } from "auth";
import { ArrowRight, ListTodo, Layout, PlusCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/theme-toggle";

export default async function Home() {
  const session = await auth();
  if (session) {
    redirect("/tasks");
  }

  return (
    <main className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <span className="font-bold text-xl">Taskly</span>
          <div className="flex items-center gap-4">
            <Link href="/tasks" className="text-sm font-medium">
              Dashboard
            </Link>
            <ThemeToggle />
            <Link href="/tasks">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Organize your workflow with Taskly
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  A flexible Kanban board that adapts to your workflow. Create
                  custom columns, organize tasks, and boost your productivity.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/tasks">
                  <Button size="lg" className="gap-1.5">
                    Try it now
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-full overflow-hidden rounded-xl border bg-muted/50 p-2 shadow-xl lg:p-6">
                <Image
                  src="/placeholder.svg?height=600&width=800"
                  alt="Kanban board screenshot"
                  width={700}
                  height={500}
                  className="h-full w-full object-cover object-center rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20 rounded-lg" />
                <div className="absolute bottom-4 left-4 right-4 rounded-lg border bg-background/90 p-4 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold">Customizable Workflow</h3>
                      <p className="text-xs text-muted-foreground">
                        Create and organize columns to match your process
                      </p>
                    </div>
                    <Button size="sm" variant="secondary">
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Add Column
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50 px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 container">
          <h2 className="text-3xl font-bold tracking-tighter md:text-3xl/tight">
            Features that boost productivity
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Everything you need to manage your projects efficiently
          </p>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <ListTodo className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Custom Columns</h3>
              <p className="text-center text-muted-foreground">
                Create and organize columns to match your unique workflow
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <PlusCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Task Management</h3>
              <p className="text-center text-muted-foreground">
                Add, organize, and track tasks with intuitive drag and drop
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <Layout className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Flexible Layout</h3>
              <p className="text-center text-muted-foreground">
                Responsive design that works on any device or screen size
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Ready to get started?
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Try KanbanFlow today and transform how you manage your projects
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm space-y-2">
            <Link href="/tasks">
              <Button size="lg" className="w-full">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
