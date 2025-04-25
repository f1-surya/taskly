"use client";

import { cn } from "@/lib/utils";
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, GripVertical, Plus, PlusCircle, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Task, ColumnWithTasks, BoardWithColumns } from "@/types/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface BoardProps {
  currBoard: BoardWithColumns;
}

export function KanbanBoard({ currBoard }: BoardProps) {
  const [boardName, setBoardName] = useState(currBoard.name);
  const [cols, setCols] = useState(currBoard.columns);
  const [activeCol, setActiveCol] = useState<ColumnWithTasks | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const lastSavedName = useRef(boardName);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      if (lastSavedName.current !== boardName) {
        fetch(`/api/board?id=${currBoard.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: boardName }),
        })
          .then((res) => {
            if (res.ok) {
              lastSavedName.current = boardName;
            }
          })
          .catch((err) => {
            toast.error(err.message);
          });
      }
    }, 500);

    return () => clearTimeout(timeOut);
  }, [boardName]);

  const saveTask = async (title: string, column: number) => {
    const col = cols.find((col) => col.id === column);
    if (!col) return;

    const newTask = await fetch("/api/task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, column, index: col.tasks.length }),
    });
    if (newTask.ok) {
      const newTaskData = await newTask.json();
      setCols((prev) => {
        return prev.map((col) => {
          if (col.id === column) {
            return {
              ...col,
              tasks: [...col.tasks, newTaskData],
            };
          }
          return col;
        });
      });
    } else {
      toast.error("Failed to create task");
    }
  };

  const onDragStart = (e: DragStartEvent) => {
    const { active } = e;

    const activeId = active.id.toString();
    const colIndex = cols.findIndex((col) => col.id.toString() === activeId);
    if (colIndex !== -1) {
      setActiveCol(cols[colIndex]);
    } else {
      for (const col of cols) {
        const task = col.tasks.find((task) => task.id === activeId);
        if (task) {
          setActiveTask(task);
          break;
        }
      }
    }
  };

  const onDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    if (activeId == overId) return;
    if (!activeId.includes("task")) return;

    const activeColIndex = cols.findIndex((col) =>
      col.tasks.some((task) => task.id === activeId),
    );
    if (activeColIndex === -1) return;

    const overColIndex = cols.findIndex((col) => col.id.toString() === overId);

    if (overColIndex !== -1) {
      if (activeColIndex === overColIndex) return;

      setCols((prev) => {
        const activeCol = prev[activeColIndex];
        const taskIndex = activeCol.tasks.findIndex(
          (task) => task.id === activeId,
        );

        if (taskIndex === -1) return prev;

        const task = activeCol.tasks[taskIndex];

        const newCols = [...prev];
        newCols[activeColIndex] = {
          ...activeCol,
          tasks: activeCol.tasks.filter((task) => task.id !== activeId),
        };

        newCols[overColIndex] = {
          ...newCols[overColIndex],
          tasks: [...newCols[overColIndex].tasks, task],
        };

        return newCols;
      });
      return;
    }

    const overTaskColIndex = cols.findIndex((col) =>
      col.tasks.some((task) => task.id === overId),
    );
    if (overTaskColIndex !== -1 && overTaskColIndex !== activeColIndex) {
      setCols((prev) => {
        const newCols = [...prev];
        const activeCol = newCols[activeColIndex];
        const taskIndex = activeCol.tasks.findIndex(
          (task) => task.id === activeId,
        );

        if (taskIndex === -1) return prev;

        newCols[activeColIndex] = {
          ...activeCol,
          tasks: activeCol.tasks.filter((task) => task.id !== activeId),
        };

        const overCol = newCols[overTaskColIndex];
        const overTaskIndex = overCol.tasks.findIndex(
          (task) => task.id === activeId,
        );
        const newTasks = [...overCol.tasks];
        newTasks.splice(overTaskIndex, 0, activeCol.tasks[taskIndex]);
        newCols[overTaskColIndex] = {
          ...overCol,
          tasks: newTasks,
        };
        return newCols;
      });
    }
  };

  const onDragEnd = (e: DragEndEvent) => {
    setActiveCol(null);
    setActiveTask(null);
    const { active, over } = e;

    if (!over) return;

    const activId = active.id.toString();
    const overId = over.id.toString();

    if (!activId.includes("task") && !overId.includes("task")) {
      const activeColIndex = cols.findIndex(
        (col) => col.id.toString() === activId,
      );
      const overColIndex = cols.findIndex(
        (col) => col.id.toString() === overId,
      );

      if (
        activeColIndex !== -1 &&
        overColIndex !== -1 &&
        activeColIndex !== overColIndex
      ) {
        setCols((cols) => arrayMove(cols, activeColIndex, overColIndex));
      }
      return;
    }

    if (activId.includes("task") && overId.includes("task")) {
      const activeColIndex = cols.findIndex((col) =>
        col.tasks.some((task) => task.id === activId),
      );
      if (activeColIndex === -1) return;

      const activeCol = cols[activeColIndex];
      const taskIndex = activeCol.tasks.findIndex(
        (task) => task.id === activId,
      );
      if (taskIndex === -1) return;

      const overTaskIndex = activeCol.tasks.findIndex(
        (task) => task.id === overId,
      );
      if (overTaskIndex !== -1 && taskIndex !== overTaskIndex) {
        setCols((prev) => {
          const newCols = [...prev];
          newCols[activeColIndex] = {
            ...activeCol,
            tasks: arrayMove(activeCol.tasks, taskIndex, overTaskIndex),
          };
          return newCols;
        });
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-row items-center justify-between px-1 mb-4">
        <input
          className="text-2xl font-medium focus:outline-none"
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
        />
        <Button>
          <PlusCircle />
          Add Column
        </Button>
      </div>
      <DndContext
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto snap-x pb-4 h-[90%]">
          <SortableContext items={cols.map((col) => col.id)}>
            {cols.map((col) => (
              <Column key={col.id} column={col} action={saveTask} />
            ))}
          </SortableContext>
        </div>
        <DragOverlay>
          {activeCol && <Column column={activeCol} action={saveTask} />}
          {activeTask && <Task task={activeTask} />}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export function Column({
  column,
  action,
}: {
  column: ColumnWithTasks;
  action: (title: string, col: number) => void;
}) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [title, setTitle] = useState("");
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const save = () => {
    action(title, column.id);
    setIsAddingTask(false);
    setTitle("");
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex flex-col rounded-lg border bg-card flex-shrink-0 snap-center p-2 w-72 h-[95%]",
        isDragging && "opacity-70 shadow-lg",
      )}
      {...attributes}
    >
      <div className="flex items-center justify-between px-1 mb-4">
        <div className="flex items-center gap-2">
          <GripVertical
            className={cn(
              "h-4 w-4 cursor-grab text-muted-foreground",
              isDragging && "cursor-grabbing",
            )}
            {...listeners}
          />
          <h3 className="text-xl font-medium">{column.name}</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="p-0"
            onClick={() => setIsAddingTask(true)}
            disabled={isAddingTask}
          >
            <Plus size={20} className="text-muted-foreground" />
            <span className="sr-only">Add task</span>
          </Button>
        </div>
      </div>
      <div className="flex-1 space-y-2 h-full">
        <SortableContext items={column.tasks.map((task) => task.id)}>
          {column.tasks.map((task) => (
            <Task key={task.id} task={task} />
          ))}
        </SortableContext>
        {isAddingTask && (
          <Card className="border-dashed border-2">
            <CardHeader className="px-2 py-0">
              <Input
                type="text"
                placeholder="Task name"
                className="text-xs md:text-md font-medium border-none p-1"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </CardHeader>
            <CardFooter className="flex gap-2 justify-end px-2 py-0">
              <Button
                size="sm"
                variant="destructive"
                className="h-6 w-6"
                onClick={() => setIsAddingTask(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button size="sm" className="h-6 w-6" onClick={save}>
                <Check className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}
        {!isAddingTask && column.tasks.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-xs md:text-sm">No tasks</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function Task({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={cn(
        "cursor-grab shadow-sm touch-manipulation",
        isDragging && "opacity-70 shadow-md cursor-grabbing",
      )}
    >
      <CardHeader>
        <CardTitle>{task.title}</CardTitle>
      </CardHeader>
    </Card>
  );
}
