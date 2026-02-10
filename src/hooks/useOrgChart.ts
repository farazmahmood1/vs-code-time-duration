import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export interface OrgChartNode {
  id: string;
  name: string;
  email: string;
  image?: string;
  role?: string;
  managerId?: string;
  department?: { id: string; name: string } | null;
  children: OrgChartNode[];
}

export const useOrgChart = () =>
  useQuery({
    queryKey: ["org-chart"],
    queryFn: async () => {
      const { data } = await api.get("/org-chart");
      return data.data as OrgChartNode[];
    },
  });

export function useSetManager() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({
      userId,
      managerId,
    }: {
      userId: string;
      managerId: string | null;
    }) => {
      const { data } = await api.patch(`/org-chart/${userId}/manager`, {
        managerId,
      });
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["org-chart"] });
      toast({ title: "Manager updated" });
    },
  });
}
