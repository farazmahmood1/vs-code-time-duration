import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export interface MoodEntry {
  id: string;
  userId: string;
  mood: number;
  note?: string;
  date: string;
  createdAt: string;
  user?: { id: string; name: string; image?: string };
}

export interface TeamMoodData {
  entries: MoodEntry[];
  avgMood: number;
  total: number;
}

export interface MoodAnalytics {
  trend: { date: string; avgMood: number; responses: number }[];
  distribution: number[];
  totalEntries: number;
}

export const useMyMoods = (page = 1) =>
  useQuery({
    queryKey: ["my-moods", page],
    queryFn: async () => {
      const { data } = await api.get(`/mood/my?page=${page}`);
      return data as {
        data: MoodEntry[];
        meta: { page: number; total: number; totalPages: number };
      };
    },
  });

export const useTeamMoods = (date?: string) =>
  useQuery({
    queryKey: ["team-moods", date],
    queryFn: async () => {
      const params = date ? `?date=${date}` : "";
      const { data } = await api.get(`/mood/team${params}`);
      return data.data as TeamMoodData;
    },
  });

export const useMoodAnalytics = (days = 30) =>
  useQuery({
    queryKey: ["mood-analytics", days],
    queryFn: async () => {
      const { data } = await api.get(`/mood/analytics?days=${days}`);
      return data.data as MoodAnalytics;
    },
  });

export function useSubmitMood() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (entry: { mood: number; note?: string }) => {
      const { data } = await api.post("/mood", entry);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-moods"] });
      qc.invalidateQueries({ queryKey: ["team-moods"] });
      qc.invalidateQueries({ queryKey: ["mood-analytics"] });
      toast({
        title: "Mood recorded",
        description: "Thanks for checking in!",
      });
    },
  });
}
