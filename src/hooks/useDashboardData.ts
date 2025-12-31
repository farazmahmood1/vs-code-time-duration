import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface DashboardFilters {
  department: string;
  project: string;
  startDate?: Date;
  endDate?: Date;
}

interface DashboardStats {
  activeEmployees: number;
  inactiveEmployees: number;
  totalHoursLogged: number;
  checkInToday: number;
  checkOutToday: number;
  onLeave: number;
}

interface DashboardData {
  stats: DashboardStats;
  weeklyHours: Array<{ week: string; hours: number; percentage: string }>;
}

export const useDashboardData = (filters: DashboardFilters) => {
  return useQuery<DashboardData>({
    queryKey: ["dashboard-data", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.department && filters.department !== "all") {
        params.append("departmentId", filters.department);
      }

      if (filters.project && filters.project !== "all") {
        params.append("projectId", filters.project);
      }

      if (filters.startDate) {
        params.append("startDate", filters.startDate.toISOString());
      }

      if (filters.endDate) {
        params.append("endDate", filters.endDate.toISOString());
      }

      const res = await api.get<{ data: DashboardData; message: string }>(
        `/dashboard?${params.toString()}`
      );
      return res.data.data;
    },
  });
};
