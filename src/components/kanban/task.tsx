import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/types/db";

export default function KanbanTask({ task }: { task: Task }) {
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
