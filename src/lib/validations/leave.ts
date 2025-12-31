import { z } from "zod";
import { LEAVE_TYPES, LEAVE_STATUSES } from "@/lib/constants";

export const leaveTypes = LEAVE_TYPES;

export const leaveStatuses = LEAVE_STATUSES;

export const leaveFormSchema = z.object({
  leaveType: z.enum(leaveTypes, {
    message: "Please select a leave type",
  }),

  startDate: z.coerce.date(),
  endDate: z.coerce.date(),

  reason: z
    .string({
      message: "Please provide a reason for the leave",
    })
    .min(10, {
      message: "Reason must be at least 10 characters long",
    })
    .max(500, {
      message: "Reason must be at most 500 characters long",
    }),

  prescriptionUrl: z.string().optional(),
});

export const leaveFiltersSchema = z.object({
  search: z.string(),
  leaveType: z.enum([...leaveTypes, "All"]),
  status: z.enum([...leaveStatuses, "All"]),
  department: z.string(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export type LeaveFormData = z.infer<typeof leaveFormSchema>;
export type LeaveFiltersData = z.infer<typeof leaveFiltersSchema>;
export type LeaveType = (typeof leaveTypes)[number];
export type LeaveStatus = (typeof leaveStatuses)[number];
