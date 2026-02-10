import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import type { ApiError } from "@/lib/axios";

export interface OffboardingTask {
  id: string;
  processId: string;
  title: string;
  description?: string;
  category: string;
  assignedTo?: string;
  assignee?: { id: string; name: string; image?: string };
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  dueDate?: string;
  completedAt?: string;
  completedBy?: string;
  completer?: { id: string; name: string };
  notes?: string;
  sortOrder: number;
  createdAt: string;
}

export interface OffboardingProcess {
  id: string;
  employeeId: string;
  employee: {
    id: string;
    name: string;
    email: string;
    image?: string;
    department?: { name: string };
  };
  initiatedBy: string;
  initiator: { id: string; name: string };
  status: "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  lastWorkingDate: string;
  completedAt?: string;
  tasks: OffboardingTask[];
  completionPercent: number;
  totalTasks: number;
  completedTasks: number;
  createdAt: string;
}

export const useOffboardingProcesses = (params?: {
  status?: string;
  search?: string;
  page?: number;
}) =>
  useQuery({
    queryKey: ["offboarding", params],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (params?.status) sp.set("status", params.status);
      if (params?.search) sp.set("search", params.search);
      if (params?.page) sp.set("page", String(params.page));
      const { data } = await api.get(`/offboarding?${sp.toString()}`);
      return data as {
        data: OffboardingProcess[];
        meta: { page: number; total: number; totalPages: number };
      };
    },
  });

export const useOffboardingProcess = (id: string) =>
  useQuery({
    queryKey: ["offboarding", id],
    queryFn: async () => {
      const { data } = await api.get(`/offboarding/${id}`);
      return data.data as OffboardingProcess;
    },
    enabled: !!id,
  });

export function useInitiateOffboarding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (d: {
      employeeId: string;
      lastWorkingDate: string;
    }) => {
      const { data } = await api.post("/offboarding", d);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["offboarding"] });
      toast.success("Offboarding process initiated");
    },
    onError: (e: ApiError) => {
      toast.error(
        e.response?.data?.message || "Failed to initiate offboarding"
      );
    },
  });
}

export function useToggleOffboardingTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      processId,
      taskId,
    }: {
      processId: string;
      taskId: string;
    }) => {
      const { data } = await api.patch(
        `/offboarding/${processId}/tasks/${taskId}`
      );
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["offboarding"] });
    },
    onError: (e: ApiError) => {
      toast.error(e.response?.data?.message || "Failed to update task");
    },
  });
}

export function useUpdateOffboardingTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      processId,
      taskId,
      data: updateData,
    }: {
      processId: string;
      taskId: string;
      data: {
        assignedTo?: string;
        dueDate?: string;
        notes?: string;
        status?: string;
      };
    }) => {
      const { data } = await api.put(
        `/offboarding/${processId}/tasks/${taskId}`,
        updateData
      );
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["offboarding"] });
      toast.success("Task updated");
    },
    onError: (e: ApiError) => {
      toast.error(e.response?.data?.message || "Failed to update task");
    },
  });
}

export function useCancelOffboarding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch(`/offboarding/${id}/cancel`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["offboarding"] });
      toast.success("Offboarding cancelled");
    },
    onError: (e: ApiError) => {
      toast.error(
        e.response?.data?.message || "Failed to cancel offboarding"
      );
    },
  });
}
