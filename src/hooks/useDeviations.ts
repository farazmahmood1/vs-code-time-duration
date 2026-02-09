import api, { type ApiError } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface AttendanceDeviation {
  id: string;
  userId: string;
  date: string;
  timerSessionId: string;
  expectedStart: string;
  actualStart: string;
  expectedEnd: string;
  actualEnd?: string;
  lateMinutes: number;
  earlyMinutes: number;
  isExcused: boolean;
  excuseReason?: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string;
    departmentId?: string;
  };
}

export interface DeviationSummary {
  totalLate: number;
  totalEarly: number;
  totalExcused: number;
}

export const useDeviations = (params?: {
  userId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
}) => {
  return useQuery({
    queryKey: ["deviations", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.userId) searchParams.append("userId", params.userId);
      if (params?.startDate) searchParams.append("startDate", params.startDate);
      if (params?.endDate) searchParams.append("endDate", params.endDate);
      if (params?.page) searchParams.append("page", String(params.page));

      const res = await api.get(`/deviations?${searchParams}`);
      return res.data as {
        data: AttendanceDeviation[];
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

export const useMyDeviations = (params?: {
  startDate?: string;
  endDate?: string;
  page?: number;
}) => {
  return useQuery({
    queryKey: ["deviations", "my", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.startDate) searchParams.append("startDate", params.startDate);
      if (params?.endDate) searchParams.append("endDate", params.endDate);
      if (params?.page) searchParams.append("page", String(params.page));

      const res = await api.get(`/deviations/my-deviations?${searchParams}`);
      return res.data as {
        data: AttendanceDeviation[];
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

export const useDeviationSummary = (params?: {
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: ["deviations", "summary", params],
    queryFn: async (): Promise<DeviationSummary> => {
      const searchParams = new URLSearchParams();
      if (params?.startDate) searchParams.append("startDate", params.startDate);
      if (params?.endDate) searchParams.append("endDate", params.endDate);

      const res = await api.get(`/deviations/summary?${searchParams}`);
      return res.data.data;
    },
  });
};

export const useExcuseDeviation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      excuseReason,
    }: {
      id: string;
      excuseReason: string;
    }) => {
      const res = await api.patch(`/deviations/${id}/excuse`, {
        excuseReason,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deviations"] });
      toast.success("Deviation marked as excused");
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message || "Failed to excuse deviation"
      );
    },
  });
};
