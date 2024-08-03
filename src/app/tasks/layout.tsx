import AppBar from "@/components/appbar";
import { getSession } from "@/lib/auth";
import { getTasks } from "@/lib/task";
import { redirect } from "next/navigation";
import TaskProvider from "./task-provider";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const tasks = await getTasks();
  return (
    <main className="flex min-h-screen flex-row w-full">
      <AppBar />
      <TaskProvider tasks={tasks}>{children}</TaskProvider>
    </main>
  );
}
