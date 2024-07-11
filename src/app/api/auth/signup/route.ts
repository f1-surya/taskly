import {login} from "@/lib/auth";
import client from "@/lib/mongodb";
import {randomBytes, scryptSync} from "crypto";

/**
 * Handles the POST request to create a new user account.
 *
 * @param {Request} req - The request object containing user data.
 * @return {Response} A response object indicating success or failure of the user creation.
 */
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

    // const data = await login(formData);
    // if (!data) {
      // return new Response(JSON.stringify({ message: "Something went wrong" }), {
        // status: 500,
      // });
    // }
    return new Response(JSON.stringify({}), {
      status: 201,
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Something went wrong" }), {
      status: 500,
    });
  }
}
