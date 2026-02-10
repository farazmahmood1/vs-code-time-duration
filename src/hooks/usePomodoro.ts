import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export interface PomodoroSession {
  id: string;
  userId: string;
  taskDescription?: string;
  focusDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  totalRounds: number;
  completedRounds: number;
  totalFocusMinutes: number;
  status: "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  startedAt: string;
  endedAt?: string;
  createdAt: string;
}

export interface PomodoroStats {
  totalFocusMinutes: number;
  sessionsCompleted: number;
  currentStreak: number;
}

export interface PomodoroSettings {
  focusDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  roundsBeforeLongBreak: number;
}

export const usePomodoroHistory = (page = 1) =>
  useQuery({
    queryKey: ["pomodoro-history", page],
    queryFn: async () => {
      const { data } = await api.get(`/pomodoro/history?page=${page}`);
      return data as {
        data: PomodoroSession[];
        meta: { page: number; total: number; totalPages: number };
      };
    },
  });

export const usePomodoroStats = () =>
  useQuery({
    queryKey: ["pomodoro-stats"],
    queryFn: async () => {
      const { data } = await api.get("/pomodoro/stats");
      return data.data as PomodoroStats;
    },
  });

export const usePomodoroSettings = () =>
  useQuery({
    queryKey: ["pomodoro-settings"],
    queryFn: async () => {
      const { data } = await api.get("/pomodoro/settings");
      return data.data as PomodoroSettings;
    },
  });

export function useSavePomodoroSession() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (session: Partial<PomodoroSession>) => {
      const { data } = await api.post("/pomodoro/sessions", session);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pomodoro-history"] });
      qc.invalidateQueries({ queryKey: ["pomodoro-stats"] });
      toast({
        title: "Session saved",
        description: "Your focus session has been recorded.",
      });
    },
  });
}

export function useUpdatePomodoroSettings() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (settings: Partial<PomodoroSettings>) => {
      const { data } = await api.put("/pomodoro/settings", settings);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pomodoro-settings"] });
      toast({ title: "Settings updated" });
    },
  });
}
