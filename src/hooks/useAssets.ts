import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export interface Asset {
  id: string; name: string; type: string; serialNumber?: string;
  purchaseDate?: string; purchaseCost?: number; condition: string;
  notes?: string; isAvailable: boolean;
  assignments?: { id: string; user: { id: string; name: string; email: string; image?: string }; assignedAt: string; returnedAt?: string }[];
}

export interface AssetSummary { total: number; available: number; assigned: number; }

export const useAssets = (params?: { page?: number; type?: string; condition?: string; available?: string }) =>
  useQuery({ queryKey: ["assets", params], queryFn: async () => {
    const sp = new URLSearchParams();
    if (params?.page) sp.set("page", String(params.page));
    if (params?.type) sp.set("type", params.type);
    if (params?.condition) sp.set("condition", params.condition);
    if (params?.available) sp.set("available", params.available);
    const { data } = await api.get(`/assets?${sp.toString()}`);
    return data as { data: Asset[]; meta: { page: number; total: number; totalPages: number } };
  }});

export const useMyAssets = () => useQuery({ queryKey: ["my-assets"], queryFn: async () => { const { data } = await api.get("/assets/my-assets"); return data.data as { id: string; asset: Asset; assignedAt: string }[]; }});
export const useAssetSummary = () => useQuery({ queryKey: ["asset-summary"], queryFn: async () => { const { data } = await api.get("/assets/summary"); return data.data as AssetSummary; }});

export function useCreateAsset() { const qc = useQueryClient(); const { toast } = useToast(); return useMutation({ mutationFn: async (d: Partial<Asset>) => { const { data } = await api.post("/assets", d); return data; }, onSuccess: () => { qc.invalidateQueries({ queryKey: ["assets"] }); toast({ title: "Asset created" }); } }); }
export function useUpdateAsset() { const qc = useQueryClient(); return useMutation({ mutationFn: async ({ id, data: d }: { id: string; data: Partial<Asset> }) => { const { data } = await api.put(`/assets/${id}`, d); return data; }, onSuccess: () => { qc.invalidateQueries({ queryKey: ["assets"] }); } }); }
export function useDeleteAsset() { const qc = useQueryClient(); return useMutation({ mutationFn: async (id: string) => { await api.delete(`/assets/${id}`); }, onSuccess: () => { qc.invalidateQueries({ queryKey: ["assets"] }); } }); }
export function useAssignAsset() { const qc = useQueryClient(); const { toast } = useToast(); return useMutation({ mutationFn: async ({ assetId, userId, notes }: { assetId: string; userId: string; notes?: string }) => { const { data } = await api.post(`/assets/${assetId}/assign`, { userId, notes }); return data; }, onSuccess: () => { qc.invalidateQueries({ queryKey: ["assets"] }); toast({ title: "Asset assigned" }); } }); }
export function useReturnAsset() { const qc = useQueryClient(); const { toast } = useToast(); return useMutation({ mutationFn: async (assetId: string) => { const { data } = await api.post(`/assets/${assetId}/return`); return data; }, onSuccess: () => { qc.invalidateQueries({ queryKey: ["assets"] }); qc.invalidateQueries({ queryKey: ["my-assets"] }); toast({ title: "Asset returned" }); } }); }
