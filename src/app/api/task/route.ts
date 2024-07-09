import { getSession } from "@/lib/auth";
import client from "@/lib/mongodb";
import { ObjectId } from "mongodb";

/**
 * Handles the POST request for creating a new task.
 *
 * @param {Request} req - The request object.
 * @return {Promise<Response>} The response object.
 */
export async function POST(req: Request): Promise<Response> {
  try {
    // Extract the request body
    const body = await req.json();

    // Get the session information
    const session = await getSession();

    // If the session is not found, return a 404 response
    if (!session) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    // Create the task object with additional properties
    const task = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: session.uid,
    };

    // Connect to the database and insert the task
    const db = (await client.connect()).db("taskManager");
    await db.collection("tasks").insertOne(task);

    // Return a 201 response with the created task
    return Response.json(task, { status: 201 });
  } catch (error) {
    // If an error occurs, log it and return a 500 response
    console.log(error);
    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
}

/**
 * Handles the PUT request for updating an existing task.
 *
 * @param {Request} req - The request object.
 * @return {Promise<Response>} The response object.
 */
export async function PUT(req: Request): Promise<Response> {
  try {
    // Extract the request body
    const body = await req.json();

    // Get the session information
    const session = await getSession();

    // If the session is not found, return a 404 response
    if (!session) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    // Create a new task object with updated properties
    const task = {
      ...body,
      updatedAt: new Date(), // Update the updatedAt property
    };

    // Extract the task ID from the body and delete it from the task object
    const id = task._id;
    delete task._id;

    // Connect to the database and update the task
    const db = (await client.connect()).db("taskManager");
    await db
      .collection("tasks")
      .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: task });

    // Return a 201 response with the updated task
    return Response.json(task, { status: 201 });
  } catch (e) {
    // If an error occurs, log it and return a 500 response
    console.error(e);
    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
}

/**
 * Handles the DELETE request for deleting a task.
 *
 * @param {Request} req - The request object.
 * @return {Promise<Response>} The response object.
 */
export async function DELETE(req: Request) {
  try {
    const { _id } = await req.json();
    const session = await getSession();
    if (!session) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }
    const db = (await client.connect()).db("taskManager");
    await db.collection("tasks").deleteOne({ _id: new ObjectId(_id) });
    return Response.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
}
