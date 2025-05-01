import { db } from "@/db";
import { boards, columns, tasks } from "@/db/schema";
import { taskBatchUpdateSchema } from "@/lib/zod-schemas";
import { auth } from "auth";
import { eq, and, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

export const PUT = auth(async (req) => {
  const user = req.auth?.user;
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  console.log(body);
  const parseResult = taskBatchUpdateSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      { message: parseResult.error.issues[0].message },
      { status: 400 },
    );
  }
  const validatedBody = parseResult.data;

  const searchParams = req.nextUrl.searchParams;
  const boardId = searchParams.get("board");
  if (!boardId) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  const currBoard = await db.query.boards.findFirst({
    where: eq(boards.id, parseInt(boardId)),
  });

  if (!currBoard) {
    return NextResponse.json({ message: "Board not found" }, { status: 404 });
  }

  if (currBoard.owner !== user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const colIds = Object.keys(validatedBody).map((id) => parseInt(id));

  const cols = await db.query.columns.findMany({
    where: and(eq(columns.board, currBoard.id), inArray(columns.id, colIds)),
  });

  if (cols.length !== colIds.length) {
    return NextResponse.json(
      {
        message: "One or more columns exist or don't belong to the same board.",
      },
      { status: 400 },
    );
  }

  await db.transaction(async (tx) => {
    // @ts-expect-error The returned promise is not used so it's fine.
    const updatePromises: Promise[] = [];

    for (const col of cols) {
      const modifiedTasks = validatedBody[col.id];
      if (!modifiedTasks) {
        continue;
      }

      for (const currTask of modifiedTasks) {
        console.log(currTask);
        updatePromises.push(
          tx.update(tasks).set(currTask).where(eq(tasks.id, currTask.id!)),
        );
      }
    }
    await Promise.all(updatePromises);
  });
  return NextResponse.json({}, { status: 200 });
});
