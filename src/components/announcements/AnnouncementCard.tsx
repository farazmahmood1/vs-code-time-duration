import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import { type Announcement } from "@/hooks/useAnnouncements";
import { formatDistanceToNow } from "date-fns";

interface AnnouncementCardProps {
  announcement: Announcement;
  onView: (announcement: Announcement) => void;
  onEdit: (announcement: Announcement) => void;
  onDelete: (id: string) => void;
}

const categoryColors = {
  holiday: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  update: "bg-green-500/10 text-green-700 dark:text-green-400",
  urgent: "bg-red-500/10 text-red-700 dark:text-red-400",
  birthday: "bg-pink-500/10 text-pink-700 dark:text-pink-400",
  hr: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  policy: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
};

const AnnouncementCard = ({
  announcement,
  onView,
  onEdit,
  onDelete,
}: AnnouncementCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg">{announcement.title}</CardTitle>
            <CardDescription className="mt-1">
              {typeof announcement.createdBy === "string"
                ? announcement.createdBy
                : announcement.createdBy.name}{" "}
              •{" "}
              {formatDistanceToNow(new Date(announcement.createdAt), {
                addSuffix: true,
              })}
            </CardDescription>
          </div>
          <Badge
            variant="secondary"
            className={categoryColors[announcement.category]}
          >
            {announcement.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {announcement.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {announcement.department?.name || "All"}
          </span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onView(announcement)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(announcement)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(announcement.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnnouncementCard;
