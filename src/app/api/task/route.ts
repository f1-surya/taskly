import { getSession } from "@/lib/auth";

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
    return Response.json({}, { status: 201 });
  } catch (error) {
    console.error(error);
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
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const cleanBody = Object.fromEntries(
      Object.entries(body).filter(([_, v]) => v != null),
    );
    delete cleanBody.createdAt;
    delete cleanBody.updatedAt;
    delete cleanBody.id;
    delete cleanBody.userId;
    const task = {};
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
export async function DELETE(req: Request): Promise<Response> {
  try {
    const { id } = await req.json();
    const session = await getSession();
    if (!session) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }
    return Response.json(
      { message: "Task deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
}
