import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import { type Announcement } from "@/hooks/useAnnouncements";
import { formatDistanceToNow } from "date-fns";

interface AnnouncementTableProps {
  announcements: Announcement[];
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

const AnnouncementTable = ({
  announcements,
  onView,
  onEdit,
  onDelete,
}: AnnouncementTableProps) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto w-full ">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {announcements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-muted-foreground">
                      No announcements yet.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Create your first announcement to get started!
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              announcements.map((announcement) => (
                <TableRow
                  key={announcement.id}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell className="font-medium">
                    {announcement.title}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={categoryColors[announcement.category]}
                    >
                      {announcement.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {announcement.department?.name || "All"}
                  </TableCell>
                  <TableCell>
                    {typeof announcement.createdBy === "string"
                      ? announcement.createdBy
                      : announcement.createdBy.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(new Date(announcement.createdAt), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
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
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AnnouncementTable;
