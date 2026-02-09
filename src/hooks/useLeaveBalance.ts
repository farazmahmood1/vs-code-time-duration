import api, { type ApiError } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface LeaveBalance {
  id: string;
  userId: string;
  leaveType: string;
  year: number;
  totalDays: number;
  usedDays: number;
  carriedOver: number;
  remainingDays: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string;
    departmentId?: string;
  };
}

export interface LeavePolicy {
  id: string;
  leaveType: string;
  annualDays: number;
  maxCarryOver: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LeavePolicyFormData {
  leaveType: string;
  annualDays: number;
  maxCarryOver?: number;
  isActive?: boolean;
}

// --- Employee hooks ---

export const useMyLeaveBalances = (year?: number) => {
  return useQuery({
    queryKey: ["leave-balances", "my", year],
    queryFn: async (): Promise<LeaveBalance[]> => {
      const params = year ? `?year=${year}` : "";
      const res = await api.get(`/leave-balances/my-balances${params}`);
      return res.data.data;
    },
  });
};

// --- Admin hooks ---

export const useLeavePolicies = () => {
  return useQuery({
    queryKey: ["leave-policies"],
    queryFn: async (): Promise<LeavePolicy[]> => {
      const res = await api.get("/leave-balances/policies");
      return res.data.data;
    },
  });
};

export const useUpsertLeavePolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LeavePolicyFormData) => {
      const res = await api.post("/leave-balances/policies", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leave-policies"] });
      toast.success("Leave policy saved successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message || "Failed to save leave policy"
      );
    },
  });
};

export const useAllLeaveBalances = (year?: number, page = 1, limit = 20) => {
  return useQuery({
    queryKey: ["leave-balances", "all", year, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (year) params.append("year", String(year));
      params.append("page", String(page));
      params.append("limit", String(limit));

      const res = await api.get(`/leave-balances?${params.toString()}`);
      return res.data as {
        data: LeaveBalance[];
        meta: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      };
    },
  });
};

export const useUserLeaveBalances = (userId: string, year?: number) => {
  return useQuery({
    queryKey: ["leave-balances", userId, year],
    queryFn: async (): Promise<LeaveBalance[]> => {
      const params = year ? `?year=${year}` : "";
      const res = await api.get(`/leave-balances/${userId}${params}`);
      return res.data.data;
    },
    enabled: !!userId,
  });
};

export const useInitializeLeaveBalances = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (year: number) => {
      const res = await api.post("/leave-balances/initialize", { year });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["leave-balances"] });
      toast.success(data.message || "Leave balances initialized!");
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message || "Failed to initialize leave balances"
      );
    },
  });
};

export const useAdjustLeaveBalance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: { totalDays?: number; usedDays?: number; carriedOver?: number };
    }) => {
      const res = await api.put(`/leave-balances/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leave-balances"] });
      toast.success("Leave balance adjusted successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message || "Failed to adjust leave balance"
      );
    },
  });
};
