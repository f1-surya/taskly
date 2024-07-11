import AppBar from "@/components/appbar";
import TaskList from "@/components/tasks/tasklist";
import {getSession} from "@/lib/auth";
import {getTasks} from "@/lib/task";

export default async function Home() {
  const session = await getSession();
  const tasks = await getTasks();

  return (
    <main className="flex min-h-screen flex-col items-center gap-4">
      <AppBar name={session!.name} />
      <TaskList tasks={tasks} />
    </main>
  );
}
