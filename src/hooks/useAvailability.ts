import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export interface AvailabilitySlot {
  id: string;
  userId: string;
  dayOfWeek: number; // 0=Sunday .. 6=Saturday
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export const useMyAvailability = () =>
  useQuery({
    queryKey: ["availability", "my"],
    queryFn: async () => {
      const { data } = await api.get("/shifts/availability/me");
      return data.data as AvailabilitySlot[];
    },
  });

export const useEmployeeAvailability = (employeeId: string) =>
  useQuery({
    queryKey: ["availability", employeeId],
    queryFn: async () => {
      const { data } = await api.get(
        `/shifts/availability/employee/${employeeId}`
      );
      return data.data as AvailabilitySlot[];
    },
    enabled: !!employeeId,
  });

export const useDepartmentAvailability = (departmentId: string) =>
  useQuery({
    queryKey: ["availability", "department", departmentId],
    queryFn: async () => {
      const { data } = await api.get(
        `/shifts/availability/department/${departmentId}`
      );
      return data.data as {
        id: string;
        name: string;
        image?: string;
        availability: AvailabilitySlot[];
      }[];
    },
    enabled: !!departmentId,
  });

export function useUpdateMyAvailability() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (
      slots: {
        dayOfWeek: number;
        startTime: string;
        endTime: string;
        isAvailable: boolean;
      }[]
    ) => {
      const { data } = await api.put("/shifts/availability/me", { slots });
      return data.data as AvailabilitySlot[];
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["availability"] });
      toast({ title: "Availability updated" });
    },
  });
}
