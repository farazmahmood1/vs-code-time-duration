import { z } from "zod";

export const reportIssueSchema = z.object({
  category: z.string().nonempty("Category required"),
  subject: z.string().nonempty("Subject required"),
  description: z.string().nonempty("Description required"),
});

export type ReportIssueType = z.infer<typeof reportIssueSchema>;

// GitHub URL validation - should be in format: https://github.com/username
export const githubUrlSchema = z
  .string()
  .optional()
  .refine((url) => {
    if (!url) return true; // Optional field
    return /^https:\/\/github\.com\/[a-zA-Z0-9-]+\/?$/.test(url);
  }, "Please enter a valid GitHub URL (e.g., https://github.com/username)");

// LinkedIn URL validation - should be in format: https://linkedin.com/in/username or https://www.linkedin.com/in/username
export const linkedinUrlSchema = z
  .string()
  .optional()
  .refine((url) => {
    if (!url) return true; // Optional field
    return /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/.test(url);
  }, "Please enter a valid LinkedIn URL (e.g., https://linkedin.com/in/username)");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[!@#$%^&*]/,
    "Password must contain at least one special character (!@#$%^&*)"
  );

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormType = z.infer<typeof changePasswordSchema>;
