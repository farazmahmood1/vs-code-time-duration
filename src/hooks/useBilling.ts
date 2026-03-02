import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "sonner";
import type { Plan, Subscription } from "./useSuperAdmin";

export const usePublicPlans = () =>
  useQuery<Plan[]>({
    queryKey: ["billing", "plans"],
    queryFn: async () => {
      const res = await api.get("/billing/plans");
      return res.data.data;
    },
  });

export const useSubscription = () =>
  useQuery<Subscription | null>({
    queryKey: ["billing", "subscription"],
    queryFn: async () => {
      const res = await api.get("/billing/subscription");
      return res.data.data;
    },
  });

export const useCreateCheckout = () =>
  useMutation({
    mutationFn: async ({ planId, billingCycle }: { planId: string; billingCycle: "MONTHLY" | "YEARLY" }) => {
      const res = await api.post("/billing/checkout-session", {
        planId,
        billingCycle,
        successUrl: `${window.location.origin}/app/settings?billing=success`,
        cancelUrl: `${window.location.origin}/app/settings?billing=canceled`,
      });
      return res.data.data as { url: string; sessionId: string };
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: () => toast.error("Failed to start checkout"),
  });

export const useCreatePortalSession = () =>
  useMutation({
    mutationFn: async () => {
      const res = await api.post("/billing/portal-session", {
        returnUrl: `${window.location.origin}/app/settings`,
      });
      return res.data.data as { url: string };
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: () => toast.error("Failed to open billing portal"),
  });

export const useInvoices = () =>
  useQuery<Subscription[]>({
    queryKey: ["billing", "invoices"],
    queryFn: async () => {
      const res = await api.get("/billing/invoices");
      return res.data.data;
    },
  });

export interface SetupCompanyInput {
  companyName: string;
  domain?: string;
  planSlug: string;
  billingCycle: "MONTHLY" | "YEARLY";
}

export interface SetupCompanyResponse {
  company: { id: string; name: string; slug: string };
  subscription: Subscription | null;
  checkoutUrl: string | null;
}

export const useSetupCompany = () =>
  useMutation<SetupCompanyResponse, Error, SetupCompanyInput>({
    mutationFn: async (data) => {
      const res = await api.post("/billing/setup-company", data);
      return res.data.data;
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to set up company";
      toast.error(message);
    },
  });
