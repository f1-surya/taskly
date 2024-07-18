import AppBar from "@/components/appbar";
import TaskList from "@/components/tasks/tasklist";
import {getSession} from "@/lib/auth";
import {getTasks} from "@/lib/task";
import {redirect} from "next/navigation";

export default async function Home() {
  const session = await getSession();
  if (!session) {
    redirect("/login")
  }
  const tasks = await getTasks();

  return (
    <main className="flex min-h-screen flex-col items-center gap-4">
      <AppBar name={session!.name} />
      <TaskList tasks={tasks} />
    </main>
  );
}
