import { db } from "@/db";
import { boards } from "@/db/schema";
import { auth } from "auth";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function Boards() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  const firstBoard = await db.query.boards.findFirst({
    where: eq(boards.owner, session.user!.id!),
    orderBy: boards.name,
  });

  redirect(`/boards/${firstBoard?.id}`);
}
