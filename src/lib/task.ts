import { cookies } from "next/headers";
import "server-only";
import { SessionPayload } from "./auth";
import prisma from "./db";

/**
 * Retrieves tasks belonging to the current user.
 *
 * @return {Promise<Array>} An array of tasks belonging to the user.
 */
export async function getTasks(session: SessionPayload): Promise<Array<any>> {
  const cookieJar = await cookies();
  const sort = cookieJar.get("sort")?.value;
  const tasks = await prisma.tasks.findMany({
    where: {
      userId: session.uid,
    },
    orderBy: [
      sort === "Date" ? { createdAt: "desc" } : {},
      sort === "Title" ? { title: "asc" } : {},
    ],
  });
  return tasks;
}
