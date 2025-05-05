import { db } from "@/db";
import { boards, columns } from "@/db/schema";
import { columnInsertSchema } from "@/lib/zod-schemas";
import { auth } from "auth";
import { and, eq, gt, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import "server-only";

export const POST = auth(async (req) => {
  const user = req.auth?.user;
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parseResult = columnInsertSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      { message: parseResult.error.message },
      { status: 400 },
    );
  }

  const currBoard = await db.query.boards.findFirst({
    where: and(
      eq(boards.id, parseResult.data.board),
      eq(boards.owner, user.id!),
    ),
  });

  if (!currBoard) {
    return NextResponse.json({ message: "Board not found" }, { status: 404 });
  }

  const [column] = await db
    .insert(columns)
    .values(parseResult.data)
    .returning();

  return NextResponse.json(column);
});

export const DELETE = auth(async (req) => {
  const user = req.auth?.user;
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  const currCol = await db.query.columns.findFirst({
    where: eq(columns.id, parseInt(id)),
    with: {
      board: true,
    },
  });

  if (!currCol) {
    return NextResponse.json({ message: "Column not found" }, { status: 404 });
  }

  if (currCol.board.owner !== user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await db.transaction(async (tx) => {
    await Promise.all([
      tx.delete(columns).where(eq(columns.id, parseInt(id))),
      tx
        .update(columns)
        .set({ index: sql`${columns.index} - 1` })
        .where(
          and(
            eq(columns.board, currCol.board.id),
            gt(columns.index, currCol.index),
          ),
        ),
    ]);
  });

  return NextResponse.json({ message: "Column deleted successfully" });
});
