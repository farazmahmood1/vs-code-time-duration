import { useState, useCallback, useEffect } from "react";

export type NotificationType =
  | "check-in"
  | "check-out"
  | "break"
  | "pause"
  | "announcement"
  | "leave"
  | "alert";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: Date;
  read: boolean;
  relatedTo?: {
    type: "user" | "announcement" | "leave";
    id: string;
    name: string;
  };
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp" | "read">
  ) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

// In-memory storage for dummy data
let notificationStore: Notification[] = [
  {
    id: "1",
    type: "check-in",
    message: "John Doe checked in at 9:00 AM",
    timestamp: new Date(Date.now() - 5 * 60000),
    read: false,
    relatedTo: { type: "user", id: "user1", name: "John Doe" },
  },
  {
    id: "2",
    type: "check-out",
    message: "Jane Smith checked out at 5:30 PM",
    timestamp: new Date(Date.now() - 20 * 60000),
    read: false,
    relatedTo: { type: "user", id: "user2", name: "Jane Smith" },
  },
  // {
  //   id: "3",
  //   type: "break",
  //   title: "Break Started",
  //   message: "Mike Johnson started a break",
  //   timestamp: new Date(Date.now() - 45 * 60000),
  //   read: false,
  //   relatedTo: { type: "user", id: "user3", name: "Mike Johnson" },
  // },
  // {
  //   id: "4",
  //   type: "pause",
  //   title: "Tracker Paused",
  //   message: "Sarah Wilson paused the tracker",
  //   timestamp: new Date(Date.now() - 60 * 60000),
  //   read: false,
  //   relatedTo: { type: "user", id: "user4", name: "Sarah Wilson" },
  // },
  {
    id: "5",
    type: "announcement",
    message: "Company Holiday Schedule for 2025 has been announced",
    timestamp: new Date(Date.now() - 120 * 60000),
    read: false,
    relatedTo: { type: "announcement", id: "ann1", name: "Holiday Schedule" },
  },
  {
    id: "6",
    type: "leave",
    message: "Your leave request for Dec 20-25 has been approved",
    timestamp: new Date(Date.now() - 240 * 60000),
    read: false,
    relatedTo: { type: "leave", id: "leave1", name: "Annual Leave" },
  },
];

let notificationListeners: Array<() => void> = [];

const notifyListeners = () => {
  notificationListeners.forEach((listener) => listener());
};

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] =
    useState<Notification[]>(notificationStore);

  useEffect(() => {
    const handleUpdate = () => {
      setNotifications([...notificationStore]);
    };

    notificationListeners.push(handleUpdate);

    return () => {
      notificationListeners = notificationListeners.filter(
        (listener) => listener !== handleUpdate
      );
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
      const newNotification: Notification = {
        ...notification,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        read: false,
      };

      notificationStore = [newNotification, ...notificationStore];
      setNotifications([...notificationStore]);
      notifyListeners();
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    notificationStore = notificationStore.filter((n) => n.id !== id);
    setNotifications([...notificationStore]);
    notifyListeners();
  }, []);

  const markAsRead = useCallback((id: string) => {
    notificationStore = notificationStore.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications([...notificationStore]);
    notifyListeners();
  }, []);

  const markAllAsRead = useCallback(() => {
    notificationStore = notificationStore.map((n) => ({ ...n, read: true }));
    setNotifications([...notificationStore]);
    notifyListeners();
  }, []);

  const clearAll = useCallback(() => {
    notificationStore = [];
    setNotifications([]);
    notifyListeners();
  }, []);

  return {
    notifications,
    unreadCount,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
  };
};

/**
 * Helper function to create a check-in notification
 */
export const createCheckInNotification = (
  employeeName: string,
  time: string
) => {
  return {
    type: "check-in" as const,
    title: "Check In Successful",
    message: `${employeeName} checked in at ${time}`,
    relatedTo: {
      type: "user" as const,
      id: `user-${Date.now()}`,
      name: employeeName,
    },
  };
};

/**
 * Helper function to create a check-out notification
 */
export const createCheckOutNotification = (
  employeeName: string,
  time: string
) => {
  return {
    type: "check-out" as const,
    title: "Check Out Recorded",
    message: `${employeeName} checked out at ${time}`,
    relatedTo: {
      type: "user" as const,
      id: `user-${Date.now()}`,
      name: employeeName,
    },
  };
};

/**
 * Helper function to create a break notification
 */
export const createBreakNotification = (employeeName: string) => {
  return {
    type: "break" as const,
    title: "Break Started",
    message: `${employeeName} started a break`,
    relatedTo: {
      type: "user" as const,
      id: `user-${Date.now()}`,
      name: employeeName,
    },
  };
};

/**
 * Helper function to create a pause notification
 */
export const createPauseNotification = (
  employeeName: string
  //   reason: string
) => {
  return {
    type: "pause" as const,
    title: "Tracker Paused",
    message: `${employeeName} paused the tracker}`,
    relatedTo: {
      type: "user" as const,
      id: `user-${Date.now()}`,
      name: employeeName,
    },
  };
};

/**
 * Helper function to create an announcement notification
 */
export const createAnnouncementNotification = (
  title: string,
  message: string,
  announcementName: string
) => {
  return {
    type: "announcement" as const,
    title,
    message,
    relatedTo: {
      type: "announcement" as const,
      id: `ann-${Date.now()}`,
      name: announcementName,
    },
  };
};

/**
 * Helper function to create a leave notification
 */
export const createLeaveNotification = (
  title: string,
  message: string,
  leaveType: string
) => {
  return {
    type: "leave" as const,
    title,
    message,
    relatedTo: {
      type: "leave" as const,
      id: `leave-${Date.now()}`,
      name: leaveType,
    },
  };
};

/**
 * Helper function to create an alert notification
 */
export const createAlertNotification = (title: string, message: string) => {
  return {
    type: "alert" as const,
    title,
    message,
  };
};
