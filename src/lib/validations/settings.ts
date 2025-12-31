import { z } from "zod";

export const importantLinkSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  url: z
    .string()
    .min(1, "URL is required")
    .refine(
      (url) => {
        // Simple regex that accepts domains with or without protocol
        const urlRegex =
          /^(https?:\/\/)?([\da-z.-]+)\.([\da-z.-]{2,6})(\/[\w .-]*)*\/?$/i;
        return urlRegex.test(url);
      },
      {
        message:
          "Please enter a valid URL (e.g., example.com or https://example.com)",
      }
    ),
});

export const termsConditionSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  content: z
    .string()
    .min(1, "Content is required")
    .max(10000, "Content must be less than 10000 characters"),
});

export type ImportantLinkFormData = z.infer<typeof importantLinkSchema>;
export type TermsConditionFormData = z.infer<typeof termsConditionSchema>;
