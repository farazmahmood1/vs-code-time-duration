import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "sonner";

interface TimerSession {
  id: string;
  userId: string;
  startTime: string;
  endTime: string | null;
  isActive: boolean;
  isPaused: boolean;
  totalDuration: number | null;
  projectId: string | null;
}

interface ActiveSessionResponse {
  timer: TimerSession | null;
  elapsed: {
    elapsedSeconds: number;
    isPaused: boolean;
    totalPauseSeconds: number;
  } | null;
  timesheet: {
    totalHours: number;
    checkInTime: string | null;
    checkOutTime: string | null;
  } | null;
  message: string;
}

export const useActiveSession = () => {
  return useQuery<ActiveSessionResponse>({
    queryKey: ["timer", "active"],
    queryFn: async () => {
      const { data } = await api.get("/timer/active");
      return data;
    },
    refetchInterval: 60000, // Refetch every minute for elapsed time updates
  });
};

export const useCheckIn = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (projectId?: string) => {
      const { data } = await api.post("/timer/checkin", { projectId });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["timer"] });
      qc.invalidateQueries({ queryKey: ["employeeDashboardStats"] });
      toast.success("Checked in successfully!");
    },
  });
};

export const useCheckOut = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/timer/checkout");
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["timer"] });
      qc.invalidateQueries({ queryKey: ["employeeDashboardStats"] });
      toast.success("Checked out successfully!");
    },
  });
};

export const usePauseTimer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/timer/pause");
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["timer"] });
      toast.success("Timer paused");
    },
    // Global interceptor handles error toasts
  });
};

export const useResumeTimer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/timer/resume");
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["timer"] });
      toast.success("Timer resumed");
    },
    // Global interceptor handles error toasts
  });
};

export const useMyAttendanceHistory = (params?: { limit?: number; offset?: number }) => {
  return useQuery({
    queryKey: ["timer", "timesheets", params],
    queryFn: async () => {
      const { data } = await api.get("/timer/timesheets", { params });
      return data;
    },
  });
};
