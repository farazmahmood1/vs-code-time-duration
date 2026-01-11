import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { ActivitySession } from "@/types/activity";

export const useActivitySession = (sessionId: string) => {
    return useQuery<ActivitySession>({
        queryKey: ["activity-session", sessionId],
        queryFn: async () => {
            const response = await api.get(`/timer/sessions/${sessionId}`);
            return response.data;
        },
        enabled: !!sessionId,
    });
};

export const useEmployeeSessions = (employeeId: string, date: Date) => {
    return useQuery<ActivitySession[]>({
        queryKey: ["employee-sessions", employeeId, date],
        queryFn: async () => {
            const params = new URLSearchParams();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            params.append("date", `${year}-${month}-${day}`);

            const response = await api.get(`/timer/sessions/employee/${employeeId}?${params.toString()}`);
            return response.data.data; // Extract data from nested response
        },
        enabled: !!employeeId,
    });
};
