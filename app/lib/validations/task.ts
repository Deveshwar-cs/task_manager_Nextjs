import {z} from "zod";

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "title is required"),
});

export const updateTaskSchema = z.union([
  z.object({
    completed: z.boolean(),
  }),
  z.object({
    status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
  }),
]);

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
