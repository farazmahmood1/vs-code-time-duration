import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export interface TimesheetEntry {
  id: string;
  date: string;
  projectId: string | null;
  project: { id: string; name: string } | null;
  hours: number;
  description: string | null;
}

export interface TimesheetSubmission {
  id: string;
  userId: string;
  weekStart: string;
  weekEnd: string;
  totalHours: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt: string;
  approvedBy: string | null;
  approvedAt: string | null;
  adminNote: string | null;
  entries: TimesheetEntry[];
  user?: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    departmentId: string | null;
  };
  approver?: { id: string; name: string } | null;
}

export interface TimesheetEntryInput {
  date: string;
  projectId?: string | null;
  hours: number;
  description?: string | null;
}

export function useCurrentWeekData(weekStart: string) {
  return useQuery({
    queryKey: ["timesheet-current-week", weekStart],
    queryFn: async () => {
      const { data } = await api.get(
        `/timesheet-submissions/current-week?weekStart=${weekStart}`
      );
      return data.data as {
        submission?: TimesheetSubmission;
        entries?: { date: string; projectId: string | null; project: { id: string; name: string } | null; hours: number; description: string }[];
        isSubmitted: boolean;
      };
    },
    enabled: !!weekStart,
  });
}

export function useMyTimesheetSubmissions(params?: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  return useQuery({
    queryKey: ["my-timesheet-submissions", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set("page", String(params.page));
      if (params?.limit) searchParams.set("limit", String(params.limit));
      if (params?.status) searchParams.set("status", params.status);
      const { data } = await api.get(
        `/timesheet-submissions/my-submissions?${searchParams.toString()}`
      );
      return data as {
        success: boolean;
        data: TimesheetSubmission[];
        meta: { page: number; limit: number; total: number; totalPages: number };
      };
    },
  });
}

export function useAllTimesheetSubmissions(params?: {
  page?: number;
  limit?: number;
  status?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: ["timesheet-submissions", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set("page", String(params.page));
      if (params?.limit) searchParams.set("limit", String(params.limit));
      if (params?.status) searchParams.set("status", params.status);
      if (params?.userId) searchParams.set("userId", params.userId);
      if (params?.startDate) searchParams.set("startDate", params.startDate);
      if (params?.endDate) searchParams.set("endDate", params.endDate);
      const { data } = await api.get(
        `/timesheet-submissions?${searchParams.toString()}`
      );
      return data as {
        success: boolean;
        data: TimesheetSubmission[];
        meta: { page: number; limit: number; total: number; totalPages: number };
      };
    },
  });
}

export function useTimesheetSubmission(id: string) {
  return useQuery({
    queryKey: ["timesheet-submission", id],
    queryFn: async () => {
      const { data } = await api.get(`/timesheet-submissions/${id}`);
      return data.data as TimesheetSubmission;
    },
    enabled: !!id,
  });
}

export function useSubmitTimesheet() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { weekStart: string; entries: TimesheetEntryInput[] }) => {
      const { data: result } = await api.post("/timesheet-submissions", data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-timesheet-submissions"] });
      queryClient.invalidateQueries({ queryKey: ["timesheet-submissions"] });
      queryClient.invalidateQueries({ queryKey: ["timesheet-current-week"] });
      toast({
        title: "Timesheet Submitted",
        description: "Your weekly timesheet has been submitted for approval.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to submit timesheet",
        variant: "destructive",
      });
    },
  });
}

export function useApproveTimesheetSubmission() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { status: "APPROVED" | "REJECTED"; adminNote?: string } }) => {
      const { data: result } = await api.patch(`/timesheet-submissions/${id}/approve`, data);
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["timesheet-submissions"] });
      queryClient.invalidateQueries({ queryKey: ["timesheet-submission"] });
      toast({
        title: `Timesheet ${variables.data.status === "APPROVED" ? "Approved" : "Rejected"}`,
        description: `The timesheet has been ${variables.data.status.toLowerCase()}.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to process timesheet",
        variant: "destructive",
      });
    },
  });
}
