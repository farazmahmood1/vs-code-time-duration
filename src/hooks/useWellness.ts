import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

export type WellnessChallengeType =
  | "STEPS"
  | "MINDFULNESS"
  | "HYDRATION"
  | "EXERCISE"
  | "CUSTOM";

export interface WellnessChallenge {
  id: string;
  title: string;
  description?: string | null;
  type: WellnessChallengeType;
  startDate: string;
  endDate: string;
  goal: number;
  unit: string;
  createdBy: string;
  creator: { id: string; name: string; image?: string | null };
  isActive: boolean;
  _count: { participants: number };
  participants?: WellnessParticipant[];
  myProgress?: number;
  myCompletedAt?: string | null;
  joinedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WellnessParticipant {
  id: string;
  challengeId: string;
  userId: string;
  user: { id: string; name: string; image?: string | null };
  progress: number;
  completedAt?: string | null;
  joinedAt: string;
}

export interface CreateChallengeData {
  title: string;
  description?: string;
  type: WellnessChallengeType;
  startDate: string;
  endDate: string;
  goal: number;
  unit: string;
}

export const useWellnessChallenges = (status?: string) =>
  useQuery({
    queryKey: ["wellness-challenges", status],
    queryFn: async () => {
      const params = status ? `?status=${status}` : "";
      const { data } = await api.get(`/wellness${params}`);
      return data.data as WellnessChallenge[];
    },
  });

export const useActiveWellnessChallenges = () =>
  useQuery({
    queryKey: ["wellness-challenges", "active"],
    queryFn: async () => {
      const { data } = await api.get("/wellness/active");
      return data.data as WellnessChallenge[];
    },
  });

export const useMyChallenges = () =>
  useQuery({
    queryKey: ["wellness-challenges", "my"],
    queryFn: async () => {
      const { data } = await api.get("/wellness/my");
      return data.data as WellnessChallenge[];
    },
  });

export const useWellnessChallenge = (id: string) =>
  useQuery({
    queryKey: ["wellness-challenge", id],
    queryFn: async () => {
      const { data } = await api.get(`/wellness/${id}`);
      return data.data as WellnessChallenge;
    },
    enabled: !!id,
  });

export const useWellnessLeaderboard = (id: string) =>
  useQuery({
    queryKey: ["wellness-leaderboard", id],
    queryFn: async () => {
      const { data } = await api.get(`/wellness/${id}/leaderboard`);
      return data.data as WellnessParticipant[];
    },
    enabled: !!id,
  });

export function useCreateChallenge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (d: CreateChallengeData) => {
      const { data } = await api.post("/wellness", d);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wellness-challenges"] });
      toast.success("Challenge created successfully");
    },
    onError: () => {
      toast.error("Failed to create challenge");
    },
  });
}

export function useUpdateChallenge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: Partial<CreateChallengeData> & { id: string; isActive?: boolean }) => {
      const { data } = await api.put(`/wellness/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wellness-challenges"] });
      toast.success("Challenge updated");
    },
    onError: () => {
      toast.error("Failed to update challenge");
    },
  });
}

export function useDeleteChallenge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/wellness/${id}`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wellness-challenges"] });
      toast.success("Challenge deleted");
    },
    onError: () => {
      toast.error("Failed to delete challenge");
    },
  });
}

export function useJoinChallenge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(`/wellness/${id}/join`);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wellness-challenges"] });
      toast.success("Joined challenge!");
    },
    onError: () => {
      toast.error("Failed to join challenge");
    },
  });
}

export function useUpdateProgress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      progress,
    }: {
      id: string;
      progress: number;
    }) => {
      const { data } = await api.patch(`/wellness/${id}/progress`, {
        progress,
      });
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wellness-challenges"] });
      qc.invalidateQueries({ queryKey: ["wellness-leaderboard"] });
      qc.invalidateQueries({ queryKey: ["wellness-challenge"] });
      toast.success("Progress updated!");
    },
    onError: () => {
      toast.error("Failed to update progress");
    },
  });
}
