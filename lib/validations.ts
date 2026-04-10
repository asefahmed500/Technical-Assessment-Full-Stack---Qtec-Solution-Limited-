import { z } from "zod"

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  dueDate: z
    .string()
    .datetime({ message: "Invalid date" })
    .optional()
    .nullable(),
})

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional().nullable(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  dueDate: z.string().datetime().optional().nullable(),
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>

export const taskFilterSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "dueDate"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
})

export type TaskFilterInput = z.infer<typeof taskFilterSchema>
