import api, { type ApiError } from "@/lib/axios";
import {
  type ImportantLinkFormData,
  type TermsConditionFormData,
} from "@/lib/validations/settings";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface ImportantLink {
  id: string;
  title: string;
  url: string;
  icon?: string;
  category?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TermsCondition {
  id: string;
  title: string;
  content: string;
  version: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type { ImportantLinkFormData, TermsConditionFormData };

export const useImportantLinks = () => {
  const queryClient = useQueryClient();

  const { data: links = [], isLoading } = useQuery({
    queryKey: ["settings", "links"],
    queryFn: async (): Promise<ImportantLink[]> => {
      const res = await api.get("/settings/links");
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ImportantLinkFormData) => {
      const res = await api.post("/settings/links", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "links"] });
      toast.success("Link added successfully");
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Failed to add link");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ImportantLinkFormData>;
    }) => {
      const res = await api.patch(`/settings/links/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "links"] });
      toast.success("Link updated successfully");
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Failed to update link");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/settings/links/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "links"] });
      toast.success("Link deleted successfully");
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Failed to delete link");
    },
  });

  return {
    links,
    isLoading,
    createLink: createMutation.mutateAsync,
    updateLink: updateMutation.mutateAsync,
    deleteLink: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const useTermsConditions = (isAdmin = false) => {
  const queryClient = useQueryClient();

  const { data: terms = [], isLoading } = useQuery({
    queryKey: ["settings", "terms", isAdmin],
    queryFn: async (): Promise<TermsCondition[]> => {
      const endpoint = isAdmin ? "/settings/terms/all" : "/settings/terms";
      const res = await api.get(endpoint);
      return Array.isArray(res.data) ? res.data : [res.data];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: TermsConditionFormData) => {
      const res = await api.post("/settings/terms", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "terms"] });
      toast.success("Terms and conditions added successfully");
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message || "Failed to add terms and conditions"
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<TermsConditionFormData>;
    }) => {
      const res = await api.patch(`/settings/terms/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "terms"] });
      toast.success("Terms and conditions updated successfully");
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message || "Failed to update terms and conditions"
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/settings/terms/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "terms"] });
      toast.success("Terms and conditions deleted successfully");
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message || "Failed to delete terms and conditions"
      );
    },
  });

  return {
    terms,
    isLoading,
    createTerms: createMutation.mutateAsync,
    updateTerms: updateMutation.mutateAsync,
    deleteTerms: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
