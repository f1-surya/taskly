"use client";

import TaskModel from "@/models/task";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "@radix-ui/react-icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

dayjs.extend(relativeTime);

interface Props {
  tasks: Array<any>;
}

const formSchema = z.object({
  title: z.string().min(4, "Title must be at least 4 characters long"),
  description: z.string().optional(),
});

const filters = ["All", "Pending", "Completed"];
let defaultFilter: string | undefined;
if (typeof window !== "undefined") {
  defaultFilter = localStorage.filter;
}

/**
 * Renders a list of tasks.
 *
 * @param {Object} props - The props object.
 * @param {Array<any>} props.tasks - The array of tasks.
 * @return {JSX.Element} The rendered list of tasks.
 */
export default function TaskList({ tasks }: Props) {
  const [taskList, setTaskList] = useState(tasks);
  const [task, setTask] = useState<TaskModel | null>(null);
  const [currTask, setCurrTask] = useState<TaskModel | null>(null);
  const [filter, setFilter] = useState<string>(defaultFilter ?? "All");
  const [deleteTask, setDeleteTask] = useState(null);
  const edit = useRef(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (filter === "All") {
      setTaskList(tasks);
    } else if (filter === "Pending") {
      setTaskList(tasks.filter((task) => !task.completed));
    } else if (filter === "Completed") {
      setTaskList(tasks.filter((task) => task.completed));
    }
    localStorage.filter = filter;
  }, [filter, tasks]);

  /**
   * Saves a task to the server.
   *
   * @param {z.infer<typeof formSchema>} data - The data of the task.
   * @return {Promise<void>} A promise that resolves when the task is saved.
   */
  async function saveTask(data: z.infer<typeof formSchema>) {
    if (edit.current) {
      // @ts-ignore
      data._id = currTask?._id;
    }
    const res = await fetch("/api/task", {
      method: edit.current ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        completed: false,
      }),
    });
    edit.current = false;
    if (res.status === 201) {
      window.location.reload();
    } else {
      toast.error("Something went wrong");
    }
  }

  /**
   * Changes the status of a task on the server.
   *
   * @param {TaskModel} task - The task to change the status of.
   * @return {Promise<void>} A promise that resolves when the task's status is changed.
   */
  async function changeStatus(task: TaskModel) {
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
      window.location.reload();
    } else {
      toast.error("Something went wrong");
    }
  }

  async function removeTask() {
    const res = await fetch(`/api/task`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: deleteTask }),
    });
    if (res.status === 200) {
      window.location.reload();
    } else {
      toast.error("Something went wrong");
      setDeleteTask(null);
    }
  }

  return (
    <div className="flex flex-col gap-2 m-2">
      {/* Header */}
      <div className="flex items-center justify-between mx-2 gap-2">
        <h1 className="text-2xl font-semibold">{filter} Tasks</h1>
        {/* Filter select */}
        <div className="w-36 bg-white rounded-lg">
          <Select onValueChange={(value) => setFilter(value)}>
            <SelectTrigger>{filter}</SelectTrigger>
            <SelectContent>
              {/* Generate filter options */}
              {filters.map((filter) => (
                <SelectItem key={filter} value={filter}>
                  {filter}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* Task list */}
      {taskList.map((task) => (
        <div
          key={task._id}
          className="radius-6 bg-gray-100 w-[400px] sm:w-[500px] rounded-lg p-4 flex gap-4 shadow-inner cursor-pointer hover:bg-gray-200 transition-colors"
        >
          {/* Checkbox */}
          <Checkbox
            defaultChecked={task.completed}
            onCheckedChange={() => changeStatus(task)}
          />
          {/* Task details */}
          <div
            className="w-full"
            onClick={() => {
              setTask(task);
              edit.current = true;
            }}
          >
            <p className="text-2xl font-semibold">{task.title}</p>
            {/* Description */}
            {task.description && (
              <p className="text-gray-700">{task.description}</p>
            )}
          </div>
          <Button
            size="icon"
            className="bg-gray-100"
            onClick={() => setDeleteTask(task._id)}
          >
            <Trash2 color="red" />
          </Button>
        </div>
      ))}
      {/* Dialog for editing a task */}
      <Dialog open={task !== null} onOpenChange={() => setTask(null)}>
        <DialogContent>
          {/* Dialog header */}
          <DialogHeader>
            {/* Task title */}
            <DialogTitle>{task?.title}</DialogTitle>
            {/* Task description */}
            {task?.description && (
              <DialogDescription className="text-start">
                {task?.description}
              </DialogDescription>
            )}
            {/* Task status */}
            <Select
              value={task?.completed ? "completed" : "not-completed"}
              onValueChange={() => changeStatus(task!)}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={task?.completed ? "Completed" : "Not completed"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"completed"}>Completed</SelectItem>
                <SelectItem value="not-completed">Not completed</SelectItem>
              </SelectContent>
            </Select>
            {/* Task details */}
            <div className="flex justify-between text-sm text-gray-600">
              <p>Created: {dayjs(task?.createdAt).fromNow()}</p>
              {task?.dueDate && <p>Due: {dayjs(task?.dueDate).fromNow()}</p>}
            </div>
          </DialogHeader>
          {/* Dialog footer */}
          <DialogFooter className="gap-2">
            {/* Close button */}
            <Button onClick={() => setTask(null)}>Close</Button>
            {/* Edit button */}
            <Button
              className="bg-blue-600"
              onClick={() => {
                setTask(null);
                setCurrTask(task);
                form.reset(task!);
              }}
            >
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Dialog for adding a new task */}
      <Dialog open={currTask !== null} onOpenChange={() => setCurrTask(null)}>
        <DialogContent>
          {/* Dialog header */}
          <DialogHeader>
            <DialogTitle>Add or edit task</DialogTitle>
          </DialogHeader>
          {/* Form for adding a new task */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(saveTask)} className="gap-2">
              {/* Task title input */}
              <FormField
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <Input {...field} />
                    <FormDescription>Title of this task</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Task description input */}
              <FormField
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <Input {...field} />
                    <FormDescription>
                      A description of this task
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Dialog footer */}
              <DialogFooter className="gap-2 mt-2">
                {/* Close button */}
                <Button onClick={() => setCurrTask(null)}>Close</Button>
                {/* Save button */}
                <Button className="bg-blue-600" type="submit">
                  Save
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Dialog
        onOpenChange={() => setDeleteTask(null)}
        open={deleteTask !== null}
      >
        <DialogContent>
          <DialogTitle>Are you sure you want to delete this task?</DialogTitle>
          <DialogFooter>
            <Button>No</Button>
            <Button className="bg-red-700" onClick={removeTask}>Yes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Button for adding a new task */}
      <Button
        className="bg-blue-600 absolute bottom-6 right-6 w-12 h-12 rounded-3xl"
        onClick={() =>
          setCurrTask({
            title: "",
            _id: "",
            completed: false,
            createdAt: new Date(),
          })
        }
      >
        <PlusIcon />
      </Button>
    </div>
  );
}
