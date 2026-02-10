import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receiptUrl?: string;
  receiptFileName?: string;
}

export default function ReceiptPreviewDialog({
  open,
  onOpenChange,
  receiptUrl,
  receiptFileName,
}: Props) {
  if (!receiptUrl) return null;

  const serverUrl = import.meta.env.VITE_SERVER_URL?.replace(/\/$/, "") || "";
  const fullUrl = receiptUrl.startsWith("http")
    ? receiptUrl
    : `${serverUrl}${receiptUrl}`;
  const isPdf = receiptUrl.toLowerCase().endsWith(".pdf");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Receipt: {receiptFileName || "Preview"}</span>
            <Button
              size="sm"
              variant="ghost"
              className="gap-1"
              onClick={() => window.open(fullUrl, "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
              Open
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-auto max-h-[60vh]">
          {isPdf ? (
            <iframe
              src={fullUrl}
              className="w-full h-[500px] rounded border"
              title="Receipt PDF"
            />
          ) : (
            <img
              src={fullUrl}
              alt={receiptFileName || "Receipt"}
              className="w-full rounded border object-contain max-h-[500px]"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
