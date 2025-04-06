import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import postgres from "postgres";

const client = postgres(process.env.DATABASE_URL!, { prepare: false, max: 1 });
export const db = drizzle({ schema, client });
