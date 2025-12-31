import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api, { type ApiError } from "@/lib/axios";
import type {
  LeaveFormData,
  LeaveType,
  LeaveStatus,
} from "@/lib/validations/leave";
import { toast } from "sonner";

export interface Leave {
  id: string;
  employeeId: string;
  employee: {
    id: string;
    name: string;
    email: string;
    uniqueId: string;
  };
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  duration: number;
  reason?: string;
  prescriptionUrl?: string;
  status: LeaveStatus;
  approvedBy?: {
    id: string;
    name: string;
    email: string;
  };
  approvalNotes?: string;
  approvalDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveStats {
  totalDays: number;
  byType: Record<string, number>;
}

interface LeaveListResponse {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: Leave[];
}

interface UseLeaveDataParams {
  page?: number;
  pageSize?: number;
  search?: string;
  leaveType?: string;
  status?: string;
  department?: string;
  startDate?: Date;
  endDate?: Date;
}

export const useLeaveData = ({
  page = 1,
  pageSize = 10,
  search,
  leaveType,
  status,
  department,
  startDate,
  endDate,
}: UseLeaveDataParams) => {
  return useQuery({
    queryKey: [
      "leaves",
      page,
      pageSize,
      search,
      leaveType,
      status,
      department,
      startDate,
      endDate,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("limit", String(pageSize));
      if (status && status !== "All") params.append("status", status);
      if (leaveType && leaveType !== "All")
        params.append("leaveType", leaveType);
      if (department && department !== "All")
        params.append("department", department);
      if (startDate) params.append("startDate", startDate.toISOString());
      if (endDate) params.append("endDate", endDate.toISOString());
      const res = await api.get<LeaveListResponse>(
        `/leaves?${params.toString()}`
      );
      const result = res.data;
      let leaves = result.data || [];
      // Client-side search filtering
      if (search) {
        const q = search.toLowerCase();
        leaves = leaves.filter(
          (leave) =>
            leave.employee.name.toLowerCase().includes(q) ||
            leave.employee.id.toLowerCase().includes(q) ||
            leave.reason?.toLowerCase().includes(q)
        );
      }
      return {
        leaves,
        totalPages: result.meta?.totalPages || 1,
        totalLeaves: result.meta?.total || 0,
      };
    },
  });
};

export const useMyLeaves = (filters?: {
  page?: number;
  pageSize?: number;
  status?: string;
}) => {
  return useQuery({
    queryKey: ["my-leaves", filters?.page, filters?.pageSize, filters?.status],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.page) params.append("page", String(filters.page));
      if (filters?.pageSize) params.append("limit", String(filters.pageSize));
      if (filters?.status && filters.status !== "All")
        params.append("status", filters.status);
      const res = await api.get<LeaveListResponse>(
        `/leaves/my-leaves?${params.toString()}`
      );
      return res.data;
    },
  });
};

export const useLeaveStats = () => {
  return useQuery({
    queryKey: ["leave-stats"],
    queryFn: async () => {
      const res = await api.get<LeaveStats>("/leaves/stats");
      return res.data;
    },
  });
};

export interface AdminLeaveStats {
  onLeave: number;
  approved: number;
  pending: number;
  rejected: number;
}

export const useAdminLeaveStats = () => {
  return useQuery({
    queryKey: ["admin-leave-stats"],
    queryFn: async () => {
      const res = await api.get<AdminLeaveStats>("/leaves/admin/stats");
      return res.data;
    },
  });
};

export const useCreateLeave = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      data: LeaveFormData & { prescriptionFile?: File | null }
    ) => {
      if (!data.startDate || !data.endDate) {
        toast.error("Start date aur end date zaroori hai bhai!");
        throw new Error("Dates are missing");
      }

      // Ensure startDate and endDate are Date objects before calling toISOString()
      const startDateObj =
        data.startDate instanceof Date
          ? data.startDate
          : new Date(data.startDate);
      const endDateObj =
        data.endDate instanceof Date ? data.endDate : new Date(data.endDate);

      const formData = new FormData();
      formData.append("leaveType", data.leaveType);
      formData.append("reason", data.reason || "");
      formData.append("startDate", startDateObj.toISOString());
      formData.append("endDate", endDateObj.toISOString());

      // Add prescription file if it exists
      if (data.prescriptionFile) {
        formData.append("prescription", data.prescriptionFile);
      }

      const res = await api.post<Leave>("/leaves", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
      queryClient.invalidateQueries({ queryKey: ["my-leaves"] });
      queryClient.invalidateQueries({ queryKey: ["leave-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin-leave-stats"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error: ApiError) => {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Failed to submit leave request"
      );
    },
  });
};

export const useUpdateLeaveStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
      approvalNotes,
    }: {
      id: string;
      status: string;
      approvalNotes?: string;
    }) => {
      const res = await api.patch<Leave>(`/leaves/${id}/approve`, {
        status,
        approvalNotes,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
      queryClient.invalidateQueries({ queryKey: ["my-leaves"] });
      queryClient.invalidateQueries({ queryKey: ["leave-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin-leave-stats"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message || "Failed to update leave status"
      );
    },
  });
};

export const useUpdateLeave = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<LeaveFormData>;
    }) => {
      const payload: {
        leaveType?: string;
        reason?: string;
        startDate?: string;
        endDate?: string;
      } = {};
      if (data.leaveType) payload.leaveType = data.leaveType;
      if (data.reason) payload.reason = data.reason;
      if (data.startDate) payload.startDate = data.startDate.toISOString();
      if (data.endDate) payload.endDate = data.endDate.toISOString();

      const res = await api.put<Leave>(`/leaves/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
      queryClient.invalidateQueries({ queryKey: ["my-leaves"] });
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Failed to update leave");
    },
  });
};

export const useDeleteLeave = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/leaves/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
      queryClient.invalidateQueries({ queryKey: ["my-leaves"] });
      queryClient.invalidateQueries({ queryKey: ["leave-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin-leave-stats"] });
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Failed to delete leave");
    },
  });
};
