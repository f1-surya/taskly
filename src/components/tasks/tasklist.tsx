"use client";

import TaskModel from "@/models/task";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "@radix-ui/react-icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
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
import { toast } from "sonner";

dayjs.extend(relativeTime);

interface Props {
  tasks: Array<any>;
}

const formSchema = z.object({
  title: z.string().min(4, "Title must be at least 4 characters long"),
  description: z.string().optional(),
});

export default function TaskList({ tasks }: Props) {
  const [task, setTask] = useState<TaskModel | null>(null);
  const [currTask, setCurrTask] = useState<TaskModel | null>(null);
  const edit = useRef(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function saveTask(data: z.infer<typeof formSchema>) {
    // @ts-ignore
    data._id = currTask?._id;
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
    if (res.status === 201) {
      window.location.reload();
    } else {
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {tasks.map((task) => (
        <div
          key={task._id}
          className="radius-6 bg-gray-100 w-[400px] sm:w-[500px] rounded-lg p-4 flex gap-4 shadow-inner cursor-pointer hover:bg-gray-200 transition-colors"
        >
          <Checkbox
            defaultChecked={task.completed}
            onCheckedChange={async (e) => {
              const res = await fetch("/api/task", {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ completed: e, _id: task._id }),
              });
              if (res.status === 201) {
                window.location.reload();
              } else {
                toast.error("Something went wrong");
              }
            }}
          />
          <div
            className="w-full"
            onClick={() => {
              setTask(task);
              edit.current = true;
            }}
          >
            <p className="text-2xl font-semibold">{task.title}</p>
            {task.description && (
              <p className="text-gray-700">{task.description}</p>
            )}
            {task.dueDate && (
              <p className="text-gray-600 text-sm">
                Due: {dayjs(task.dueDate).fromNow()}
              </p>
            )}
          </div>
        </div>
      ))}
      <Dialog open={task !== null} onOpenChange={() => setTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{task?.title}</DialogTitle>
            {task?.description && (
              <DialogDescription className="text-start">
                {task?.description}
              </DialogDescription>
            )}
            <Select value={task?.completed ? "completed" : "not-completed"}>
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
            <div className="flex justify-between text-sm text-gray-600">
              <p>Created: {dayjs(task?.createdAt).fromNow()}</p>
              {task?.dueDate && <p>Due: {dayjs(task?.dueDate).fromNow()}</p>}
            </div>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button onClick={() => setTask(null)}>Close</Button>
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
      <Dialog open={currTask !== null} onOpenChange={() => setCurrTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add or edit task</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(saveTask)} className="gap-2">
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
              <DialogFooter className="gap-2 mt-2">
                <Button onClick={() => setCurrTask(null)}>Close</Button>
                <Button className="bg-blue-600" type="submit">
                  Save
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
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
