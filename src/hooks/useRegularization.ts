import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export interface AttendanceRegularization {
  id: string;
  userId: string;
  date: string;
  type: "MISSED_CHECKIN" | "MISSED_CHECKOUT" | "WRONG_TIME";
  requestedTime: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  approvedBy: string | null;
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    departmentId: string | null;
  };
  approver?: {
    id: string;
    name: string;
  } | null;
}

export interface RegularizationFormData {
  date: string;
  type: "MISSED_CHECKIN" | "MISSED_CHECKOUT" | "WRONG_TIME";
  requestedTime: string;
  reason: string;
}

export interface ApproveRegularizationData {
  status: "APPROVED" | "REJECTED";
  adminNote?: string;
}

export function useMyRegularizations(params?: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  return useQuery({
    queryKey: ["my-regularizations", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set("page", String(params.page));
      if (params?.limit) searchParams.set("limit", String(params.limit));
      if (params?.status) searchParams.set("status", params.status);
      const { data } = await api.get(
        `/regularizations/my-requests?${searchParams.toString()}`
      );
      return data as {
        success: boolean;
        data: AttendanceRegularization[];
        meta: { page: number; limit: number; total: number; totalPages: number };
      };
    },
  });
}

export function useAllRegularizations(params?: {
  page?: number;
  limit?: number;
  status?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: ["regularizations", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set("page", String(params.page));
      if (params?.limit) searchParams.set("limit", String(params.limit));
      if (params?.status) searchParams.set("status", params.status);
      if (params?.userId) searchParams.set("userId", params.userId);
      if (params?.startDate) searchParams.set("startDate", params.startDate);
      if (params?.endDate) searchParams.set("endDate", params.endDate);
      const { data } = await api.get(
        `/regularizations?${searchParams.toString()}`
      );
      return data as {
        success: boolean;
        data: AttendanceRegularization[];
        meta: { page: number; limit: number; total: number; totalPages: number };
      };
    },
  });
}

export function useSubmitRegularization() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (formData: RegularizationFormData) => {
      const { data } = await api.post("/regularizations", formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-regularizations"] });
      queryClient.invalidateQueries({ queryKey: ["regularizations"] });
      toast({
        title: "Request Submitted",
        description: "Your regularization request has been submitted for approval.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to submit regularization request",
        variant: "destructive",
      });
    },
  });
}

export function useApproveRegularization() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: ApproveRegularizationData;
    }) => {
      const { data: result } = await api.patch(
        `/regularizations/${id}/approve`,
        data
      );
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["regularizations"] });
      queryClient.invalidateQueries({ queryKey: ["my-regularizations"] });
      toast({
        title: `Request ${variables.data.status === "APPROVED" ? "Approved" : "Rejected"}`,
        description: `The regularization request has been ${variables.data.status.toLowerCase()}.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to process regularization request",
        variant: "destructive",
      });
    },
  });
}
