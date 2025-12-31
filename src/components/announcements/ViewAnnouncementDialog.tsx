import ResponsiveDialog from "@/components/ResponsiveDialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Announcement } from "@/hooks/useAnnouncements";
import { formatDistanceToNow, format, isPast } from "date-fns";
import { CalendarDays, User, Building2, Clock } from "lucide-react";

interface ViewAnnouncementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  announcement: Announcement | null;
}

const categoryColors = {
  holiday: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  update: "bg-green-500/10 text-green-700 dark:text-green-400",
  urgent: "bg-red-500/10 text-red-700 dark:text-red-400",
  birthday: "bg-pink-500/10 text-pink-700 dark:text-pink-400",
  hr: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  policy: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
};

const ViewAnnouncementDialog = ({
  open,
  onOpenChange,
  announcement,
}: ViewAnnouncementDialogProps) => {
  if (!announcement) return null;

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={announcement.title}
      description=""
    >
      {/* <h2 className="text-xl font-semibold">{announcement.title}</h2> */}
      <Badge
        variant="secondary"
        className={`mb-2 ${categoryColors[announcement.category]}`}
      >
        {announcement.category}
      </Badge>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>
              {typeof announcement.createdBy === "string"
                ? announcement.createdBy
                : announcement.createdBy.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span>{format(new Date(announcement.createdAt), "PPP")}</span>
            <span className="text-xs">
              (
              {formatDistanceToNow(new Date(announcement.createdAt), {
                addSuffix: true,
              })}
              )
            </span>
          </div>

          {announcement.department && (
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span>{announcement.department.name}</span>
            </div>
          )}

          {announcement.expiresAt && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>
                {isPast(new Date(announcement.expiresAt))
                  ? "Expired on"
                  : "Expires on"}
              </span>
              <span>
                {format(new Date(announcement.expiresAt), "PPP HH:mm")}
              </span>
            </div>
          )}
        </div>

        <Separator />

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-foreground whitespace-pre-wrap">
            {announcement.description}
          </p>
        </div>
      </div>
    </ResponsiveDialog>
  );
};

export default ViewAnnouncementDialog;
