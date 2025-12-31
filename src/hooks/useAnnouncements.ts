import api, { type ApiError } from "@/lib/axios";
import { type AnnouncementFormData } from "@/lib/validations/announcement";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface Announcement {
  id: string;
  title: string;
  description: string;
  category: "holiday" | "update" | "urgent" | "birthday" | "hr" | "policy";
  departmentId?: string;
  department?: {
    id: string;
    name: string;
  } | null;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  publishDate?: string;
  expiresAt?: string;
}

export interface AnnouncementsFilters {
  search?: string;
  category?: string;
  department?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedAnnouncements {
  announcements: Announcement[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const useAnnouncements = (filters?: AnnouncementsFilters) => {
  return useQuery({
    queryKey: ["announcements", filters],
    queryFn: async (): Promise<PaginatedAnnouncements> => {
      const params = new URLSearchParams();

      if (filters?.page) params.append("page", String(filters.page));
      if (filters?.pageSize) params.append("limit", String(filters.pageSize));
      if (filters?.category && filters.category !== "all")
        params.append("category", filters.category);
      if (
        filters?.department &&
        filters.department !== "" &&
        filters.department !== "all"
      )
        params.append("departmentId", filters.department);

      const res = await api.get(`/announcements?${params.toString()}`);
      const result = res.data;

      let announcements = result.data || [];

      if (filters?.search) {
        const q = filters.search.toLowerCase();
        announcements = announcements.filter(
          (a: Announcement) =>
            a.title.toLowerCase().includes(q) ||
            a.description.toLowerCase().includes(q)
        );
      }

      return {
        announcements,
        total: result.meta?.total || 0,
        page: result.meta?.page || 1,
        pageSize: result.meta?.limit || 10,
        totalPages: result.meta?.totalPages || 0,
      };
    },
  });
};

export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AnnouncementFormData) => {
      const res = await api.post("/announcements", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Announcement created successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message || "Failed to create announcement"
      );
    },
  });
};

export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<AnnouncementFormData>;
    }) => {
      const res = await api.put(`/announcements/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Announcement updated successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message || "Failed to update announcement"
      );
    },
  });
};

export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/announcements/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Announcement deleted successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message || "Failed to delete announcement"
      );
    },
  });
};
