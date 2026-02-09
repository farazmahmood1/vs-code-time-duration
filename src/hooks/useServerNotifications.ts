import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useSocketQueryInvalidation } from "@/hooks/useSocket";

export interface ServerNotification {
  id: string;
  recipientId?: string;
  userId?: string;
  type: "announcement" | "leave" | "check-in" | "check-out";
  title?: string;
  message?: string;
  time?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  data?: {
    announcementId?: string;
    leaveId?: string;
    category?: string;
    department?: string;
    [key: string]: string | undefined;
  };
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

interface GetNotificationsResponse {
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  data: ServerNotification[];
  success?: boolean;
}

interface UnreadCountResponse {
  count: number;
}

const NOTIFICATIONS_KEY = "notifications";
const CHECKINOUT_NOTIFICATIONS_KEY = "checkinout-notifications";

export const useServerNotifications = (
  page: number = 1,
  limit: number = 10
) => {
  // Real-time: invalidate notifications when socket events arrive
  useSocketQueryInvalidation("notification:new", [
    [NOTIFICATIONS_KEY],
    [NOTIFICATIONS_KEY, "unread-count"],
  ]);
  useSocketQueryInvalidation("announcement:new", [
    [NOTIFICATIONS_KEY],
    [NOTIFICATIONS_KEY, "unread-count"],
  ]);
  useSocketQueryInvalidation("leave:statusChanged", [
    [NOTIFICATIONS_KEY],
    [NOTIFICATIONS_KEY, "unread-count"],
  ]);
  useSocketQueryInvalidation("timer:checkin", [
    [NOTIFICATIONS_KEY],
    [NOTIFICATIONS_KEY, "unread-count"],
  ]);
  useSocketQueryInvalidation("timer:checkout", [
    [NOTIFICATIONS_KEY],
    [NOTIFICATIONS_KEY, "unread-count"],
  ]);

  return useQuery<GetNotificationsResponse>({
    queryKey: [NOTIFICATIONS_KEY, page, limit],
    queryFn: async () => {
      try {
        const { data } = await api.get<GetNotificationsResponse>(
          `/notifications?page=${page}&limit=${limit}`
        );
        return data;
      } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error;
      }
    },
    staleTime: 300000, // 5 minutes (socket handles real-time, this is fallback)
  });
};

export const useUnreadCount = () => {
  return useQuery<UnreadCountResponse>({
    queryKey: [NOTIFICATIONS_KEY, "unread-count"],
    queryFn: async () => {
      const { data } = await api.get<UnreadCountResponse>(
        `/notifications/unread-count`
      );
      return data;
    },
    staleTime: 300000, // 5 minutes (socket handles real-time, this is fallback)
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      // Use the unified notifications endpoint for all notification types
      const { data } = await api.patch(`/notifications/${notificationId}/read`);
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_KEY] });
      queryClient.invalidateQueries({
        queryKey: [NOTIFICATIONS_KEY, "unread-count"],
      });
      queryClient.invalidateQueries({
        queryKey: [CHECKINOUT_NOTIFICATIONS_KEY],
      });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Single unified endpoint handles all notification types
      const { data } = await api.patch(`/notifications/read-all`);
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch all notifications queries (including paginated ones)
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_KEY] });
      queryClient.invalidateQueries({
        queryKey: [NOTIFICATIONS_KEY, "unread-count"],
      });
      queryClient.invalidateQueries({
        queryKey: [CHECKINOUT_NOTIFICATIONS_KEY],
      });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      // Use the unified notifications endpoint for all notification types
      await api.delete(`/notifications/${notificationId}`);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_KEY] });
      queryClient.invalidateQueries({
        queryKey: [NOTIFICATIONS_KEY, "unread-count"],
      });
      queryClient.invalidateQueries({
        queryKey: [CHECKINOUT_NOTIFICATIONS_KEY],
      });
    },
  });
};

export const useDeleteAllNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.delete(`/notifications`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_KEY] });
      queryClient.invalidateQueries({
        queryKey: [NOTIFICATIONS_KEY, "unread-count"],
      });
      queryClient.invalidateQueries({
        queryKey: [CHECKINOUT_NOTIFICATIONS_KEY],
      });
    },
  });
};
