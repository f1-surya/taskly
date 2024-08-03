"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Trash, X } from "lucide-react";
import Link from "next/link";
import { useContext, useEffect, useRef } from "react";
import { TaskContext } from "../task-provider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Task({ params }: { params: { id: string } }) {
  const saved = useRef(false);
  const { tasks, updateTask, deleteTask } = useContext(TaskContext);
  const task = tasks.find((task) => task._id === params.id)!;

  useEffect(() => {
    const timeOut = setTimeout(() => {
      if (!saved.current && task.title.length > 0) {
        fetch("/api/task", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(task),
        }).then(() => (saved.current = true));
      }
    }, 500);
    return () => clearTimeout(timeOut);
  }, [task]);

  function onChange(key: string, value: any) {
    updateTask(params.id, { [key]: value });
    saved.current = false;
  }

  function deleteCurrTask() {
    fetch("/api/task", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    }).then((e) => {
      if (e.ok) {
        window.location.href = "/tasks";
        deleteTask(task);
      }
    });
  }

  return (
    <div className="w-full min-h-screen border-l-2 border-gray-200 flex flex-col gap-4 p-4">
      <div className="flex gap-2 items-center">
        <Link href="/tasks">
          <X />
        </Link>
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onChange("completed", !task.completed)}
        />
      </div>
      <input
        type="text"
        name="title"
        id="taskTitle"
        className="text-xl font-semibold focus:outline-none"
        value={task.title}
        onChange={(e) => onChange("title", e.target.value)}
      />
      <textarea
        name="description"
        id="description"
        className="h-96 placeholder:text-slate-600 focus:outline-none"
        placeholder="Enter your description here"
        value={task.description}
        onChange={(e) => onChange("description", e.target.value)}
      />
      <AlertDialog>
        <AlertDialogTrigger className="self-end mt-auto">
          <Trash color="red" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>
            Are you sure you want to delete this task?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Warning this action is permanent!
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteCurrTask}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
