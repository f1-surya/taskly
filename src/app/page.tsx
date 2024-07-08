import { getSession } from "@/auth";
import AppBar from "@/components/appbar";
import TaskList from "@/components/tasks/tasklist";
import TaskModel from "@/models/task";
import dayjs from "dayjs";
import Login from "./login/page";

export default async function Home() {
  const session = await getSession();

  if (!session) {
    return <Login />;
  }

  const tasks: TaskModel[] = [];
  return (
    <main className="flex min-h-screen flex-col items-center gap-4">
      <AppBar name={session.name} />
      <TaskList tasks={tasks} />
    </main>
  );
}
