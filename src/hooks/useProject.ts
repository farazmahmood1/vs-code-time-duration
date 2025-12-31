import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api, { type ApiError } from "@/lib/axios";
import { useToast } from "./use-toast";

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: "ACTIVE" | "INACTIVE" | "COMPLETED";
  departmentId?: string;
  department?: { id: string; name: string };
  members: Array<{ id: string; name: string; email: string }>;
  totalHours: number;
  assignedUsers: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsResponse {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: Project[];
}

export interface UseProjectsOptions {
  page?: number;
  limit?: number;
  status?: string;
  departmentId?: string;
  search?: string;
}

// List all projects
export const useProjects = (options: UseProjectsOptions = {}) => {
  const { page = 1, limit = 10, status, departmentId, search } = options;

  return useQuery<ProjectsResponse>({
    queryKey: ["projects", page, limit, status, departmentId, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (status) params.append("status", status);
      if (departmentId) params.append("departmentId", departmentId);
      if (search) params.append("search", search);

      const response = await api.get(`/projects?${params.toString()}`);
      return response.data;
    },
  });
};

// Get single project
export const useProject = (projectId: string | null) => {
  return useQuery<Project>({
    queryKey: ["projects", projectId],
    queryFn: async () => {
      if (!projectId) throw new Error("Project ID is required");
      const response = await api.get(`/projects/${projectId}`);
      return response.data;
    },
    enabled: !!projectId,
  });
};

// Get project hours
export const useProjectHours = (projectId: string | null) => {
  return useQuery({
    queryKey: ["projects", projectId, "hours"],
    queryFn: async () => {
      if (!projectId) throw new Error("Project ID is required");
      const response = await api.get(`/projects/${projectId}/hours`);
      return response.data;
    },
    enabled: !!projectId,
  });
};

// Create project mutation
export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      description?: string;
      status?: string;
      departmentId?: string;
      memberIds?: string[];
    }) => {
      const response = await api.post("/projects", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({
        title: "Success",
        description: "Project created successfully",
      });
    },
    onError: (error: ApiError) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to create project",
        variant: "destructive",
      });
    },
  });
};

// Update project mutation
export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: {
        name?: string;
        description?: string;
        status?: string;
        departmentId?: string;
        memberIds?: string[];
      };
    }) => {
      const response = await api.patch(`/projects/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.id],
      });
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
    },
    onError: (error: ApiError) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update project",
        variant: "destructive",
      });
    },
  });
};

// Delete project mutation
export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    },
    onError: (error: ApiError) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to delete project",
        variant: "destructive",
      });
    },
  });
};

// Add project member mutation
export const useAddProjectMember = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      projectId,
      userId,
    }: {
      projectId: string;
      userId: string;
    }) => {
      const response = await api.post(`/projects/${projectId}/members`, {
        userId,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({
        title: "Success",
        description: "Member added successfully",
      });
    },
    onError: (error: ApiError) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add member",
        variant: "destructive",
      });
    },
  });
};

// Remove project member mutation
export const useRemoveProjectMember = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      projectId,
      userId,
    }: {
      projectId: string;
      userId: string;
    }) => {
      await api.delete(`/projects/${projectId}/members/${userId}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({
        title: "Success",
        description: "Member removed successfully",
      });
    },
    onError: (error: ApiError) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to remove member",
        variant: "destructive",
      });
    },
  });
};
