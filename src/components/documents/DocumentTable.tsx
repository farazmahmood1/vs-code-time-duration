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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  useDeleteDocument,
  useAcknowledgeDocument,
  type DocumentItem,
} from "@/hooks/useDocuments";
import { Download, Trash2, CheckCircle2, Clock } from "lucide-react";
import { format } from "date-fns";

interface DocumentTableProps {
  documents: DocumentItem[];
  isAdmin: boolean;
  userId: string;
}

const categoryColors: Record<string, string> = {
  CONTRACT:
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200",
  POLICY:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-purple-200",
  HANDBOOK:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200",
  NDA: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200",
  OTHER_DOCUMENT:
    "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 border-gray-200",
};

const categoryLabels: Record<string, string> = {
  CONTRACT: "Contract",
  POLICY: "Policy",
  HANDBOOK: "Handbook",
  NDA: "NDA",
  OTHER_DOCUMENT: "Other",
};

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function DocumentTable({
  documents,
  isAdmin,
  userId,
}: DocumentTableProps) {
  const deleteMutation = useDeleteDocument();
  const acknowledgeMutation = useAcknowledgeDocument();

  const handleDownload = (doc: DocumentItem) => {
    const link = document.createElement("a");
    link.href = doc.filePath;
    link.download = doc.fileName;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleAcknowledge = (id: string) => {
    acknowledgeMutation.mutate(id);
  };

  if (!documents.length) {
    return (
      <div className="text-center text-muted-foreground py-12">
        No documents found.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Version</TableHead>
          <TableHead>Uploaded By</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Ack Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((doc) => {
          const isAcknowledgedByUser = doc.acknowledgments?.some(
            (ack) => ack.userId === userId
          );
          const ackCount = doc.acknowledgments?.length || 0;

          return (
            <TableRow key={doc.id}>
              <TableCell>
                <div>
                  <span className="font-medium">{doc.title}</span>
                  {doc.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 max-w-[200px] truncate">
                      {doc.description}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={categoryColors[doc.category] || ""}
                >
                  {categoryLabels[doc.category] || doc.category}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-muted-foreground">v{doc.version}</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={doc.uploader?.image || ""} />
                    <AvatarFallback className="text-[10px]">
                      {doc.uploader?.name
                        ?.split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{doc.uploader?.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(doc.createdAt), "MMM d, yyyy")}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {formatFileSize(doc.fileSize)}
                </span>
              </TableCell>
              <TableCell>
                {!doc.requiresAcknowledgment ? (
                  <span className="text-xs text-muted-foreground">N/A</span>
                ) : isAdmin ? (
                  <span className="text-sm">
                    {ackCount} acknowledged
                  </span>
                ) : isAcknowledgedByUser ? (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-xs">Acknowledged</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-amber-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs">Pending</span>
                  </div>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleDownload(doc)}
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(doc.id)}
                      disabled={deleteMutation.isPending}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  {!isAdmin &&
                    doc.requiresAcknowledgment &&
                    !isAcknowledgedByUser && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => handleAcknowledge(doc.id)}
                        disabled={acknowledgeMutation.isPending}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        Acknowledge
                      </Button>
                    )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
