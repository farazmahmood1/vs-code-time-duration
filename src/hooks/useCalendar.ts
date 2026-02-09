import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export interface Holiday {
  id: string;
  name: string;
  date: string;
  isOptional: boolean;
  createdAt: string;
}

export interface CalendarLeave {
  id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  duration: number;
  employee: {
    id: string;
    name: string;
    image?: string;
    department?: { name: string };
  };
}

export interface CalendarData {
  holidays: Holiday[];
  leaves: CalendarLeave[];
}

export const useCalendarData = (year: number, month: number) =>
  useQuery({
    queryKey: ["calendar", year, month],
    queryFn: async () => {
      const { data } = await api.get(
        `/calendar?year=${year}&month=${month}`
      );
      return data.data as CalendarData;
    },
  });

export const useHolidays = (year?: number) =>
  useQuery({
    queryKey: ["holidays", year],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (year) sp.set("year", String(year));
      const { data } = await api.get(`/calendar/holidays?${sp.toString()}`);
      return data.data as Holiday[];
    },
  });

export function useCreateHoliday() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (d: {
      name: string;
      date: string;
      isOptional?: boolean;
    }) => {
      const { data } = await api.post("/calendar/holidays", d);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["holidays"] });
      qc.invalidateQueries({ queryKey: ["calendar"] });
      toast({ title: "Holiday created" });
    },
    onError: (e: any) => {
      toast({
        title: "Error",
        description: e?.response?.data?.message || "Failed",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateHoliday() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...d
    }: {
      id: string;
      name?: string;
      date?: string;
      isOptional?: boolean;
    }) => {
      const { data } = await api.put(`/calendar/holidays/${id}`, d);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["holidays"] });
      qc.invalidateQueries({ queryKey: ["calendar"] });
    },
  });
}

export function useDeleteHoliday() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/calendar/holidays/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["holidays"] });
      qc.invalidateQueries({ queryKey: ["calendar"] });
      toast({ title: "Holiday deleted" });
    },
  });
}
