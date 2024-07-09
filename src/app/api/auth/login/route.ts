import { login } from "@/lib/auth";

/**
 * Handles the POST request for user login.
 *
 * @param {Request} request - The incoming request object.
 * @return {Promise<Response>} A promise that resolves to the response object.
 * The response object contains either the user data or an error message.
 * If the user data is not found, a 404 status code is returned with a "User not found" message.
 * If an error occurs, a 500 status code is returned with a "Something went wrong" message.
 */
export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const userData = await login(form);
    if (!userData) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    return Response.json(userData, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
}
