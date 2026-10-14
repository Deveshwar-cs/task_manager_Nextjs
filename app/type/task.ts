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

export type CreateTask