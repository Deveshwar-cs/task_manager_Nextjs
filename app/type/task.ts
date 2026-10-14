export type Task = {
  id: number;
  title: string;
  completed: boolean;
  createdAt?: Date;
  status: KanbanStatus;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export type ApiDataResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export type CreateTaskSuccess = {
  success: true;
  message: string;
  data: Task;
};

export type CreateTaskFailure = {
  success: false;
  message: string;
};

export type CreateTaskResponse = CreateTaskSuccess | CreateTaskFailure;

export type CreateTaskRequest = {
  title: string;
};

export type UpdateTaskRequest = {
  completed: boolean;
};

export type NewTask = Pick<Task, "title">;

export type UpdateTaskData = Partial<Pick<Task, "title" | "completed">>;

export type TaskStatus = "pending" | "completed" | "in-progress";

export const statusLabels: Record<TaskStatus, string> = {
  pending: "Waiting to start",
  completed: "Finished",
  "in-progress": "Currently working",
};

export type KanbanStatus = "TODO" | "IN_PROGRESS" | "DONE";
