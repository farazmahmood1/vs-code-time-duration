import { useSession } from "@/lib/auth-client";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export interface Announcement {
  id: string;
  title: string;
  description: string;
  category: "holiday" | "update" | "urgent" | "birthday" | "policy";
  department?: {
    id: string;
    name: string;
  };
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export interface AnnouncementsResponse {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: Announcement[];
}

export interface EmployeeAnnouncementsFilters {
  search?: string;
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

export const useEmployeeAnnouncements = (
  filters?: EmployeeAnnouncementsFilters
) => {
  const { data: session } = useSession();

  return useQuery({
    queryKey: [
      "employee-announcements",
      filters,
      (session?.user as Record<string, unknown>)?.department,
    ],
    queryFn: async (): Promise<PaginatedAnnouncements> => {
      const params = new URLSearchParams();

      params.append("page", String(filters?.page || 1));
      params.append("limit", String(filters?.pageSize || 10));

      if (filters?.search) {
        params.append("search", filters.search);
      }

      try {
        const res = await api.get<AnnouncementsResponse>(
          `/announcements/employee/list?${params.toString()}`
        );
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
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
        throw error;
      }
    },
    enabled: !!session?.user,
  });
};
