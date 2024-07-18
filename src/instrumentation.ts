import { connect } from "mongoose";

export async function register() {
  const uri = process.env.MONGO_URL ?? "mongodb://localhost:27017";
  await connect(`${uri}/taskManager`);
}
