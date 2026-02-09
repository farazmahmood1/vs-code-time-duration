import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export interface ReviewCycle {
  id: string; name: string; startDate: string; endDate: string;
  status: "DRAFT" | "ACTIVE" | "COMPLETED";
  reviews: { id: string; status: string }[];
}

export interface ReviewGoal {
  id: string; title: string; description?: string; rating?: number; weight: number;
}

export interface Review {
  id: string; cycleId: string; employeeId: string; reviewerId: string;
  overallRating?: number; strengths?: string; improvements?: string; comments?: string;
  status: "PENDING" | "IN_PROGRESS" | "SUBMITTED" | "ACKNOWLEDGED";
  submittedAt?: string; goals: ReviewGoal[];
  cycle?: ReviewCycle;
  employee?: { id: string; name: string; email: string; image?: string };
  reviewer?: { id: string; name: string };
}

export const useReviewCycles = () => useQuery({ queryKey: ["review-cycles"], queryFn: async () => { const { data } = await api.get("/reviews/cycles"); return data.data as ReviewCycle[]; } });
export const useMyReviews = () => useQuery({ queryKey: ["my-reviews"], queryFn: async () => { const { data } = await api.get("/reviews/my-reviews"); return data.data as Review[]; } });
export const useReviewsToReview = () => useQuery({ queryKey: ["reviews-to-review"], queryFn: async () => { const { data } = await api.get("/reviews/to-review"); return data.data as Review[]; } });
export const useReview = (id: string) => useQuery({ queryKey: ["review", id], queryFn: async () => { const { data } = await api.get(`/reviews/${id}`); return data.data as Review; }, enabled: !!id });

export function useCreateCycle() {
  const qc = useQueryClient(); const { toast } = useToast();
  return useMutation({ mutationFn: async (d: { name: string; startDate: string; endDate: string }) => { const { data } = await api.post("/reviews/cycles", d); return data; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["review-cycles"] }); toast({ title: "Cycle created" }); } });
}
export function useActivateCycle() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: async (id: string) => { await api.patch(`/reviews/cycles/${id}/activate`); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["review-cycles"] }); } });
}
export function useCompleteCycle() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: async (id: string) => { await api.patch(`/reviews/cycles/${id}/complete`); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["review-cycles"] }); } });
}
export function useCreateReview() {
  const qc = useQueryClient(); const { toast } = useToast();
  return useMutation({ mutationFn: async (d: { cycleId: string; employeeId: string; reviewerId: string; goals?: { title: string; description?: string; weight?: number }[] }) => { const { data } = await api.post("/reviews", d); return data; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["review-cycles"] }); toast({ title: "Review created" }); } });
}
export function useSubmitReview() {
  const qc = useQueryClient(); const { toast } = useToast();
  return useMutation({ mutationFn: async ({ id, data: d }: { id: string; data: { overallRating?: number; strengths?: string; improvements?: string; comments?: string; goals?: { id: string; rating: number }[] } }) => { const { data } = await api.put(`/reviews/${id}`, d); return data; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["reviews-to-review"] }); qc.invalidateQueries({ queryKey: ["review"] }); toast({ title: "Review submitted" }); } });
}
export function useAcknowledgeReview() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: async (id: string) => { await api.patch(`/reviews/${id}/acknowledge`); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["my-reviews"] }); } });
}
