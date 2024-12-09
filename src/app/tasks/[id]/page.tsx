"use client";

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
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { addDays, format, intlFormatDistance } from "date-fns";
import { CalendarIcon, Flag, Trash, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useContext, useEffect, useRef } from "react";
import { TaskContext } from "../task-provider";

const colors: { [key: string]: string } = {
  Low: "#4287f5",
  Medium: "#dbd402",
  High: "#fc0000",
  None: "#999999",
};

export default function Task() {
  const saved = useRef(false);
  const { tasks, updateTask, deleteTask } = useContext(TaskContext);
  const params = useParams<{ id: string }>();
  const task = tasks.find((task) => task.id === params.id)!;

  useEffect(() => {
    const timeOut = setTimeout(() => {
      if (task && !saved.current && task.title.length > 0) {
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

  if (!task) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Image src="/404.svg" width={200} height={200} alt="404" />
        Task not found
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen border-l-2 border-gray-200 flex flex-col gap-4 p-4">
      <div className="flex gap-2 items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <Link href="/tasks">
            <X />
          </Link>
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onChange("completed", !task.completed)}
          />
          <div className="h-3 w-px bg-gray-400" />
          <Popover>
            <PopoverTrigger className="flex gap-2 items-center">
              <CalendarIcon size={16} color={task.dueDate ? "black" : "gray"} />
              {task.dueDate && (
                <p
                  className="text-sm"
                  style={{ color: colors[task.priority!] }}
                >
                  {intlFormatDistance(task.dueDate, new Date())}
                  {", "}
                  {format(task.dueDate, "dd MMM yyyy")}
                </p>
              )}
              {!task.dueDate && <p className="text-gray-700">Due date</p>}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={task.dueDate}
                fromDate={addDays(new Date(), 1)}
                onSelect={(d) => onChange("dueDate", d)}
              />
            </PopoverContent>
          </Popover>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Flag
                    size={20}
                    strokeWidth={task.priority === "None" ? 2 : 1}
                    fill={colors[task.priority!]}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">Priority</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup
              value={task.priority}
              onValueChange={(val) => onChange("priority", val)}
            >
              {Object.keys(colors).map((val, i) => (
                <DropdownMenuRadioItem value={val} key={i}>
                  <div className="flex flex-row justify-between items-center w-full">
                    {val} <Flag fill={colors[val]} strokeWidth={1} size={15} />
                  </div>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
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
        value={task.description ?? ""}
        onChange={(e) => onChange("description", e.target.value)}
      />
      <AlertDialog>
        <AlertDialogTrigger className="self-end mt-auto">
          <Trash color="red" id="deleteTask" />
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
