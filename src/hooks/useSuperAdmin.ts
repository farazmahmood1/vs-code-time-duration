import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "sonner";

// ===== Types =====
export interface Company {
  id: string;
  name: string;
  slug: string;
  domain: string | null;
  logo: string | null;
  colorPrimary: string | null;
  colorSecondary: string | null;
  status: "ACTIVE" | "SUSPENDED" | "DEACTIVATED";
  maxUsers: number;
  currentUserCount: number;
  stripeCustomerId: string | null;
  createdAt: string;
  updatedAt: string;
  subscriptions?: Subscription[];
  featureOverrides?: FeatureOverride[];
  _count?: { users: number; departments?: number; projects?: number };
  description?: string | null;
  industry?: string | null;
  teamSize?: string | null;
  website?: string | null;
  companyAddress?: string | null;
  timezone?: string | null;
  workingHours?: string | null;
  owner?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    designation?: string | null;
  } | null;
}

export interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  yearlyPrice: number;
  currency: string;
  maxUsers: number;
  maxStorage: number;
  apiAccess: boolean;
  supportLevel: string;
  isActive: boolean;
  isCustom: boolean;
  sortOrder: number;
  features: PlanFeature[];
}

export interface PlanFeature {
  id: string;
  planId: string;
  featureKey: string;
  featureName: string;
  enabled: boolean;
  limit: number | null;
}

export interface Subscription {
  id: string;
  companyId: string;
  planId: string;
  status: string;
  billingCycle: string;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  plan: Plan;
  company?: Company;
}

export interface FeatureOverride {
  id: string;
  companyId: string;
  featureKey: string;
  enabled: boolean;
  limit: number | null;
  reason: string | null;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorRole: string;
  action: string;
  targetType: string;
  targetId: string | null;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  createdAt: string;
  actor: { id: string; name: string; email: string; role: string };
}

export interface PlatformOverview {
  totalCompanies: number;
  activeCompanies: number;
  suspendedCompanies: number;
  deactivatedCompanies: number;
  totalUsers: number;
  activeSubscriptions: number;
  mrr: number;
  arr: number;
  subscriptionsByPlan: Array<{ planName: string; planSlug: string; count: number }>;
  recentCompanies: Array<Company & { _count: { users: number } }>;
}

// ===== Hooks =====
export const usePlatformOverview = () =>
  useQuery<PlatformOverview>({
    queryKey: ["super-admin", "overview"],
    queryFn: async () => {
      const res = await api.get("/super-admin/analytics/overview");
      return res.data.data;
    },
  });

export const useCompanies = (params?: { page?: number; search?: string; status?: string }) =>
  useQuery<{ data: Company[]; total: number; page: number; totalPages: number }>({
    queryKey: ["super-admin", "companies", params],
    queryFn: async () => {
      const res = await api.get("/super-admin/companies", { params });
      return res.data;
    },
  });

export const useCompany = (id: string | null) =>
  useQuery<Company>({
    queryKey: ["super-admin", "companies", id],
    queryFn: async () => {
      const res = await api.get(`/super-admin/companies/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });

export const useCreateCompany = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.post("/super-admin/companies", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["super-admin", "companies"] });
      toast.success("Company created successfully");
      if (data.warning) {
        toast.warning(data.warning);
      }
    },
    // Global interceptor handles error toasts
  });
};

export const useUpdateCompanyStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await api.patch(`/super-admin/companies/${id}/status`, { status });
      return res.data.data;
    },
    onSuccess: (_data, variables) => {
      // Immediately update the cached company detail so the badge reflects instantly
      qc.setQueryData<Company>(["super-admin", "companies", variables.id], (old) =>
        old ? { ...old, status: variables.status as Company["status"] } : old
      );
      qc.invalidateQueries({ queryKey: ["super-admin", "companies"] });
      toast.success("Company status updated");
    },
    // Global interceptor handles error toasts
  });
};

export const useAdminPlans = () =>
  useQuery<Plan[]>({
    queryKey: ["super-admin", "plans"],
    queryFn: async () => {
      const res = await api.get("/super-admin/plans");
      return res.data.data;
    },
  });

export const useSubscriptions = (params?: { page?: number; status?: string }) =>
  useQuery<{ data: Subscription[]; total: number; page: number; totalPages: number }>({
    queryKey: ["super-admin", "subscriptions", params],
    queryFn: async () => {
      const res = await api.get("/super-admin/subscriptions", { params });
      return res.data;
    },
  });

export const useOverrideSubscription = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ companyId, planId }: { companyId: string; planId: string }) => {
      const res = await api.patch(`/super-admin/subscriptions/${companyId}`, { planId });
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["super-admin"] });
      toast.success("Subscription updated");
    },
    // Global interceptor handles error toasts
  });
};

export const useAuditLogs = (params?: { page?: number; action?: string; targetType?: string }) =>
  useQuery<{ data: AuditLog[]; total: number; page: number; totalPages: number }>({
    queryKey: ["super-admin", "audit-logs", params],
    queryFn: async () => {
      const res = await api.get("/super-admin/audit-logs", { params });
      return res.data;
    },
  });

export const useSeedPlans = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await api.post("/super-admin/seed-plans");
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["super-admin", "plans"] });
      toast.success("Default plans seeded");
    },
  });
};

export const useUpdatePlan = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string; name?: string; price?: number; yearlyPrice?: number; maxUsers?: number; maxStorage?: number; apiAccess?: boolean; supportLevel?: string; isActive?: boolean }) => {
      const res = await api.put(`/super-admin/plans/${id}`, data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["super-admin", "plans"] });
      toast.success("Plan updated");
    },
  });
};

export const useSetFeatureOverride = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ companyId, ...data }: { companyId: string; featureKey: string; enabled: boolean; limit?: number; reason?: string }) => {
      const res = await api.post(`/super-admin/companies/${companyId}/features`, data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["super-admin", "companies"] });
      toast.success("Feature override set");
    },
  });
};
