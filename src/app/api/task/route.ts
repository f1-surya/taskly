import { db } from "@/db";
import { boards, columns, tasks } from "@/db/schema";
import { auth } from "auth";
import { NextResponse } from "next/server";
import "server-only";
import { taskInsertSchema } from "@/lib/zod-schemas";
import { eq } from "drizzle-orm";

export const POST = auth(async (req) => {
  const user = req.auth?.user;
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const parseResult = taskInsertSchema.safeParse(body);
  if (!parseResult.success) {
    return new Response(
      JSON.stringify({ message: parseResult.error.message }),
      {
        status: 400,
      },
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
