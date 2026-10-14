export type Task = {
  id: number;
  title: string;
  completed: boolean;
  createdAt?: Date;
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
