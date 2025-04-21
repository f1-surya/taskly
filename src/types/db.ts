import { boards, columns, tasks } from "@/db/schema";
import { type InferSelectModel } from "drizzle-orm";

export type Board = InferSelectModel<typeof boards>;
export type Column = InferSelectModel<typeof columns>;
export type Task = InferSelectModel<typeof tasks>;

export type ColumnWithTasks = Column & {
  tasks: Task[];
};
