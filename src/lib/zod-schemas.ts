import { boards, tasks } from "@/db/schema";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";

export const boardUpdateSchema = createUpdateSchema(boards);

export const taskInsertSchema = createInsertSchema(tasks);
