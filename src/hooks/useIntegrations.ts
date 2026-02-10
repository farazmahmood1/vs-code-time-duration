import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export type IntegrationType =
  | "SLACK"
  | "TEAMS"
  | "GOOGLE_CALENDAR"
  | "JIRA"
  | "CLICKUP";

export interface Integration {
  id: string;
  type: IntegrationType;
  name?: string;
  webhookUrl?: string;
  accessToken?: string;
  refreshToken?: string;
  channelId?: string;
  domain?: string;
  projectMapping?: string;
  isActive: boolean;
  configuredBy: string;
  configurer?: { id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export const useIntegrations = () =>
  useQuery({
    queryKey: ["integrations"],
    queryFn: async () => {
      const { data } = await api.get("/integrations");
      return data.data as Integration[];
    },
  });

export const useIntegration = (id: string) =>
  useQuery({
    queryKey: ["integrations", id],
    queryFn: async () => {
      const { data } = await api.get(`/integrations/${id}`);
      return data.data as Integration;
    },
    enabled: !!id,
  });

export function useConfigureSlack() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (d: {
      webhookUrl: string;
      channelId?: string;
      name?: string;
    }) => {
      const { data } = await api.post("/integrations/slack", d);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["integrations"] });
      toast({ title: "Slack integration configured" });
    },
    onError: (e: any) => {
      toast({
        title: "Error",
        description: e?.response?.data?.message || "Failed to configure Slack",
        variant: "destructive",
      });
    },
  });
}

export function useConfigureTeams() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (d: { webhookUrl: string; name?: string }) => {
      const { data } = await api.post("/integrations/teams", d);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["integrations"] });
      toast({ title: "Teams integration configured" });
    },
    onError: (e: any) => {
      toast({
        title: "Error",
        description: e?.response?.data?.message || "Failed to configure Teams",
        variant: "destructive",
      });
    },
  });
}

export function useConfigureGoogleCalendar() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (d: {
      accessToken: string;
      refreshToken?: string;
    }) => {
      const { data } = await api.post("/integrations/google-calendar", d);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["integrations"] });
      toast({ title: "Google Calendar connected" });
    },
    onError: (e: any) => {
      toast({
        title: "Error",
        description:
          e?.response?.data?.message || "Failed to connect Google Calendar",
        variant: "destructive",
      });
    },
  });
}

export function useConfigureJira() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (d: {
      domain: string;
      accessToken: string;
      projectMapping?: Record<string, string>;
      name?: string;
    }) => {
      const { data } = await api.post("/integrations/jira", d);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["integrations"] });
      toast({ title: "Jira integration configured" });
    },
    onError: (e: any) => {
      toast({
        title: "Error",
        description: e?.response?.data?.message || "Failed to configure Jira",
        variant: "destructive",
      });
    },
  });
}

export function useConfigureClickUp() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (d: {
      accessToken: string;
      projectMapping?: Record<string, string>;
      name?: string;
    }) => {
      const { data } = await api.post("/integrations/clickup", d);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["integrations"] });
      toast({ title: "ClickUp integration configured" });
    },
    onError: (e: any) => {
      toast({
        title: "Error",
        description:
          e?.response?.data?.message || "Failed to configure ClickUp",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteIntegration() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/integrations/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["integrations"] });
      toast({ title: "Integration deleted" });
    },
    onError: (e: any) => {
      toast({
        title: "Error",
        description:
          e?.response?.data?.message || "Failed to delete integration",
        variant: "destructive",
      });
    },
  });
}

export function useTestIntegration() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(`/integrations/${id}/test`);
      return data;
    },
    onSuccess: (data) => {
      toast({ title: "Test successful", description: data?.data?.message });
    },
    onError: (e: any) => {
      toast({
        title: "Test failed",
        description:
          e?.response?.data?.message || "Webhook test failed",
        variant: "destructive",
      });
    },
  });
}

export function useToggleIntegration() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch(`/integrations/${id}/toggle`);
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["integrations"] });
      toast({
        title: data?.data?.isActive
          ? "Integration activated"
          : "Integration deactivated",
      });
    },
    onError: (e: any) => {
      toast({
        title: "Error",
        description:
          e?.response?.data?.message || "Failed to toggle integration",
        variant: "destructive",
      });
    },
  });
}
