import AppBar from "@/components/appbar";
import TaskList from "@/components/tasks/tasklist";
import TaskModel from "@/models/task";
import dayjs from "dayjs";

export default function Home() {
  const tasks: TaskModel[] = [
    {
      title: "Task 1",
      description: "Task 1 description",
      completed: false,
      id: "1",
      dueDate: dayjs().add(4, "day").toDate(),
      createdAt: new Date(),
    },
    {
      title: "Task 2",
      description: "Task 2 description really long description to check how it looks overflown.",
      completed: true,
      id: "2",
      createdAt: dayjs().subtract(2, "hour").toDate(),
    },
  ];
  return (
    <main className="flex min-h-screen flex-col items-center gap-4">
      <AppBar />
      <TaskList tasks={tasks} />
    </main>
  );
}
