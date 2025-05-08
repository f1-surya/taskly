import { cn } from "@/lib/utils";
import type { ColumnWithTasks } from "@/types/db";
import { useSortable, SortableContext } from "@dnd-kit/sortable";
import { GripVertical, Plus, X, Check, EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { Card, CardHeader, CardFooter } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import KanbanTask from "./task";
import { CSS } from "@dnd-kit/utilities";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function KanbanColumn({
  column,
  action,
  onDelete,
}: {
  column: ColumnWithTasks;
  action: (title: string, col: number) => void;
  onDelete: (col: number) => void;
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
        "flex flex-col rounded-lg border bg-card flex-shrink-0 snap-center p-2 w-72",
        isDragging && "opacity-70 shadow-lg",
      )}
      {...attributes}
    >
      <div className="flex items-center justify-between px-1 mb-4">
        <div className="flex items-center gap-2">
          <GripVertical
            className={cn(
              "h-4 w-4 cursor-grab text-muted-foreground touch-none",
              isDragging && "cursor-grabbing",
            )}
            {...listeners}
          />
          <h3 className="text-xl font-medium">{column.name}</h3>
        </div>
        <div className="flex items-center justify-end">
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-6 w-4 cursor-pointer"
              >
                <EllipsisVertical size={20} className="text-muted-foreground" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete(column.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex-1 space-y-2 h-full">
        <SortableContext items={column.tasks.map((task) => task.id)}>
          {column.tasks.map((task) => (
            <KanbanTask key={task.id} task={task} />
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
