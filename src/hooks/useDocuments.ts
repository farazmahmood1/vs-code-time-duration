import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export interface DocumentItem {
  id: string;
  title: string;
  description?: string;
  category: "CONTRACT" | "POLICY" | "HANDBOOK" | "NDA" | "OTHER_DOCUMENT";
  filePath: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  version: number;
  requiresAcknowledgment: boolean;
  uploadedBy: string;
  uploader: { id: string; name: string; image?: string };
  isActive: boolean;
  acknowledgments: { userId: string; acknowledgedAt: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface DocumentAck {
  id: string;
  userId: string;
  user: { id: string; name: string; image?: string };
  acknowledgedAt: string;
}

export const useDocuments = (params?: {
  category?: string;
  search?: string;
  page?: number;
}) =>
  useQuery({
    queryKey: ["documents", params],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (params?.category) sp.set("category", params.category);
      if (params?.search) sp.set("search", params.search);
      if (params?.page) sp.set("page", String(params.page));
      const { data } = await api.get(`/documents?${sp.toString()}`);
      return data as {
        data: DocumentItem[];
        meta: { page: number; total: number; totalPages: number };
      };
    },
  });

export const useDocument = (id: string) =>
  useQuery({
    queryKey: ["document", id],
    queryFn: async () => {
      const { data } = await api.get(`/documents/${id}`);
      return data.data as DocumentItem;
    },
    enabled: !!id,
  });

export function useUploadDocument() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post("/documents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["documents"] });
      toast({ title: "Document uploaded successfully" });
    },
  });
}

export function useUpdateDocument() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const { data } = await api.put(`/documents/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["documents"] });
      toast({ title: "Document updated successfully" });
    },
  });
}

export function useDeleteDocument() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/documents/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["documents"] });
      toast({ title: "Document deleted" });
    },
  });
}

export function useAcknowledgeDocument() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(`/documents/${id}/acknowledge`);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["documents"] });
      toast({ title: "Document acknowledged" });
    },
  });
}
