import { KanbanBoard } from "@/components/kanban-board";
import { boards, columns } from "@/db/schema";
import { db } from "@/db";
import { auth } from "auth";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function Tasks({
  params,
}: {
  params: Promise<{ board: string }>;
}) {
  const boardId = (await params).board;
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const currBoard = await db.query.boards.findFirst({
    where: eq(boards.id, parseInt(boardId)),
  });

  if (!currBoard) {
    return new Response("Board not found", { status: 404 });
  }
  const boardColumns = await db.query.columns.findMany({
    where: eq(columns.board, parseInt(boardId)),
    with: {
      tasks: true,
    },
  });

  return (
    <div className="h-screen p-4">
      <KanbanBoard currBoard={currBoard} columns={boardColumns} />
    </div>
  );
}
