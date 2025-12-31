import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bell,
  X,
  CheckCircle,
  LogOut,
  FileText,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { useRole } from "@/hooks/useRole";
import {
  useServerNotifications,
  useMarkNotificationAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
  type ServerNotification,
} from "@/hooks/useServerNotifications";

const notificationConfig = {
  "check-in": {
    icon: CheckCircle,
    gradient: "from-green-500 to-emerald-600",
    bgGradient: "from-green-50 to-emerald-50",
    borderColor: "border-green-200",
    textColor: "text-green-900",
    label: "Check In",
  },
  "check-out": {
    icon: LogOut,
    gradient: "from-blue-500 to-cyan-600",
    bgGradient: "from-blue-50 to-cyan-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-900",
    label: "Check Out",
  },
  announcement: {
    icon: FileText,
    gradient: "from-indigo-500 to-blue-600",
    bgGradient: "from-indigo-50 to-blue-50",
    borderColor: "border-indigo-200",
    textColor: "text-indigo-900",
    label: "Announcement",
  },
  leave: {
    icon: AlertCircle,
    gradient: "from-rose-500 to-red-600",
    bgGradient: "from-rose-50 to-red-50",
    borderColor: "border-rose-200",
    textColor: "text-rose-900",
    label: "Leave",
  },
};

