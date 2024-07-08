import client from "@/mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const task = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const db = (await client.connect()).db("taskManager");
    await db.collection("tasks").insertOne(task);
    return Response.json(task, { status: 201 });
  } catch (error) {
    console.log(error);
    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
}
