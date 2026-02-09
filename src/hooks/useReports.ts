import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

// ===== APP USAGE =====

export interface AppUsageItem {
  appName: string;
  count: number;
  estimatedMinutes: number;
  category: "PRODUCTIVE" | "NEUTRAL" | "UNPRODUCTIVE" | "UNCATEGORIZED";
}

export interface AppCategory {
  id: string;
  appName: string;
  category: "PRODUCTIVE" | "NEUTRAL" | "UNPRODUCTIVE" | "UNCATEGORIZED";
}

export function useAppUsageReport(params?: {
  userId?: string;
  departmentId?: string;
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: ["reports-app-usage", params],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (params?.userId) sp.set("userId", params.userId);
      if (params?.departmentId) sp.set("departmentId", params.departmentId);
      if (params?.startDate) sp.set("startDate", params.startDate);
      if (params?.endDate) sp.set("endDate", params.endDate);
      const { data } = await api.get(`/reports/app-usage?${sp.toString()}`);
      return data.data as AppUsageItem[];
    },
  });
}

export function useAppUsageByCategory(params?: {
  userId?: string;
  departmentId?: string;
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: ["reports-app-usage-categories", params],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (params?.userId) sp.set("userId", params.userId);
      if (params?.departmentId) sp.set("departmentId", params.departmentId);
      if (params?.startDate) sp.set("startDate", params.startDate);
      if (params?.endDate) sp.set("endDate", params.endDate);
      const { data } = await api.get(`/reports/app-usage/categories?${sp.toString()}`);
      return data.data as Record<string, number>;
    },
  });
}

export function useAppCategories() {
  return useQuery({
    queryKey: ["app-categories"],
    queryFn: async () => {
      const { data } = await api.get("/reports/app-categories");
      return data.data as AppCategory[];
    },
  });
}

export function useUpsertAppCategory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: { appName: string; category: string }) => {
      const { data: result } = await api.post("/reports/app-categories", data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["app-categories"] });
      queryClient.invalidateQueries({ queryKey: ["reports-app-usage"] });
      toast({ title: "Category updated" });
    },
  });
}

export function useDeleteAppCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/reports/app-categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["app-categories"] });
    },
  });
}

// ===== IDLE TIME =====

export interface IdleTimeReport {
  totalLogs: number;
  idleLogs: number;
  activeLogs: number;
  idlePercentage: number;
  idleMinutes: number;
  activeMinutes: number;
}

export interface IdleTimeSummaryItem {
  user: { id: string; name: string; email: string; image: string | null; departmentId: string | null };
  totalMinutes: number;
  idleMinutes: number;
  activeMinutes: number;
  idlePercentage: number;
}

export function useIdleTimeReport(params?: {
  userId?: string;
  departmentId?: string;
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: ["reports-idle-time", params],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (params?.userId) sp.set("userId", params.userId);
      if (params?.departmentId) sp.set("departmentId", params.departmentId);
      if (params?.startDate) sp.set("startDate", params.startDate);
      if (params?.endDate) sp.set("endDate", params.endDate);
      const { data } = await api.get(`/reports/idle-time?${sp.toString()}`);
      return data.data as IdleTimeReport;
    },
  });
}

export function useIdleTimeSummary(params?: {
  departmentId?: string;
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: ["reports-idle-time-summary", params],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (params?.departmentId) sp.set("departmentId", params.departmentId);
      if (params?.startDate) sp.set("startDate", params.startDate);
      if (params?.endDate) sp.set("endDate", params.endDate);
      const { data } = await api.get(`/reports/idle-time/summary?${sp.toString()}`);
      return data.data as IdleTimeSummaryItem[];
    },
  });
}

// ===== ATTENDANCE HEATMAP =====

export interface HeatmapDay {
  date: string;
  status: "present" | "absent" | "late" | "half-day" | "leave";
  hours: number;
  isWeekend: boolean;
}

export function useAttendanceHeatmap(params: {
  userId?: string;
  year: number;
  month: number;
}) {
  return useQuery({
    queryKey: ["reports-attendance-heatmap", params],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (params.userId) sp.set("userId", params.userId);
      sp.set("year", String(params.year));
      sp.set("month", String(params.month));
      const { data } = await api.get(`/reports/attendance-heatmap?${sp.toString()}`);
      return data.data as HeatmapDay[];
    },
  });
}

// ===== DEPARTMENT COMPARISON =====

export interface DepartmentComparisonItem {
  department: { id: string; name: string };
  headcount: number;
  avgHours: number;
  overtimeCount: number;
  leaveCount: number;
  lateArrivals: number;
}

export function useDepartmentComparison(params?: {
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: ["reports-department-comparison", params],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (params?.startDate) sp.set("startDate", params.startDate);
      if (params?.endDate) sp.set("endDate", params.endDate);
      const { data } = await api.get(`/reports/department-comparison?${sp.toString()}`);
      return data.data as DepartmentComparisonItem[];
    },
  });
}

// ===== EMPLOYEE TRENDS =====

export interface EmployeeTrendItem {
  period: string;
  totalHours: number;
  overtimeHours: number;
  lateArrivals: number;
  idlePercentage: number;
}

export function useEmployeeTrends(userId: string, weeks?: number) {
  return useQuery({
    queryKey: ["reports-employee-trends", userId, weeks],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (weeks) sp.set("weeks", String(weeks));
      const { data } = await api.get(`/reports/employee-trends/${userId}?${sp.toString()}`);
      return data.data as EmployeeTrendItem[];
    },
    enabled: !!userId,
  });
}

// ===== COST ANALYSIS =====

export interface ProjectCostItem {
  projectId: string;
  projectName: string;
  totalHours: number;
  totalCost: number;
  avgHourlyCost: number;
  teamSize: number;
}

export interface DepartmentCostItem {
  departmentId: string;
  departmentName: string;
  headcount: number;
  totalMonthlySalary: number;
}

export function useCostAnalysis(params?: {
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: ["reports-cost-analysis", params],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (params?.startDate) sp.set("startDate", params.startDate);
      if (params?.endDate) sp.set("endDate", params.endDate);
      const { data } = await api.get(`/reports/cost-analysis?${sp.toString()}`);
      return data.data as ProjectCostItem[];
    },
  });
}

export function useCostByDepartment(params?: {
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: ["reports-cost-department", params],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (params?.startDate) sp.set("startDate", params.startDate);
      if (params?.endDate) sp.set("endDate", params.endDate);
      const { data } = await api.get(`/reports/cost-analysis/department?${sp.toString()}`);
      return data.data as DepartmentCostItem[];
    },
  });
}
