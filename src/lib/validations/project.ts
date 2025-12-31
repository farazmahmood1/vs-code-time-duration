import { z } from "zod";

export const projectFormSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(100, "Project name must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters"),
  departmentId: z.string().min(1, "Department is required"),
  status: z.enum(["ACTIVE", "INACTIVE", "COMPLETED"]),
  memberIds: z.array(z.string()).optional(),
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;
