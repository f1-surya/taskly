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
import { GripVertical } from "lucide-react";
import { useState } from "react";
import { Card, CardHeader, CardTitle } from "./ui/card";

interface Column {
  id: string;
  name: string;
  tasks: Task[];
}

interface Task {
  id: string;
  name: string;
}

const columns: Column[] = [
  {
    name: "Todo",
    id: "kfldloldmv-90dklsco",
    tasks: [
      {
        id: "task-skalxclkMKZaosa",
        name: "Design UI mockup",
      },
      {
        id: "task-skalxclkMKZaoss",
        name: "Create project wireframes",
      },
      {
        id: "task-skalxclkMKZaora",
        name: "Research user requirements",
      },
      {
        id: "task-new-1",
        name: "Set up project repository",
      },
      {
        id: "task-new-2",
        name: "Define project scope",
      },
    ],
  },
  {
    name: "In progress",
    id: "kfldloldmv-90dkllelmd",
    tasks: [
      {
        id: "task-progress-1",
        name: "Implement user authentication",
      },
      {
        id: "task-progress-2",
        name: "Develop backend API endpoints",
      },
      {
        id: "task-progress-3",
        name: "Create responsive design",
      },
    ],
  },
  {
    name: "Complete",
    id: "kfldloldmv-90dklscoldlele",
    tasks: [
      {
        id: "task-complete-1",
        name: "Initial project setup",
      },
      {
        id: "task-complete-2",
        name: "Project kickoff meeting",
      },
      {
        id: "task-complete-3",
        name: "Environment configuration",
      },
    ],
  },
];

export function Board() {
  const [cols, setCols] = useState(columns);
  const [activeCol, setActiveCol] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const onDragStart = (e: DragStartEvent) => {
    const { active } = e;

    const activeId = active.id.toString();
    const colIndex = cols.findIndex((col) => col.id === activeId);
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

    const overColIndex = cols.findIndex((col) => col.id === overId);

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
      const activeColIndex = cols.findIndex((col) => col.id === activId);
      const overColIndex = cols.findIndex((col) => col.id === overId);

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
    <DndContext
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto snap-x pb-4 h-[90%]">
        <SortableContext items={cols.map((col) => col.id)}>
          {cols.map((col) => (
            <Column key={col.id} column={col} />
          ))}
        </SortableContext>
      </div>
      <DragOverlay>
        {activeCol && <Column column={activeCol} />}
        {activeTask && <Task task={activeTask} />}
      </DragOverlay>
    </DndContext>
  );
}

export function Column({ column }: { column: Column }) {
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
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex flex-col rounded-lg border bg-card flex-shrink-0 snap-center p-2 w-72 h-full",
        isDragging && "opacity-70 shadow-lg",
      )}
      {...attributes}
    >
      <div
        className="flex items-center justify-between px-1 mb-4"
        {...listeners}
      >
        <h3 className="text-xl font-medium">{column.name}</h3>
        <GripVertical
          className={cn(
            "h-4 w-4 text-muted-foreground cursor-grab",
            isDragging && "cursor-grabbing",
          )}
        />
      </div>
      <div className="flex-1 space-y-2 h-full">
        <SortableContext items={column.tasks.map((task) => task.id)}>
          {column.tasks.map((task) => (
            <Task key={task.id} task={task} />
          ))}
        </SortableContext>
        {column.tasks.length === 0 && (
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
        <CardTitle>{task.name}</CardTitle>
      </CardHeader>
    </Card>
  );
}
