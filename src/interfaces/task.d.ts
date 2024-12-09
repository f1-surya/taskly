export interface ITask {
  title: string;
  description?: string;
  completed: boolean;
  id?: string;
  dueDate?: Date;
  priority: string;
  user?: Schema.Types.ObjectId;
  createdAt: Date;
}