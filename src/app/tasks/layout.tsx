import { getSession } from "@/lib/auth";
import { getTasks } from "@/lib/task";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import TaskProvider from "./task-provider";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const tasks = await getTasks();
  return (
    <main className="flex min-h-screen flex-row w-full">
      <TaskProvider tasks={tasks}>{children}</TaskProvider>
    </main>
  );
}
