interface TaskModel {
  title: string;
  description?: string;
  completed: boolean;
  id: string;
  dueDate?: Date;
  createdAt: Date;
}

export default TaskModel;