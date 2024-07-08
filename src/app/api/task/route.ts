import { getSession } from "@/lib/auth";
import client from "@/lib/mongodb";
import {ObjectId} from "mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const session = await getSession();
    if (!session) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }
    const task = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: session.uid,
    };
    const db = (await client.connect()).db("taskManager");
    await db.collection("tasks").insertOne(task);
    return Response.json(task, { status: 201 });
  } catch (error) {
    console.log(error);
    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const session = await getSession();
    if (!session) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }
    const task = {
      ...body,
      updatedAt: new Date(),
    };
    const id = task._id;
    delete task._id;
    const db = (await client.connect()).db("taskManager");

    await db.collection("tasks").findOneAndUpdate({ _id: new ObjectId(id) }, { $set: task });
    return Response.json(task, { status: 201 });
  } catch (e) {
    console.error(e);
    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
}
