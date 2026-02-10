import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import type { ApiError } from "@/lib/axios";

export interface Compensation {
  id: string;
  userId: string;
  type: "BONUS" | "COMMISSION";
  category: string;
  amount: number;
  currency: string;
  description?: string;
  status: "PENDING" | "APPROVED" | "PAID" | "CANCELLED";
  approvedBy?: string;
  approvedAt?: string;
  paidAt?: string;
  payPeriod?: string;
  createdAt: string;
  updatedAt: string;
  user?: { id: string; name: string; email: string; image?: string };
  approver?: { id: string; name: string };
}

export interface CompensationSummary {
  totalBonuses: number;
  totalCommissions: number;
  pendingAmount: number;
  paidThisMonth: number;
}

export const useAllCompensations = (params?: {
  type?: string;
  status?: string;
  search?: string;
  page?: number;
}) =>
  useQuery({
    queryKey: ["compensations", params],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (params?.type) sp.set("type", params.type);
      if (params?.status) sp.set("status", params.status);
      if (params?.search) sp.set("search", params.search);
      if (params?.page) sp.set("page", String(params.page));
      const { data } = await api.get(`/compensation?${sp.toString()}`);
      return data as {
        data: Compensation[];
        meta: { page: number; total: number; totalPages: number };
      };
    },
  });

export const useMyCompensations = (params?: { page?: number }) =>
  useQuery({
    queryKey: ["my-compensations", params],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (params?.page) sp.set("page", String(params.page));
      const { data } = await api.get(`/compensation/me?${sp.toString()}`);
      return data as {
        data: Compensation[];
        meta: { page: number; total: number; totalPages: number };
      };
    },
  });

export const useCompensationSummary = () =>
  useQuery({
    queryKey: ["compensation-summary"],
    queryFn: async () => {
      const { data } = await api.get("/compensation/summary");
      return data.data as CompensationSummary;
    },
  });

export const useMyCompensationSummary = () =>
  useQuery({
    queryKey: ["my-compensation-summary"],
    queryFn: async () => {
      const { data } = await api.get("/compensation/me/summary");
      return data.data as CompensationSummary;
    },
  });

export function useCreateCompensation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (d: {
      userId: string;
      type: string;
      category: string;
      amount: number;
      description?: string;
      payPeriod?: string;
    }) => {
      const { data } = await api.post("/compensation", d);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["compensations"] });
      qc.invalidateQueries({ queryKey: ["compensation-summary"] });
      toast.success("Compensation created successfully");
    },
    onError: (e: ApiError) => {
      toast.error(e.response?.data?.message || "Failed to create compensation");
    },
  });
}

export function useUpdateCompensationStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await api.patch(`/compensation/${id}/status`, {
        status,
      });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["compensations"] });
      qc.invalidateQueries({ queryKey: ["compensation-summary"] });
      toast.success("Status updated successfully");
    },
    onError: (e: ApiError) => {
      toast.error(e.response?.data?.message || "Failed to update status");
    },
  });
}

export function useDeleteCompensation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/compensation/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["compensations"] });
      qc.invalidateQueries({ queryKey: ["compensation-summary"] });
      toast.success("Compensation deleted");
    },
    onError: (e: ApiError) => {
      toast.error(e.response?.data?.message || "Failed to delete");
    },
  });
}
