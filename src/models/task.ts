interface TaskModel {
  title: string;
  description?: string;
  completed: boolean;
  _id: string;
  dueDate?: Date;
  createdAt: Date;
}

export default TaskModel;