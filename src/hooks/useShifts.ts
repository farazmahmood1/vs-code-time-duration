import api, { type ApiError } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  graceMinutes: number;
  breakMinutes: number;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    employees: number;
  };
  employees?: ShiftEmployee[];
}

export interface ShiftEmployee {
  id: string;
  name: string;
  email: string;
  image?: string;
  uniqueId?: string;
  departmentId?: string;
  department?: { name: string };
  assignedAt: string;
  assignmentId: string;
}

export interface ShiftFormData {
  name: string;
  startTime: string;
  endTime: string;
  graceMinutes?: number;
  breakMinutes?: number;
  isDefault?: boolean;
  isActive?: boolean;
}

export interface AssignShiftData {
  userId: string;
  shiftId: string;
  startDate: string;
  endDate?: string;
}

export const useShifts = () => {
  return useQuery({
    queryKey: ["shifts"],
    queryFn: async (): Promise<Shift[]> => {
      const res = await api.get("/shifts");
      return res.data.data;
    },
  });
};

export const useShift = (id: string) => {
  return useQuery({
    queryKey: ["shifts", id],
    queryFn: async (): Promise<Shift> => {
      const res = await api.get(`/shifts/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
};

export const useMyShift = () => {
  return useQuery({
    queryKey: ["shifts", "my-shift"],
    queryFn: async (): Promise<Shift | null> => {
      const res = await api.get("/shifts/my-shift");
      return res.data.data;
    },
  });
};

export const useShiftEmployees = (shiftId: string) => {
  return useQuery({
    queryKey: ["shifts", shiftId, "employees"],
    queryFn: async (): Promise<ShiftEmployee[]> => {
      const res = await api.get(`/shifts/${shiftId}/employees`);
      return res.data.data;
    },
    enabled: !!shiftId,
  });
};

export const useCreateShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ShiftFormData) => {
      const res = await api.post("/shifts", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      toast.success("Shift created successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Failed to create shift");
    },
  });
};

export const useUpdateShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ShiftFormData>;
    }) => {
      const res = await api.put(`/shifts/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      toast.success("Shift updated successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Failed to update shift");
    },
  });
};

export const useDeleteShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/shifts/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      toast.success("Shift deleted successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Failed to delete shift");
    },
  });
};

export const useAssignShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AssignShiftData) => {
      const res = await api.post("/shifts/assign", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee assigned to shift successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message || "Failed to assign employee to shift"
      );
    },
  });
};

export const useUnassignShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { userId: string; shiftId: string }) => {
      const res = await api.post("/shifts/unassign", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee unassigned from shift successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to unassign employee from shift"
      );
    },
  });
};
