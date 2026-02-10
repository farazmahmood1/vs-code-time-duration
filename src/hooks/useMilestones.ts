import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export interface Milestone {
  userId: string;
  userName: string;
  userImage: string | null;
  type: "BIRTHDAY" | "WORK_ANNIVERSARY";
  eventDate: string;
  detail: string;
  daysUntil?: number;
}

export const useUpcomingMilestones = (days = 30) =>
  useQuery({
    queryKey: ["milestones-upcoming", days],
    queryFn: async () => {
      const { data } = await api.get(`/milestones/upcoming?days=${days}`);
      return data.data as Milestone[];
    },
  });

export const useTodayMilestones = () =>
  useQuery({
    queryKey: ["milestones-today"],
    queryFn: async () => {
      const { data } = await api.get("/milestones/today");
      return data.data as Milestone[];
    },
  });

export function useUpdateUserDates() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({
      userId,
      dateOfBirth,
      joinDate,
    }: {
      userId: string;
      dateOfBirth?: string | null;
      joinDate?: string | null;
    }) => {
      const { data } = await api.put(`/milestones/dates/${userId}`, {
        dateOfBirth,
        joinDate,
      });
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["milestones-upcoming"] });
      qc.invalidateQueries({ queryKey: ["milestones-today"] });
      toast({
        title: "Dates updated",
        description: "User milestone dates have been updated.",
      });
    },
  });
}
