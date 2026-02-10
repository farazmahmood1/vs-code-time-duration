import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export interface ScheduleEntry {
  id: string;
  employeeId: string;
  employee: { id: string; name: string; email: string; image?: string; departmentId?: string };
  shiftId: string;
  shift: { id: string; name: string; startTime: string; endTime: string };
  date: string;
  startTime: string;
  endTime: string;
  createdAt: string;
}

export interface ShiftConflict {
  entryId: string;
  conflictingEntryId: string;
  type: "OVERLAP" | "REST_PERIOD_VIOLATION";
  reason: string;
}

export interface ShiftSettings {
  id: string;
  minRestPeriodHours: number;
  maxShiftHours: number;
}

// Schedule
export const useShiftSchedule = (weekStart: string, departmentId?: string) =>
  useQuery({
    queryKey: ["shift-schedule", weekStart, departmentId],
    queryFn: async () => {
      const params = new URLSearchParams({ weekStart });
      if (departmentId) params.set("departmentId", departmentId);
      const { data } = await api.get(`/shifts/schedule?${params.toString()}`);
      return data.data as ScheduleEntry[];
    },
    enabled: !!weekStart,
  });

export function useCreateScheduleEntry() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (entry: { employeeId: string; shiftId: string; date: string; startTime: string; endTime: string }) => {
      const { data } = await api.post("/shifts/schedule", entry);
      return data.data as ScheduleEntry;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["shift-schedule"] });
      toast({ title: "Schedule entry created" });
    },
  });
}

export function useMoveScheduleEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string; date?: string; employeeId?: string }) => {
      const { data: res } = await api.put(`/shifts/schedule/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["shift-schedule"] });
    },
  });
}

export function useDeleteScheduleEntry() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/shifts/schedule/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["shift-schedule"] });
      toast({ title: "Schedule entry removed" });
    },
  });
}

// Conflicts
export const useShiftConflicts = (weekStart: string) =>
  useQuery({
    queryKey: ["shift-conflicts", weekStart],
    queryFn: async () => {
      const { data } = await api.get(`/shifts/schedule/conflicts?weekStart=${weekStart}`);
      return data.data as ShiftConflict[];
    },
    enabled: !!weekStart,
  });

// Settings
export const useShiftSettings = () =>
  useQuery({
    queryKey: ["shift-settings"],
    queryFn: async () => {
      const { data } = await api.get("/shifts/settings");
      return data.data as ShiftSettings;
    },
  });

export function useUpdateShiftSettings() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (settings: Partial<ShiftSettings>) => {
      const { data } = await api.put("/shifts/settings", settings);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["shift-settings"] });
      toast({ title: "Shift settings updated" });
    },
  });
}
