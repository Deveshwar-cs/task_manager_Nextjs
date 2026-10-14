export type Task = {
  id: number;
  title: string;
  completed: boolean;
  createdAt?: Date;
};

export type apiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export type apiDataResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};