export const NotificationCenter = () => {
  const [open, setOpen] = useState(false);
  const [page] = useState(1);
  const navigate = useNavigate();
  const { isAdmin } = useRole();

  const { data: notificationsData, isLoading: isLoadingNotifications } =
    useServerNotifications(page, 20);
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();
  const deleteNotificationMutation = useDeleteNotification();

  const notifications: ServerNotification[] = notificationsData?.data || [];

  // Filter notifications:
  // - Admins don't see announcements
  // - Employees don't see check-in/check-out notifications (only admins)
  const filteredNotifications = notifications.filter(
    (notification: ServerNotification) => {
      if (isAdmin && notification.type === "announcement") {
        return false;
      }
      if (
        !isAdmin &&
        (notification.type === "check-in" || notification.type === "check-out")
      ) {
        return false;
      }
      return true;
    }
  );

  // Calculate unread count from filtered notifications only
  const unreadCount = filteredNotifications.filter(
    (notification: ServerNotification) => !notification.isRead
  ).length;

  // Function to handle notification click and navigate
  const getRedirectPath = (type: string): string => {
    switch (type) {
      case "announcement":
        return "/announcements";
      case "leave":
        return "/leaves";
      case "check-in":
      case "check-out":
        return "/attendance";
      default:
        return "/";
    }
  };

  const NotificationItem = ({
    notification,
  }: {
    notification: ServerNotification;
  }) => {
    const config =
      notificationConfig[notification.type as keyof typeof notificationConfig];

    // Fallback if config is not found
    if (!config) {
      return null;
    }

    const IconComponent = config.icon;

    // For check-in/check-out notifications, format the title
    let displayTitle = notification.title;
    let displayMessage = notification.message;
    if (
      (notification.type === "check-in" || notification.type === "check-out") &&
      notification.user
    ) {
      const action =
        notification.type === "check-in" ? "checked in" : "checked out";
      const time = notification.time
        ? new Date(notification.time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "";
      displayTitle = `${notification.user.name} ${action} at ${time}`;
    }
    if (notification.type === "leave") {
      displayTitle = undefined;
      // Format dates using date-fns
      if (notification.data?.startDate && notification.data?.endDate) {
        const startDate = new Date(notification.data.startDate);
        const endDate = new Date(notification.data.endDate);

        const fromStr = `${startDate.getDate()} ${format(startDate, "MMM")}`;
        const toStr = `${endDate.getDate()} ${format(endDate, "MMM")}`;
        // Remove the date part from message and keep only the meaningful part
        const cleanedMessage = (notification.message || "")
          .replace(/\d{1,2}\/\d{1,2}\/\d{4}/g, "") // Remove date patterns
          .replace(/from\s+to/i, "") // Remove "from to"
          .replace(/has been/i, "has been") // Normalize
          .trim();
        displayMessage = `${cleanedMessage} (${fromStr} to ${toStr})`;
      } else {
        displayMessage = notification.message;
      }
    }

    const handleMarkAsRead = (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      if (!notification.isRead) {
        markAsReadMutation.mutate(notification.id);
      }
      // Navigate to the appropriate page based on notification type
      const redirectPath = getRedirectPath(notification.type);
      navigate(redirectPath);
    };

    const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      deleteNotificationMutation.mutate(notification.id);
    };

    return (
      <div
        className={`px-4 py-2 rounded-lg border-2 ${config.borderColor} ${config.bgGradient} transition-all hover:shadow-md cursor-pointer`}
        onClick={handleMarkAsRead}
      >
        <div className="flex gap-3">
          {/* Icon with gradient background */}
          <div
            className={`shrink-0 h-9 w-9 rounded-md bg-linear-to-br ${config.gradient} flex items-center justify-center mt-1`}
          >
            <IconComponent className="h-[18px] w-[18px] text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className={`font-semibold text-sm ${config.textColor}`}>
                    {config.label}
                  </h4>
                  {!notification.isRead && (
                    <span
                      className={`h-2 w-2 rounded-full bg-linear-to-r ${config.gradient}`}
                    ></span>
                  )}
                </div>
                {notification.type === "leave" ? (
                  <p className={`text-xs ${config.textColor} opacity-75 mt-1`}>
                    {displayMessage || notification.message}
                  </p>
                ) : (
                  <>
                    <p
                      className={`text-xs ${config.textColor} opacity-75 mt-1`}
                    >
                      {displayTitle}
                    </p>
                    {notification.type !== "announcement" &&
                      notification.type !== "check-in" &&
                      notification.type !== "check-out" &&
                      displayMessage && (
                        <p
                          className={`text-xs ${config.textColor} opacity-60 mt-0.5`}
                        >
                          {displayMessage}
                        </p>
                      )}
                  </>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                onClick={handleDelete}
                disabled={deleteNotificationMutation.isPending}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Footer with timestamp */}
            <div className="flex items-center justify-between mt-2">
              <span className={`text-xs ${config.textColor} opacity-60`}>
                {format(new Date(notification.createdAt), "MMM dd, hh:mm a")}
              </span>
              {notification.data?.category && (
                <span
                  className={`text-xs font-medium px-2 py-1 rounded ${config.bgGradient} ${config.textColor}`}
                >
                  {notification.data.category}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5! w-5!" />
          {unreadCount > 0 && (
            <span
              className={`absolute top-0 right-1 w-4 h-4 ${
                unreadCount > 9 ? "text-[9px]" : "text-xs"
              } bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-light`}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-96 p-0 overflow-hidden" align="end">
        <div className="flex flex-col max-h-[520px]">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b p-4 shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Notifications</h2>
              <span className="text-sm text-muted-foreground">
                {unreadCount} unread
              </span>
            </div>
          </div>

          {/* Notifications List */}
          {isLoadingNotifications ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
              <p className="text-sm text-muted-foreground mt-2">Loading...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Bell className="h-10 w-10 text-muted-foreground mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          ) : (
            <ScrollArea className="h-[400px] w-full">
              <div className={`p-3 space-y-2 `}>
                {filteredNotifications.map(
                  (notification: ServerNotification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                    />
                  )
                )}
              </div>
            </ScrollArea>
          )}
          {unreadCount > 0 && (
            <div className="p-3 w-full border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => markAllAsReadMutation.mutate()}
                className="w-full text-xs"
                disabled={markAllAsReadMutation.isPending}
              >
                {markAllAsReadMutation.isPending ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                    Marking...
                  </>
                ) : (
                  "Mark all as read"
                )}
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
