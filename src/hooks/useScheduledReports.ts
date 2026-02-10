import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export interface ScheduledReport {
  id: string;
  name: string;
  reportType: "ATTENDANCE" | "OVERTIME" | "LEAVE" | "PRODUCTIVITY" | "COST";
  frequency: "DAILY" | "WEEKLY" | "MONTHLY";
  recipients: string[];
  filters?: string | null;
  lastSentAt?: string | null;
  nextSendAt?: string | null;
  isActive: boolean;
  createdBy: string;
  creator?: { id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface CreateScheduledReportData {
  name: string;
  reportType: ScheduledReport["reportType"];
  frequency: ScheduledReport["frequency"];
  recipients: string[];
  filters?: string;
  isActive?: boolean;
}

export const useScheduledReports = (page?: number) =>
  useQuery({
    queryKey: ["scheduled-reports", { page }],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (page) sp.set("page", String(page));
      const { data } = await api.get(`/scheduled-reports?${sp.toString()}`);
      return data as {
        data: ScheduledReport[];
        meta: { page: number; total: number; totalPages: number };
      };
    },
  });

export const useScheduledReport = (id: string) =>
  useQuery({
    queryKey: ["scheduled-reports", id],
    queryFn: async () => {
      const { data } = await api.get(`/scheduled-reports/${id}`);
      return data.data as ScheduledReport;
    },
    enabled: !!id,
  });

export function useCreateScheduledReport() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (d: CreateScheduledReportData) => {
      const { data } = await api.post("/scheduled-reports", d);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["scheduled-reports"] });
      toast({ title: "Scheduled report created" });
    },
    onError: (e: any) => {
      toast({
        title: "Error",
        description: e?.response?.data?.message || "Failed to create scheduled report",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateScheduledReport() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({
      id,
      data: d,
    }: {
      id: string;
      data: Partial<CreateScheduledReportData>;
    }) => {
      const { data } = await api.put(`/scheduled-reports/${id}`, d);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["scheduled-reports"] });
      toast({ title: "Scheduled report updated" });
    },
    onError: (e: any) => {
      toast({
        title: "Error",
        description: e?.response?.data?.message || "Failed to update scheduled report",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteScheduledReport() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/scheduled-reports/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["scheduled-reports"] });
      toast({ title: "Scheduled report deleted" });
    },
    onError: (e: any) => {
      toast({
        title: "Error",
        description: e?.response?.data?.message || "Failed to delete scheduled report",
        variant: "destructive",
      });
    },
  });
}

export function useToggleScheduledReport() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch(`/scheduled-reports/${id}/toggle`);
      return data;
    },
    onSuccess: (_data: any) => {
      qc.invalidateQueries({ queryKey: ["scheduled-reports"] });
      toast({ title: "Schedule status toggled" });
    },
    onError: (e: any) => {
      toast({
        title: "Error",
        description: e?.response?.data?.message || "Failed to toggle scheduled report",
        variant: "destructive",
      });
    },
  });
}
