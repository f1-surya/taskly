import { KanbanBoard } from "@/components/kanban-board";
import { boards, columns, tasks } from "@/db/schema";
import { db } from "@/db";
import { auth } from "auth";
import { and, eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ board: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { board } = await params;

  const currBoard = await db
    .select({ name: boards.name })
    .from(boards)
    .where(eq(boards.id, parseInt(board)));

  return { title: currBoard[0].name + " | BoardIt" };
}

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
          tasks: {
            orderBy: tasks.index,
          },
        },
        orderBy: columns.index,
      },
    },
  });

  if (!currBoard) notFound();

  return (
    <main className="h-screen p-4">
      <KanbanBoard currBoard={currBoard} />
    </main>
  );
}
