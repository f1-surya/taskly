import { getSession } from "@/lib/auth";
import Task from "@/models/task";

/**
 * Handles the POST request for creating a new task.
 *
 * @param {Request} req - The request object.
 * @return {Promise<Response>} The response object.
 */
export async function POST(req: Request): Promise<Response> {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const task = await Task.create({ ...body, user: session.uid });
    return Response.json(task, { status: 201 });
  } catch (error) {
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
    const session = await getSession();
    if (!session) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }
    const body = await req.json();
    console.log(body);
    
    const task = await Task.findByIdAndUpdate(body._id, body, { new: true });
    return Response.json(task, { status: 201 });
  } catch (e) {
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
    await Task.findByIdAndDelete(_id);
    return Response.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
}
