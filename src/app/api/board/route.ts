import { db } from "@/db";
import { boards, columns } from "@/db/schema";
import { auth } from "auth";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const GET = auth(async (req) => {
  const user = req.auth?.user;
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }
  const userBoards = await db.query.boards.findMany({
    where: eq(boards.owner, user.id!),
  });

  return NextResponse.json(userBoards);
});

export const POST = auth(async (req) => {
  const user = req.auth?.user;
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const [board] = await db
    .insert(boards)
    .values({
      name: body.name,
      owner: user.id!,
    })
    .returning();

  await db.insert(columns).values([
    { name: "To Do", board: board.id!, index: 0 },
    { name: "In progress", board: board.id!, index: 1 },
    { name: "Done", board: board.id!, index: 2 },
  ]);

  return NextResponse.json(board);
});
