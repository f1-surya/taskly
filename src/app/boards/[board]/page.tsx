import { KanbanBoard } from "@/components/kanban-board";
import { boards, columns } from "@/db/schema";
import { db } from "@/db";
import { auth } from "auth";
import { and, eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";

export default async function Tasks({
  params,
}: {
  params: Promise<{ board: string }>;
}) {
  const [session, pathParams] = await Promise.all([auth(), params]);

  if (!session || !session.user) {
    redirect("/login");
  }

  const currBoard = await db.query.boards.findFirst({
    where: and(
      eq(boards.id, parseInt(pathParams.board)),
      eq(boards.owner, session.user!.id!),
    ),
    with: {
      columns: {
        with: {
          tasks: true,
        },
        orderBy: columns.index,
      },
    },
  });

  if (!currBoard) notFound();

  return (
    <div className="h-screen p-4">
      <KanbanBoard currBoard={currBoard} />
    </div>
  );
}
