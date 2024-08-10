import Task from "@/models/task";
import "server-only";
import { getSession } from "./auth";
import { cookies } from "next/headers";

/**
 * Retrieves tasks belonging to the current user.
 *
 * @return {Promise<Array>} An array of tasks belonging to the user.
 */
export async function getTasks(): Promise<Array<any>> {
  const session = await getSession();
  if (!session) {
    return [];
  }

  const sort = cookies().get("sort")?.value;
  let tasks: any[];
  if (sort === "Date") {
    tasks = await Task.find({ user: session.uid })
      .sort({ createdAt: -1 })
      .exec();
  } else if (sort === "Title") {
    tasks = await Task.find({ user: session.uid })
      .sort({ title: 1 })
      .exec();
  } else {
    tasks = await Task.find({ user: session.uid });
  }

  return tasks.map((task) => {
    const taskObject = task.toObject();
    return {
      ...taskObject,
      _id: taskObject._id.toString(),
      user: taskObject.user.toString(),
    };
  });
}
