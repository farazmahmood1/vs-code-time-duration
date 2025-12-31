import api, { type ApiError } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface Department {
  id: string;
  name: string;
  description?: string;
  userCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentFormData {
  name: string;
  description?: string;
}

export interface DepartmentsFilters {
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedDepartments {
  data: Department[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const useDepartments = (filters?: DepartmentsFilters) => {
  return useQuery({
    queryKey: ["departments", filters],
    queryFn: async (): Promise<PaginatedDepartments> => {
      const params = new URLSearchParams();

      if (filters?.page) params.append("page", String(filters.page));
      if (filters?.pageSize) params.append("limit", String(filters.pageSize));
      if (filters?.search) params.append("search", filters.search);

      const res = await api.get(`/departments?${params.toString()}`);
      return res.data;
    },
  });
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DepartmentFormData) => {
      const res = await api.post("/departments", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Department created successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message || "Failed to create department"
      );
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<DepartmentFormData>;
    }) => {
      const res = await api.put(`/departments/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Department updated successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message || "Failed to update department"
      );
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/departments/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Department deleted successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message || "Failed to delete department"
      );
    },
  });
};

export const useAssignEmployeeToDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      employeeId,
      departmentId,
    }: {
      employeeId: string;
      departmentId: string;
    }) => {
      const res = await api.post("/departments/assign", {
        employeeId,
        departmentId,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee assigned to department successfully");
    },
    onError: (error: ApiError) => {
      toast.error(
        error?.response?.data?.message || "Failed to assign employee"
      );
    },
  });
};

export const useRemoveEmployeeFromDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (employeeId: string) => {
      const res = await api.post("/departments/unassign", {
        employeeId,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee removed from department successfully");
    },
    onError: (error: ApiError) => {
      toast.error(
        error?.response?.data?.message || "Failed to remove employee"
      );
    },
  });
};
