import api, { type ApiError } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface OvertimeConfig {
  id: string;
  dailyLimitHours: number;
  weeklyLimitHours: number;
  monthlyLimitHours: number;
  alertThreshold: number;
  isActive: boolean;
}

export interface OvertimeRecord {
  id: string;
  userId: string;
  date: string;
  regularHours: number;
  overtimeHours: number;
  totalHours: number;
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string;
    departmentId?: string;
  };
}

export interface OvertimeAlert {
  userId: string;
  user: { id: string; name: string; email: string; departmentId?: string };
  type: "weekly" | "monthly";
  currentHours: number;
  limitHours: number;
  percentage: number;
  exceeded: boolean;
}

export interface OvertimeSummary {
  weekly: {
    totalHours: number;
    overtimeHours: number;
    regularHours: number;
    limit: number;
  };
  monthly: {
    totalHours: number;
    overtimeHours: number;
    regularHours: number;
    limit: number;
  };
  config: OvertimeConfig;
}

export const useOvertimeConfig = () => {
  return useQuery({
    queryKey: ["overtime-config"],
    queryFn: async (): Promise<OvertimeConfig> => {
      const res = await api.get("/overtime/config");
      return res.data.data;
    },
  });
};

export const useUpdateOvertimeConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<OvertimeConfig>) => {
      const res = await api.put("/overtime/config", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["overtime-config"] });
      toast.success("Overtime config updated!");
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message || "Failed to update overtime config"
      );
    },
  });
};

export const useMyOvertime = (params?: {
  startDate?: string;
  endDate?: string;
  page?: number;
}) => {
  return useQuery({
    queryKey: ["overtime", "my", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.startDate) searchParams.append("startDate", params.startDate);
      if (params?.endDate) searchParams.append("endDate", params.endDate);
      if (params?.page) searchParams.append("page", String(params.page));

      const res = await api.get(`/overtime/my-overtime?${searchParams}`);
      return res.data as {
        data: OvertimeRecord[];
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

export const useAllOvertime = (params?: {
  startDate?: string;
  endDate?: string;
  userId?: string;
  page?: number;
}) => {
  return useQuery({
    queryKey: ["overtime", "all", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.startDate) searchParams.append("startDate", params.startDate);
      if (params?.endDate) searchParams.append("endDate", params.endDate);
      if (params?.userId) searchParams.append("userId", params.userId);
      if (params?.page) searchParams.append("page", String(params.page));

      const res = await api.get(`/overtime?${searchParams}`);
      return res.data as {
        data: OvertimeRecord[];
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

export const useOvertimeAlerts = () => {
  return useQuery({
    queryKey: ["overtime", "alerts"],
    queryFn: async (): Promise<OvertimeAlert[]> => {
      const res = await api.get("/overtime/alerts");
      return res.data.data;
    },
  });
};

export const useOvertimeSummary = (userId?: string) => {
  return useQuery({
    queryKey: ["overtime", "summary", userId],
    queryFn: async (): Promise<OvertimeSummary> => {
      const params = userId ? `?userId=${userId}` : "";
      const res = await api.get(`/overtime/summary${params}`);
      return res.data.data;
    },
  });
};
