import { login } from "@/auth";

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
