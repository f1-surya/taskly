"use client";

import { Button } from "@/components/ui/button";
import type {
  BoardWithColumns,
  Column,
  ColumnWithTasks,
  Task,
} from "@/types/db";
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { PlusCircle } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AddColumn } from "./kanban/add-column";
import KanbanTask from "./kanban/task";
import KanbanColumn from "./kanban/column";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface BoardProps {
  currBoard: BoardWithColumns;
}

export function KanbanBoard({ currBoard }: BoardProps) {
  const [boardName, setBoardName] = useState(currBoard.name);
  const [cols, setCols] = useState(currBoard.columns);
  const [activeCol, setActiveCol] = useState<ColumnWithTasks | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [createColumn, setCreateColumn] = useState(false);
  const [colToDelete, setColToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);
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

  const saveColumn = (name: string) => {
    fetch("/api/column", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, board: currBoard.id, index: cols.length }),
    }).then(async (res) => {
      if (res.ok) {
        toast.success("Column created");
        const newCol = await res.json();
        setCols((prev) => [...prev, { ...newCol, tasks: [] }]);
        setCreateColumn(false);
      } else {
        toast.error("Failed to create column");
      }
    });
  };

  const onDeleteCol = (col: number) => {
    setColToDelete({ id: col, name: cols.find((c) => c.id === col)!.name });
  };

  const deleteCol = async (col: number) => {
    const res = await fetch(`/api/column?id=${col}`, {
      method: "DELETE",
    });

    if (res.ok) {
      toast.success("Column deleted");
      setCols((prev) => {
        const newCols = prev.filter((c) => c.id !== col);
        for (let i = 0; i < newCols.length; i++) {
          newCols[i].index = i;
        }
        return newCols;
      });
    } else {
      toast.error("Failed to delete column");
    }
  };

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
        const movedCols = arrayMove(cols, activeColIndex, overColIndex);
        const oldCols = [...cols];
        setCols(movedCols);
        saveColsOrder(oldCols, movedCols);
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

  const saveColsOrder = async (
    oldCols: ColumnWithTasks[],
    newCols: ColumnWithTasks[],
  ) => {
    const colsToSave: ColumnWithTasks[] = [];
    for (let i = 0; i < newCols.length; i++) {
      const col = newCols[i];
      if (col.index !== i) {
        colsToSave.push({ ...col, index: i });
      }
    }
    if (colsToSave.length > 0) {
      const res = await fetch("/api/column/batch", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(colsToSave),
      });
      if (res.ok) {
        // Update index of cols using colsToSave
        setCols((prev) => {
          const newCols = [...prev];
          for (const col of colsToSave) {
            const index = newCols.findIndex((c) => c.id === col.id);
            if (index !== -1) {
              newCols[index] = { ...col, index: col.index };
            }
          }
          return newCols;
        });
        toast.success("Columns re-ordered");
      } else {
        toast.error("Failed to update columns");
        setCols(oldCols);
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
        <Button onClick={() => setCreateColumn(!createColumn)}>
          <PlusCircle />
          Add Column
        </Button>
      </div>
      <AnimatePresence>
        {createColumn && (
          <AddColumn
            onSave={saveColumn}
            onCancel={() => setCreateColumn(false)}
            key="add-column"
          />
        )}
      </AnimatePresence>
      <DndContext
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto snap-x pb-4 h-[90%]">
          <SortableContext items={cols.map((col) => col.id)}>
            {cols.map((col) => (
              <KanbanColumn
                key={col.id}
                column={col}
                action={saveTask}
                onDelete={onDeleteCol}
              />
            ))}
          </SortableContext>
        </div>
        <DragOverlay>
          {activeCol && (
            <KanbanColumn
              column={activeCol}
              action={saveTask}
              onDelete={onDeleteCol}
            />
          )}
          {activeTask && <KanbanTask task={activeTask} />}
        </DragOverlay>
      </DndContext>
      <AlertDialog
        open={colToDelete !== null}
        onOpenChange={() => setColToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to delete <b>{colToDelete?.name}</b>. This will
              delete the column and the tasks inside it. And it cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setColToDelete(null)}>
              Cancel
            </AlertDialogAction>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={() => {
                deleteCol(colToDelete!.id);
                setColToDelete(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
