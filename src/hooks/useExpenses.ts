import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import type { ApiError } from "@/lib/axios";

export interface Expense {
  id: string;
  userId: string;
  title: string;
  description?: string;
  amount: number;
  currency: string;
  category: string;
  receiptUrl?: string;
  receiptFileName?: string;
  status: "SUBMITTED" | "APPROVED" | "REJECTED" | "REIMBURSED";
  rejectionReason?: string;
  approvedBy?: string;
  approvedAt?: string;
  reimbursedAt?: string;
  createdAt: string;
  updatedAt: string;
  user?: { id: string; name: string; email: string; image?: string };
  approver?: { id: string; name: string };
}

export interface ExpenseSummary {
  totalSubmitted: number;
  pendingApproval: number;
  reimbursedThisMonth: number;
  rejectedCount: number;
}

export const useAllExpenses = (params?: {
  status?: string;
  category?: string;
  search?: string;
  page?: number;
}) =>
  useQuery({
    queryKey: ["expenses", params],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (params?.status) sp.set("status", params.status);
      if (params?.category) sp.set("category", params.category);
      if (params?.search) sp.set("search", params.search);
      if (params?.page) sp.set("page", String(params.page));
      const { data } = await api.get(`/expenses?${sp.toString()}`);
      return data as {
        data: Expense[];
        meta: { page: number; total: number; totalPages: number };
      };
    },
  });

export const useMyExpenses = (params?: {
  status?: string;
  category?: string;
  page?: number;
}) =>
  useQuery({
    queryKey: ["my-expenses", params],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (params?.status) sp.set("status", params.status);
      if (params?.category) sp.set("category", params.category);
      if (params?.page) sp.set("page", String(params.page));
      const { data } = await api.get(`/expenses/me?${sp.toString()}`);
      return data as {
        data: Expense[];
        meta: { page: number; total: number; totalPages: number };
      };
    },
  });

export const useExpenseSummary = () =>
  useQuery({
    queryKey: ["expense-summary"],
    queryFn: async () => {
      const { data } = await api.get("/expenses/summary");
      return data.data as ExpenseSummary;
    },
  });

export const useMyExpenseSummary = () =>
  useQuery({
    queryKey: ["my-expense-summary"],
    queryFn: async () => {
      const { data } = await api.get("/expenses/me/summary");
      return data.data as ExpenseSummary;
    },
  });

export function useCreateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post("/expenses", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["expenses"] });
      qc.invalidateQueries({ queryKey: ["my-expenses"] });
      qc.invalidateQueries({ queryKey: ["expense-summary"] });
      qc.invalidateQueries({ queryKey: ["my-expense-summary"] });
      toast.success("Expense submitted successfully");
    },
    onError: (e: ApiError) => {
      toast.error(e.response?.data?.message || "Failed to submit expense");
    },
  });
}

export function useUpdateExpenseStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
      rejectionReason,
    }: {
      id: string;
      status: string;
      rejectionReason?: string;
    }) => {
      const { data } = await api.patch(`/expenses/${id}/status`, {
        status,
        rejectionReason,
      });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["expenses"] });
      qc.invalidateQueries({ queryKey: ["expense-summary"] });
      toast.success("Expense status updated");
    },
    onError: (e: ApiError) => {
      toast.error(e.response?.data?.message || "Failed to update status");
    },
  });
}

export function useDeleteExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/expenses/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["expenses"] });
      qc.invalidateQueries({ queryKey: ["my-expenses"] });
      qc.invalidateQueries({ queryKey: ["expense-summary"] });
      qc.invalidateQueries({ queryKey: ["my-expense-summary"] });
      toast.success("Expense deleted");
    },
    onError: (e: ApiError) => {
      toast.error(e.response?.data?.message || "Failed to delete expense");
    },
  });
}
