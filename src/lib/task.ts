import Task from "@/models/task";
import "server-only";
import { getSession } from "./auth";

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
  const tasks = await Task.find({ user: session.uid });
  return tasks.map((task) => {
    const taskObject = task.toObject();
    return {
      ...taskObject,
      _id: taskObject._id.toString(),
      user: taskObject.user.toString(),
    };
  });
}
