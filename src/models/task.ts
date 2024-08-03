import { ITask } from "@/interfaces/task";
import mongoose, { model, Schema } from "mongoose";
import "server-only";

const schema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: String,
    completed: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    dueDate: Date,
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "None"],
      default: "None",
    },
  },
  { timestamps: true }
);

const Task = mongoose.models.Task ?? model("Task", schema);

export default Task;
