import { tasks } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";

export const taskInsertSchema = createInsertSchema(tasks);
