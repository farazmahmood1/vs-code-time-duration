import { z } from "zod";

export const announcementCategorySchema = z.enum([
  "holiday",
  "update",
  "urgent",
  "birthday",
  "policy",
]);

export const announcementFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description must be less than 2000 characters"),
  category: announcementCategorySchema,
  departmentId: z.string().optional(),
  publishDate: z.date().optional(),
  expiryType: z.enum(["never", "date"]),
  expiryDate: z.date().optional(),
  expiryTime: z.any().optional(),
  // sendEmail: z.boolean().default(false),
});

export const announcementFilterSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  department: z.string().optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
});

export type AnnouncementFormData = z.infer<typeof announcementFormSchema>;
export type AnnouncementFilterData = z.infer<typeof announcementFilterSchema>;
export type AnnouncementCategory = z.infer<typeof announcementCategorySchema>;
