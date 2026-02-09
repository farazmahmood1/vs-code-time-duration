import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export interface StandupReport {
  id: string; userId: string; date: string; yesterday: string; today: string; blockers?: string;
  user?: { id: string; name: string; email: string; image?: string; departmentId?: string };
}

export const useMyStandups = (params?: { page?: number }) =>
  useQuery({ queryKey: ["my-standups", params], queryFn: async () => {
    const sp = new URLSearchParams();
    if (params?.page) sp.set("page", String(params.page));
    const { data } = await api.get(`/standups/my-standups?${sp.toString()}`);
    return data as { data: StandupReport[]; meta: { page: number; total: number; totalPages: number } };
  }});

export const useTodayStandup = () => useQuery({ queryKey: ["today-standup"], queryFn: async () => { const { data } = await api.get("/standups/today"); return data.data as StandupReport | null; }});

export const useAllStandups = (params?: { date?: string; departmentId?: string; page?: number }) =>
  useQuery({ queryKey: ["standups", params], queryFn: async () => {
    const sp = new URLSearchParams();
    if (params?.date) sp.set("date", params.date);
    if (params?.departmentId) sp.set("departmentId", params.departmentId);
    if (params?.page) sp.set("page", String(params.page));
    const { data } = await api.get(`/standups?${sp.toString()}`);
    return data as { data: StandupReport[]; meta: { page: number; total: number; totalPages: number } };
  }});

export const useMissingStandups = () => useQuery({ queryKey: ["missing-standups"], queryFn: async () => { const { data } = await api.get("/standups/missing"); return data.data as { id: string; name: string; email: string; image?: string }[]; }});

export function useSubmitStandup() {
  const qc = useQueryClient(); const { toast } = useToast();
  return useMutation({
    mutationFn: async (d: { date: string; yesterday: string; today: string; blockers?: string }) => { const { data } = await api.post("/standups", d); return data; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["my-standups"] }); qc.invalidateQueries({ queryKey: ["today-standup"] }); qc.invalidateQueries({ queryKey: ["standups"] }); toast({ title: "Standup submitted" }); },
    onError: (e: any) => { toast({ title: "Error", description: e?.response?.data?.message || "Failed to submit standup", variant: "destructive" }); },
  });
}
