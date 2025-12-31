import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

interface EmployeeDashboardStats {
  checkInTime: string | null;
  checkOutTime: string | null;
  leavesApproved: number;
  leavesPending: number;
  todaySession: {
    status: string;
    startTime: string | null;
    endTime: string | null;
  };
}

interface WeeklyHoursData {
  Days: string;
  hours: number;
}

const DASHBOARD_STATS_KEY = "employeeDashboardStats";
const WEEKLY_HOURS_KEY = "employeeWeeklyHours";

export const useEmployeeDashboardStats = () => {
  return useQuery<EmployeeDashboardStats>({
    queryKey: [DASHBOARD_STATS_KEY],
    queryFn: async () => {
      const { data } = await api.get<EmployeeDashboardStats>(
        "/employee/dashboard/stats"
      );
      return data;
    },
    staleTime: 60000, // 1 minute
  });
};

export const useWeeklyHours = () => {
  return useQuery<WeeklyHoursData[]>({
    queryKey: [WEEKLY_HOURS_KEY],
    queryFn: async () => {
      const { data } = await api.get<WeeklyHoursData[]>(
        "/employee/dashboard/weekly-hours"
      );
      return data;
    },
    staleTime: 60000, // 1 minute
  });
};
