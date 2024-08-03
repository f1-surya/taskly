"use client";

import { TaskContext } from "@/app/tasks/task-provider";
import { ITask } from "@/interfaces/task";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyboardEvent, ReactNode, useContext } from "react";
import { toast } from "sonner";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import Image from "next/image";

/**
 * Renders a list of tasks.
 *
 * @return {ReactNode} The rendered list of tasks.
 */
export default function TaskList(): ReactNode {
  const { tasks, updateTask, addTask } = useContext(TaskContext);
  const router = useRouter();

  const pendingTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  /**
   * Saves a task when the Enter key is pressed and the task title is not empty.
   *
   * @param {KeyboardEvent<HTMLInputElement>} e - The keyboard event triggered by the user.
   * @return {Promise<void>} - A promise that resolves when the task is saved successfully.
   */
  async function saveTask(e: KeyboardEvent<HTMLInputElement>): Promise<void> {
    const title = e.currentTarget.value;
    if (e.key === "Enter" && title.length > 0) {
      const res = await fetch("/api/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });
      if (res.status === 201) {
        const task = await res.json();
        addTask(task);
        router.push(`/tasks/${task._id}`);
        const inp = document.getElementById("taskTitle") as HTMLInputElement;
        inp.value = "";
      } else {
        toast.error("Something went wrong");
      }
    }
  }

  /**
   * Changes the status of a task on the server.
   *
   * @param {ITask} task - The task to change the status of.
   * @return {Promise<void>} A promise that resolves when the task's status is changed.
   */
  async function changeStatus(task: ITask): Promise<void> {
    const res = await fetch("/api/task", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...task,
        completed: !task.completed,
      }),
    });
    if (res.status === 201) {
      updateTask(task._id!, { completed: !task.completed });
    } else {
      toast.error("Something went wrong");
    }
  }

  function renderTask(task: ITask) {
    return (
      <div
        key={task._id}
        className="radius-6 bg-gray-100 w-full rounded-lg p-2 flex gap-4 shadow-inner items-center cursor-pointer hover:bg-gray-200 transition-colors"
      >
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => changeStatus(task)}
        />
        <Link href={`/tasks/${task._id}`} className="w-full">
          <p className="text-md font-semibold">{task.title}</p>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 m-2 w-full sm:w-auto">
      <div className="sm:hidden flex flex-row items-center gap-2 border-b-2 border-gray-300 p-2">
        <Image src="/logo.svg" alt="Logo" width={35} height={35} />
        <p className="font-semibold text-md">Task manager</p>
      </div>
      <Input
        placeholder="+ Add a task"
        className="ring-0 focus:ring-1"
        id="taskTitle"
        onKeyDown={saveTask}
      />
      {pendingTasks.map(renderTask)}
      {completedTasks.length > 0 && (
        <>
          <div className="flex justify-between mt-2">
            <p className="font-semibold text-md">Completed tasks</p>
          </div>
          {completedTasks.map(renderTask)}
        </>
      )}
    </div>
  );
}
