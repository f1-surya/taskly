import { boards, columns, tasks } from "@/db/schema";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

export const boardUpdateSchema = createUpdateSchema(boards);

export const columnInsertSchema = createInsertSchema(columns);
export const columnBatchUpdateSchema = z.array(
  z.object({
    id: z.number(),
    name: z.string(),
    index: z.number(),
    board: z.number(),
  }),
);

export const taskInsertSchema = createInsertSchema(tasks);
