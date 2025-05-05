import { db } from "@/db";
import { columns, tasks } from "@/db/schema";
import { auth } from "auth";
import { NextResponse } from "next/server";
import "server-only";
import { taskInsertSchema, taskUpdateSchema } from "@/lib/zod-schemas";
import { and, eq, gt, sql } from "drizzle-orm";

export const POST = auth(async (req) => {
  const user = req.auth?.user;
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const parseResult = taskInsertSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      { message: parseResult.error.message },
      { status: 400 },
    );
  }

  const currCol = await db.query.columns.findFirst({
    where: eq(columns.id, parseResult.data.column),
    with: {
      board: true,
    },
  });

  if (!currCol) {
    return NextResponse.json({ message: "Column not found" }, { status: 404 });
  }

  if (!currCol.board && currCol.board.owner !== user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const [task] = await db.insert(tasks).values(parseResult.data).returning();

  return NextResponse.json(task);
});

export const PUT = auth(async (req) => {
  const user = req.auth?.user;
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const res = taskUpdateSchema.safeParse(body);
  if (!res.success) {
    return NextResponse.json(
      { message: res.error.issues[0].message },
      { status: 400 },
    );
  }

  const currTask = await db.query.tasks.findFirst({
    where: eq(tasks.id, res.data.id!),
    with: {
      column: {
        with: {
          board: true,
        },
      },
    },
  });

  if (!currTask) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }

  if (currTask.column.board.owner !== user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await db.update(tasks).set(res.data).where(eq(tasks.id, res.data.id!));

  return new Response(null, { status: 204 });
});

export const DELETE = auth(async (req) => {
  const user = req.auth?.user;
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const taskId = searchParams.get("id");
  if (!taskId) {
    return NextResponse.json({ message: "Task id not found" }, { status: 400 });
  }

  const currTask = await db.query.tasks.findFirst({
    where: eq(tasks.id, taskId),
    with: {
      column: {
        with: {
          board: true,
        },
      },
    },
  });

  if (!currTask) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }

  if (currTask.column.board.owner !== user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await db.transaction(async (tx) => {
    await Promise.all([
      tx.delete(tasks).where(eq(tasks.id, taskId)),
      tx
        .update(tasks)
        .set({ index: sql`${tasks.index} - 1` })
        .where(
          and(
            eq(tasks.column, currTask.column.id),
            gt(tasks.index, currTask.index),
          ),
        ),
    ]);
  });

  return new Response(null, { status: 204 });
});
