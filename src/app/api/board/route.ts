import { db } from "@/db";
import { boards, columns } from "@/db/schema";
import { boardUpdateSchema } from "@/lib/zod-schemas";
import { auth } from "auth";
import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const GET = auth(async (req) => {
  const user = req.auth?.user;
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const userBoards = await db.query.boards.findMany({
    where: eq(boards.owner, user.id!),
    orderBy: asc(boards.name),
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

export const PUT = auth(async (req) => {
  const user = req.auth?.user;
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parseResult = boardUpdateSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  const currBoard = await db.query.boards.findFirst({
    where: eq(boards.id, parseInt(id)),
  });

  if (!currBoard) {
    return NextResponse.json({ message: "Board not found" }, { status: 404 });
  }

  if (currBoard.owner !== user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await db
    .update(boards)
    .set(parseResult.data)
    .where(eq(boards.id, parseInt(id)));

  return NextResponse.json({ message: "Board updated successfully" });
});
