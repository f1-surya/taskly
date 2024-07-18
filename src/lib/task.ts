import Task from "@/models/task";
import {getSession} from "./auth";
import User from "@/models/user";

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
  return tasks;
}