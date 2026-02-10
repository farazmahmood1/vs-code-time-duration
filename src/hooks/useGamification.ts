import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  userImage: string | null;
  totalPoints: number;
  badgeCount: number;
}

export interface PointEntry {
  id: string;
  userId: string;
  points: number;
  reason: string;
  category: string;
  earnedAt: string;
}

export interface BadgeInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: string;
  threshold: number;
  createdAt: string;
}

export interface EarnedBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: string;
  earnedAt: string;
}

export const useLeaderboard = (period = "month") =>
  useQuery({
    queryKey: ["gamification-leaderboard", period],
    queryFn: async () => {
      const { data } = await api.get(
        `/gamification/leaderboard?period=${period}`
      );
      return data.data as LeaderboardEntry[];
    },
  });

export const useMyPoints = (page = 1) =>
  useQuery({
    queryKey: ["gamification-my-points", page],
    queryFn: async () => {
      const { data } = await api.get(`/gamification/my-points?page=${page}`);
      return data as {
        data: PointEntry[];
        meta: { page: number; total: number; totalPages: number };
      };
    },
  });

export const useMyBadges = () =>
  useQuery({
    queryKey: ["gamification-my-badges"],
    queryFn: async () => {
      const { data } = await api.get("/gamification/my-badges");
      return data.data as EarnedBadge[];
    },
  });

export const useAllBadges = () =>
  useQuery({
    queryKey: ["gamification-all-badges"],
    queryFn: async () => {
      const { data } = await api.get("/gamification/badges");
      return data.data as BadgeInfo[];
    },
  });

export function useAwardPoints() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (payload: {
      userId: string;
      points: number;
      reason: string;
      category: string;
    }) => {
      const { data } = await api.post("/gamification/award", payload);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["gamification-leaderboard"] });
      qc.invalidateQueries({ queryKey: ["gamification-my-points"] });
      qc.invalidateQueries({ queryKey: ["gamification-my-badges"] });
      toast({
        title: "Points awarded",
        description: "Points have been awarded successfully.",
      });
    },
  });
}
