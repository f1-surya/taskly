import mongoose, { model, Schema } from "mongoose";

export interface ITask {
  title: string;
  description?: string;
  completed: boolean;
  _id?: string;
  dueDate?: Date;
  user?: Schema.Types.ObjectId;
  createdAt: Date;
}

const schema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: String,
    completed: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Task = mongoose.models.Task ?? model("Task", schema);

export default Task;
