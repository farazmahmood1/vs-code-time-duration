import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export interface SwapRequest {
  id: string;
  requesterId: string;
  requester: { id: string; name: string; image?: string };
  requesterScheduleId: string;
  targetEmployeeId: string;
  targetEmployee: { id: string; name: string; image?: string };
  targetScheduleId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reason?: string;
  adminNote?: string;
  reviewer?: { id: string; name: string };
  reviewedAt?: string;
  createdAt: string;
}

export const useSwapRequests = (params?: { status?: string; page?: number }) =>
  useQuery({
    queryKey: ["shift-swaps", params],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (params?.status) sp.set("status", params.status);
      if (params?.page) sp.set("page", String(params.page));
      const { data } = await api.get(`/shifts/swaps?${sp.toString()}`);
      return data as {
        data: SwapRequest[];
        meta: { page: number; total: number; totalPages: number };
      };
    },
  });

export const useMySwapRequests = () =>
  useQuery({
    queryKey: ["shift-swaps", "my"],
    queryFn: async () => {
      const { data } = await api.get("/shifts/swaps/my");
      return data.data as SwapRequest[];
    },
  });

export function useCreateSwapRequest() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: {
      requesterScheduleId: string;
      targetEmployeeId: string;
      targetScheduleId: string;
      reason?: string;
    }) => {
      const { data: res } = await api.post("/shifts/swaps", data);
      return res.data as SwapRequest;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["shift-swaps"] });
      toast({ title: "Swap request submitted" });
    },
  });
}

export function useRespondToSwapRequest() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({
      id,
      status,
      adminNote,
    }: {
      id: string;
      status: "APPROVED" | "REJECTED";
      adminNote?: string;
    }) => {
      const { data } = await api.patch(`/shifts/swaps/${id}`, {
        status,
        adminNote,
      });
      return data.data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["shift-swaps"] });
      qc.invalidateQueries({ queryKey: ["shift-schedule"] });
      toast({
        title: `Swap request ${vars.status === "APPROVED" ? "approved" : "rejected"}`,
      });
    },
  });
}
