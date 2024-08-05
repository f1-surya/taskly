"use client";

import TaskList from "@/components/tasks/tasklist";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ITask } from "@/interfaces/task";
import { useParams } from "next/navigation";
import { createContext, ReactNode, useEffect, useState } from "react";

export const TaskContext = createContext<{
  tasks: ITask[];
  updateTask: (taskId: string, updatedTask: { [key: string]: any }) => void;
  addTask: (task: ITask) => void;
  deleteTask: (task: ITask) => void;
}>({
  deleteTask: () => {},
  tasks: [],
  updateTask: () => {},
  addTask: () => {},
});

export default function TaskProvider({
  children,
  tasks,
}: {
  children: ReactNode;
  tasks: ITask[];
}) {
  const [tasksState, setTasksState] = useState<ITask[]>(tasks);
  const [isDesktop, setIsDesktop] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    setIsDesktop(window.matchMedia("(min-width: 768px)").matches);
  }, []);

  function updateTask(taskId: string, updatedTask: { [key: string]: any }) {
    const updatedTasks = tasksState.map((task) =>
      task._id === taskId ? { ...task, ...updatedTask } : task,
    );
    setTasksState(updatedTasks);
  }

  function addTask(task: ITask) {
    setTasksState([...tasksState, task]);
  }

  function deleteTask(task: ITask) {
    setTasksState(tasksState.filter((e) => e._id !== task._id));
  }

  return (
    <TaskContext.Provider
      value={{ tasks: tasksState, updateTask, addTask, deleteTask }}
    >
      {isDesktop ? (
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50}>
            <TaskList />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={50}>{children}</ResizablePanel>
        </ResizablePanelGroup>
      ) : id ? (
        children
      ) : (
        <TaskList />
      )}
    </TaskContext.Provider>
  );
}
