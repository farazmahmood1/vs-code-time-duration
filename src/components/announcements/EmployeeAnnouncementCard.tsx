import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { type Announcement } from "@/hooks/useEmployeeAnnouncements";
import { formatDistanceToNow } from "date-fns";
import { Calendar, User } from "lucide-react";
import { useState } from "react";
import ViewAnnouncementDialog from "./ViewAnnouncementDialog";

interface EmployeeAnnouncementCardProps {
  announcement: Announcement;
}

const categoryColors: Record<
  string,
  { bg: string; badge: string; icon: string }
> = {
  holiday: {
    bg: "bg-gradient-to-br from-blue-50 to-blue-100",
    badge: "bg-blue-100 text-blue-700",
    icon: "text-blue-600",
  },
  update: {
    bg: "bg-gradient-to-br from-green-50 to-green-100",
    badge: "bg-green-100 text-green-700",
    icon: "text-green-600",
  },
  urgent: {
    bg: "bg-gradient-to-br from-red-50 to-red-100",
    badge: "bg-red-100 text-red-700",
    icon: "text-red-600",
  },
  birthday: {
    bg: "bg-gradient-to-br from-pink-50 to-pink-100",
    badge: "bg-pink-100 text-pink-700",
    icon: "text-pink-600",
  },
  policy: {
    bg: "bg-gradient-to-br from-orange-50 to-orange-100",
    badge: "bg-orange-100 text-orange-700",
    icon: "text-orange-600",
  },
};

export default function EmployeeAnnouncementCard({
  announcement,
}: EmployeeAnnouncementCardProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const colors = categoryColors[announcement.category] || categoryColors.update;
  const isLongDescription = announcement.description.length > 120;

  return (
    <>
      <Card className={` p-6 border-0 hover:shadow-lg transition-shadow`}>
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">
                {announcement.title}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                <div className="flex items-center gap-1">
                  <User className={`h-4 w-4 ${colors.icon}`} />
                  <span>{announcement.createdBy?.name || "Admin"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className={`h-4 w-4 ${colors.icon}`} />
                  <span>
                    {formatDistanceToNow(new Date(announcement.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            </div>
            <Badge className={`${colors.badge} border-0 whitespace-nowrap`}>
              {announcement.category.charAt(0).toUpperCase() +
                announcement.category.slice(1)}
            </Badge>
          </div>

          <p className="text-gray-700 leading-relaxed">
            {isLongDescription ? (
              <>
                {announcement.description.slice(0, 120)}...
                <span
                  onClick={() => setOpenDialog(true)}
                  className="text-blue-600 cursor-pointer ml-1 hover:underline text-sm"
                >
                  Show more
                </span>
              </>
            ) : (
              announcement.description
            )}
          </p>
        </div>
      </Card>

      <ViewAnnouncementDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        announcement={announcement}
      />
    </>
  );
}
