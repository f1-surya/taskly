import { cn } from "@/lib/utils";
import { Task } from "@/types/db";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type MouseEvent } from "react";
import { Card, CardHeader, CardTitle } from "../ui/card";

export default function KanbanTask({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    const params = new URLSearchParams(searchParams);
    params.set("task", task.id.toString());
    window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
  };

  return (
    <Card
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={cn(
        "shadow-sm touch-manipulation cursor-pointer",
        isDragging && "opacity-70 shadow-md",
      )}
      onClick={handleClick}
    >
      <CardHeader>
        <CardTitle>{task.title}</CardTitle>
      </CardHeader>
    </Card>
  );
}
