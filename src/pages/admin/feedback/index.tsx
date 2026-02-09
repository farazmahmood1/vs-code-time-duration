import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAllFeedback, useReplyToFeedback, useUpdateFeedbackStatus } from "@/hooks/useFeedback";
import { format } from "date-fns";
import { Loader2, MessageSquare } from "lucide-react";
import { useState } from "react";

const STATUS_COLORS: Record<string, "default" | "secondary" | "destructive" | "outline"> = { NEW: "destructive", REVIEWED: "secondary", IN_PROGRESS: "default", RESOLVED: "outline", CLOSED: "outline" };
const CATEGORY_COLORS: Record<string, string> = { SUGGESTION: "text-blue-600", COMPLAINT: "text-red-600", APPRECIATION: "text-green-600", BUG_REPORT: "text-orange-600", OTHER: "text-gray-600" };

export default function AdminFeedback() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const { data, isLoading } = useAllFeedback({ status: statusFilter });
  const replyMutation = useReplyToFeedback();
  const statusMutation = useUpdateFeedbackStatus();
  const [replyDialog, setReplyDialog] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [reply, setReply] = useState("");

  const records = data?.data || [];

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold tracking-tight">Feedback & Suggestions</h1><p className="text-muted-foreground">Review and respond to employee feedback</p></div>

      <div className="flex items-center gap-2">
        <select className="rounded-md border border-input bg-background px-3 py-1.5 text-sm" value={statusFilter || ""} onChange={e => setStatusFilter(e.target.value || undefined)}>
          <option value="">All Status</option>
          <option value="NEW">New</option><option value="REVIEWED">Reviewed</option><option value="IN_PROGRESS">In Progress</option><option value="RESOLVED">Resolved</option><option value="CLOSED">Closed</option>
        </select>
      </div>

      {isLoading ? (<div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>) : !records.length ? (
        <div className="rounded-lg border p-8 text-center"><MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-3" /><p className="text-muted-foreground">No feedback found.</p></div>
      ) : (
        <div className="rounded-md border"><Table>
          <TableHeader><TableRow><TableHead>From</TableHead><TableHead>Category</TableHead><TableHead>Title</TableHead><TableHead>Message</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>{records.map(f => (
            <TableRow key={f.id}>
              <TableCell>{f.isAnonymous ? <span className="italic text-muted-foreground">Anonymous</span> : f.user?.name || "—"}</TableCell>
              <TableCell><span className={CATEGORY_COLORS[f.category]}>{f.category}</span></TableCell>
              <TableCell className="font-medium">{f.title}</TableCell>
              <TableCell className="max-w-[200px] truncate">{f.message}</TableCell>
              <TableCell><Badge variant={STATUS_COLORS[f.status]}>{f.status}</Badge></TableCell>
              <TableCell className="text-sm text-muted-foreground">{format(new Date(f.createdAt), "MMM dd")}</TableCell>
              <TableCell className="text-right space-x-1">
                {f.status === "NEW" && <Button size="sm" variant="outline" onClick={() => statusMutation.mutate({ id: f.id, status: "REVIEWED" })}>Mark Reviewed</Button>}
                <Button size="sm" variant="outline" onClick={() => { setReplyDialog({ open: true, id: f.id }); setReply(f.adminReply || ""); }}>Reply</Button>
              </TableCell>
            </TableRow>
          ))}</TableBody>
        </Table></div>
      )}

      <Dialog open={replyDialog.open} onOpenChange={o => { if (!o) setReplyDialog({ open: false, id: null }); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reply to Feedback</DialogTitle></DialogHeader>
          <div><Label>Reply</Label><Textarea value={reply} onChange={e => setReply(e.target.value)} rows={3} /></div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReplyDialog({ open: false, id: null })}>Cancel</Button>
            <Button onClick={() => { if (replyDialog.id) replyMutation.mutate({ id: replyDialog.id, adminReply: reply }, { onSuccess: () => setReplyDialog({ open: false, id: null }) }); }} disabled={replyMutation.isPending || !reply}>
              {replyMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Send Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
