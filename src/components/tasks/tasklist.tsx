"use client";

import { TaskContext } from "@/app/tasks/task-provider";
import { ITask } from "@/interfaces/task";
import { getCookie, setCookie } from "cookies-next";
import { ArrowDownUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  KeyboardEvent,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import { Checkbox } from "../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { differenceInDays } from "date-fns";

const groups = ["None", "Priority", "Due date"];
const sorts = ["None", "Date", "Title"];

/**
 * Renders a list of tasks.
 *
 * @return {ReactNode} The rendered list of tasks.
 */
export default function TaskList(): ReactNode {
  const [groupBy, setGroupBy] = useState(getCookie("group") || groups[0]);
  const [sort, setSort] = useState(getCookie("sort") || sorts[0]);
  const [taskGroups, setTaskGroups] = useState<{ [key: string]: ITask[] }>({});
  const { tasks, updateTask, addTask, sortTasks } = useContext(TaskContext);
  const router = useRouter();

  useEffect(() => {
    setCookie("group", groupBy, { sameSite: "strict" });
    setCookie("sort", sort, { sameSite: "strict" });
    setTaskGroups({});
    if (groupBy !== "None") {
      const groups = tasks.reduce(
        (acc, task) => {
          if (task.completed) return acc;
          if (groupBy === "Due date") {
            let dueDateKey = "None";
            if (task.dueDate) {
              const diff = differenceInDays(task.dueDate, new Date());
              if (diff < 0) {
                dueDateKey = "Overdue";
              } else if (diff < 1) {
                dueDateKey = "Today";
              } else {
                dueDateKey = "Later";
              }
            }
            return {
              ...acc,
              [dueDateKey]: [...(acc[dueDateKey] || []), task].sort(
                sortTasksLocal,
              ),
            };
          }
          return {
            ...acc,
            [task.priority]: [...(acc[task.priority] || []), task].sort(
              sortTasksLocal,
            ),
          };
        },
        {} as { [key: string]: ITask[] },
      );
      setTaskGroups(groups);
    } else if (sort !== "None") {
      sortTasks(tasks.sort(sortTasksLocal));
    }
  }, [groupBy, sort, tasks]);

  function sortTasksLocal(a: ITask, b: ITask) {
    if (sort === "Date") {
      return a.createdAt.getTime() - b.createdAt.getTime();
    } else if (sort === "Title") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  }

  const pendingTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  /**
   * Saves a task when the Enter key is pressed and the task title is not empty.
   *
   * @param {KeyboardEvent<HTMLInputElement>} e - The keyboard event triggered by the user.
   * @return {Promise<string | number | undefined>} - A promise that resolves when the task is saved successfully.
   */
  async function saveTask(
    e: KeyboardEvent<HTMLInputElement>,
  ): Promise<string | number | undefined> {
    const title = e.currentTarget.value;
    if (e.key === "Enter") {
      if (title.length === 0) {
        return toast.error("Title cannot be empty");
      }
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
    toast.promise(
      fetch("/api/task", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...task,
          completed: !task.completed,
        }),
      }).then((res) => {
        if (res.status === 201) {
          updateTask(task._id!, { completed: !task.completed });
        } else {
          toast.error("Something went wrong");
        }
      }),
    );
  }

  function renderTask(task: ITask) {
    return (
      <div
        key={task._id}
        id={task._id}
        className={`radius-6 bg-gray-100 w-full rounded-lg p-2 flex gap-4 shadow-inner items-center cursor-pointer hover:bg-gray-200 transition-colors task ${task.completed ? "opacity-50" : "opacity-100"}`}
      >
        <Checkbox
          id={`checkBox-${task._id}`}
          checked={task.completed}
          onCheckedChange={() => changeStatus(task)}
        />
        <Link href={`/tasks/${task._id}`} className="w-full">
          <p className="text-md font-semibold">{task.title}</p>
        </Link>
      </div>
    );
  }

  function renderGroup(group: string, tasks: ITask[]) {
    return (
      <div className="flex flex-col gap-2" key={group}>
        <p className="font-semibold text-md my-1">{group}</p>
        {tasks.map(renderTask)}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 m-2 w-full sm:w-auto tasks">
      <div className="flex flex-row items-center justify-between border-b-2 border-gray-300 p-2">
        <div className="flex flex-row items-center gap-2">
          <Image src="/logo.svg" alt="Logo" width={35} height={35} />
          <p className="font-semibold text-md">Task manager</p>
        </div>
        <Popover>
          <PopoverTrigger>
            <ArrowDownUp size={16} />
          </PopoverTrigger>
          <PopoverContent className="flex gap-2 flex-col max-w-40">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex flex-row items-center justify-between w-full text-sm">
                Group by
                <span className="text-xs text-gray-600">{groupBy}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup
                  value={groupBy}
                  onValueChange={setGroupBy}
                >
                  {groups.map((group, i) => (
                    <DropdownMenuRadioItem value={group} key={i}>
                      {group}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex flex-row items-center justify-between w-full text-sm">
                Sort
                <span className="text-xs text-gray-600">{sort}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                  {sorts.map((sort, i) => (
                    <DropdownMenuRadioItem value={sort} key={i}>
                      {sort}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </PopoverContent>
        </Popover>
      </div>
      <Input
        placeholder="+ Add a task"
        className="ring-0 focus:ring-1"
        id="taskTitle"
        onKeyDown={saveTask}
      />
      <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-4rem)]">
        {groupBy === "None" && pendingTasks.map(renderTask)}

        {groupBy === "Due date" &&
          Object.keys(taskGroups).map((group) =>
            renderGroup(group, taskGroups[group]),
          )}

        {taskGroups.High && renderGroup("High", taskGroups.High)}
        {taskGroups.Medium && renderGroup("Medium", taskGroups.Medium)}
        {taskGroups.Low && renderGroup("Low", taskGroups.Low)}
        {groupBy !== "Due date" &&
          taskGroups.None &&
          renderGroup("None", taskGroups.None)}

        {completedTasks.length > 0 &&
          renderGroup("Completed tasks", completedTasks)}
      </div>
    </div>
  );
}
