import { db } from "@/db";
import { boards, columns } from "@/db/schema";
import { columnBatchUpdateSchema } from "@/lib/zod-schemas";
import { auth } from "auth";
import { and, eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

export const PUT = auth(async (req) => {
  const user = req.auth?.user;
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parseResult = columnBatchUpdateSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      { message: parseResult.error.message },
      { status: 400 },
    );
  }

  const boardIds = [...new Set(parseResult.data.map((col) => col.board))];
  if (boardIds.length > 1) {
    return NextResponse.json(
      { message: "Cannot uppdate columns from multiple boards in one request" },
      { status: 400 },
    );
  }

  const boardId = boardIds[0];

  const currBoard = await db.query.boards.findFirst({
    where: and(eq(boards.id, boardId), eq(boards.owner, user.id!)),
  });

  if (!currBoard) {
    return NextResponse.json({ message: "Board not found" }, { status: 404 });
  }

  const columnIds = parseResult.data.map((col) => col.id);
  const existingColumns = await db.query.columns.findMany({
    where: and(eq(columns.board, boardId), inArray(columns.id, columnIds)),
  });

  if (existingColumns.length !== columnIds.length) {
    return NextResponse.json(
      {
        message: "One or more columns exist or don't belong to the same board.",
      },
      { status: 400 },
    );
  }

  await db.transaction(async (tx) => {
    const updatePromises = parseResult.data.map((col) =>
      tx
        .update(columns)
        .set({ index: col.index })
        .where(eq(columns.id, col.id)),
    );
    await Promise.all(updatePromises);
  });
  return NextResponse.json({ message: "Columns updated successfully" });
});
