import { z } from "zod";

export const roles = ["admin", "employee"] as const;

export const employeeFormSchema = z.object({
  name: z
    .string({
      message: "Name is required",
    })
    .min(2, {
      message: "Name must be at least 2 characters long",
    })
    .max(100),
  email: z
    .string({
      message: "Email is required",
    })
    .email({
      message: "Please enter a valid email address",
    }),
  departmentId: z.string({
    message: "Please select a department",
  }),
});

export type EmployeeFormData = z.infer<typeof employeeFormSchema>;
