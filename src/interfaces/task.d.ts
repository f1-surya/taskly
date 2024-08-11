import {Schema} from "mongoose";

export interface ITask {
  title: string;
  description?: string;
  completed: boolean;
  _id?: string;
  dueDate?: Date;
  priority: string;
  user?: Schema.Types.ObjectId;
  createdAt: Date;
}