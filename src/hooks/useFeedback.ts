import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export interface Feedback {
  id: string; userId?: string; category: string; title: string; message: string;
  isAnonymous: boolean; status: string; adminReply?: string; repliedBy?: string; repliedAt?: string;
  createdAt: string; user?: { id: string; name: string; email: string; image?: string };
}

export const useMyFeedback = (params?: { page?: number }) =>
  useQuery({ queryKey: ["my-feedback", params], queryFn: async () => {
    const sp = new URLSearchParams();
    if (params?.page) sp.set("page", String(params.page));
    const { data } = await api.get(`/feedback/my-feedback?${sp.toString()}`);
    return data as { data: Feedback[]; meta: { page: number; total: number; totalPages: number } };
  }});

export const useAllFeedback = (params?: { status?: string; category?: string; page?: number }) =>
  useQuery({ queryKey: ["feedback", params], queryFn: async () => {
    const sp = new URLSearchParams();
    if (params?.status) sp.set("status", params.status);
    if (params?.category) sp.set("category", params.category);
    if (params?.page) sp.set("page", String(params.page));
    const { data } = await api.get(`/feedback?${sp.toString()}`);
    return data as { data: Feedback[]; meta: { page: number; total: number; totalPages: number } };
  }});

export function useSubmitFeedback() {
  const qc = useQueryClient(); const { toast } = useToast();
  return useMutation({
    mutationFn: async (d: { category: string; title: string; message: string; isAnonymous?: boolean }) => { const { data } = await api.post("/feedback", d); return data; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["my-feedback"] }); qc.invalidateQueries({ queryKey: ["feedback"] }); toast({ title: "Feedback submitted" }); },
    onError: (e: any) => { toast({ title: "Error", description: e?.response?.data?.message || "Failed", variant: "destructive" }); },
  });
}

export function useUpdateFeedbackStatus() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: async ({ id, status }: { id: string; status: string }) => { await api.patch(`/feedback/${id}/status`, { status }); }, onSuccess: () => { qc.invalidateQueries({ queryKey: ["feedback"] }); } });
}

export function useReplyToFeedback() {
  const qc = useQueryClient(); const { toast } = useToast();
  return useMutation({ mutationFn: async ({ id, adminReply }: { id: string; adminReply: string }) => { await api.patch(`/feedback/${id}/reply`, { adminReply }); }, onSuccess: () => { qc.invalidateQueries({ queryKey: ["feedback"] }); toast({ title: "Reply sent" }); } });
}
