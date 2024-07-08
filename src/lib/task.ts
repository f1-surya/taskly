import TaskModel from "@/models/task";
import {getSession} from "./auth";
import client from "./mongodb";

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