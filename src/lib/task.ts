import {getSession} from "./auth";
import client from "./mongodb";

/**
 * Retrieves tasks belonging to the current user.
 *
 * @return {Promise<Array>} An array of tasks belonging to the user.
 */
export async function getTasks() {
  const session = await getSession();
  if (!session) {
    return [];
  }
  const db = (await client.connect()).db('taskManager');
  const tasks = await db
    .collection('tasks')
    .find({ user: session.uid })
    .toArray();
  return tasks;
}