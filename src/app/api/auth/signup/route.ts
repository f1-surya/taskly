import {login} from "@/auth";
import client from "@/mongodb";
import {randomBytes, scryptSync} from "crypto";

export async function POST(req: Request) {
  try {
    const mongoClient = await client.connect();
    const db = mongoClient.db("taskManager");
    const formData = await req.formData();
    const oldUser = await db
      .collection("users")
      .findOne({ email: formData.get("email") });
    if (oldUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 409,
      });
    }

    const salt = randomBytes(16).toString("hex");
    const hashedPassword = scryptSync(
      formData.get("password")!.toString(),
      salt,
      64
    ).toString("hex");

    await db.collection("users").insertOne({
      email: formData.get("email"),
      name: formData.get("fullname"),
      password: `${hashedPassword}:${salt}`,
      createdAt: new Date(),
    });

    const data = await login(formData);
    if (!data) {
      return new Response(JSON.stringify({ message: "Something went wrong" }), {
        status: 500,
      });
    }
    return new Response(JSON.stringify(data), {
      status: 201,
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Something went wrong" }), {
      status: 500,
    });
  }
}
