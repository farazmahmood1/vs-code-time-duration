import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useAllRegularizations,
  useApproveRegularization,
  type AttendanceRegularization,
} from "@/hooks/useRegularization";
import { useRole } from "@/hooks/useRole";
import { format } from "date-fns";
import { Check, Loader2, X } from "lucide-react";
import { useState } from "react";
import RegularizationForm from "./RegularizationForm";

const TYPE_LABELS: Record<string, string> = {
  MISSED_CHECKIN: "Missed Check-in",
  MISSED_CHECKOUT: "Missed Check-out",
  WRONG_TIME: "Wrong Time",
};

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "secondary",
  APPROVED: "default",
  REJECTED: "destructive",
};

export default function RegularizationTable() {
  const { isAdmin } = useRole();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  const { data, isLoading } = useAllRegularizations({
    page,
    limit: 15,
    status: statusFilter,
  });

  const approveMutation = useApproveRegularization();

  const [approvalDialog, setApprovalDialog] = useState<{
    open: boolean;
    item: AttendanceRegularization | null;
    action: "APPROVED" | "REJECTED";
  }>({ open: false, item: null, action: "APPROVED" });
  const [adminNote, setAdminNote] = useState("");

  const handleApproval = () => {
    if (!approvalDialog.item) return;
    approveMutation.mutate(
      {
        id: approvalDialog.item.id,
        data: { status: approvalDialog.action, adminNote: adminNote || undefined },
      },
      {
        onSuccess: () => {
          setApprovalDialog({ open: false, item: null, action: "APPROVED" });
          setAdminNote("");
        },
      }
    );
  };

  const records = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Regularization Requests</h3>
          {meta && (
            <Badge variant="outline">{meta.total} total</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <select
            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
            value={statusFilter || ""}
            onChange={(e) => {
              setStatusFilter(e.target.value || undefined);
              setPage(1);
            }}
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
          {!isAdmin && <RegularizationForm />}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : records.length === 0 ? (
        <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
          No regularization requests found.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {isAdmin && <TableHead>Employee</TableHead>}
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Requested Time</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                {isAdmin && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  {isAdmin && (
                    <TableCell className="font-medium">
                      {record.user?.name || "—"}
                    </TableCell>
                  )}
                  <TableCell>
                    {format(new Date(record.date), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {TYPE_LABELS[record.type] || record.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(record.requestedTime), "hh:mm a")}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {record.reason}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANTS[record.status] || "secondary"}>
                      {record.status}
                    </Badge>
                    {record.approver && (
                      <span className="ml-1 text-xs text-muted-foreground">
                        by {record.approver.name}
                      </span>
                    )}
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      {record.status === "PENDING" && (
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() =>
                              setApprovalDialog({
                                open: true,
                                item: record,
                                action: "APPROVED",
                              })
                            }
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() =>
                              setApprovalDialog({
                                open: true,
                                item: record,
                                action: "REJECTED",
                              })
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      {record.adminNote && (
                        <p className="text-xs text-muted-foreground mt-1 truncate max-w-[150px]">
                          {record.adminNote}
                        </p>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {meta.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Approval Dialog */}
      <Dialog
        open={approvalDialog.open}
        onOpenChange={(open) => {
          if (!open) {
            setApprovalDialog({ open: false, item: null, action: "APPROVED" });
            setAdminNote("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {approvalDialog.action === "APPROVED"
                ? "Approve Regularization"
                : "Reject Regularization"}
            </DialogTitle>
            <DialogDescription>
              {approvalDialog.item && (
                <>
                  {approvalDialog.item.user?.name} —{" "}
                  {TYPE_LABELS[approvalDialog.item.type]} on{" "}
                  {format(new Date(approvalDialog.item.date), "MMM dd, yyyy")}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {approvalDialog.item && (
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium">Reason: </span>
                {approvalDialog.item.reason}
              </div>
              <div>
                <span className="font-medium">Requested Time: </span>
                {format(new Date(approvalDialog.item.requestedTime), "hh:mm a")}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Admin Note (optional)</Label>
            <Textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Add a note..."
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setApprovalDialog({ open: false, item: null, action: "APPROVED" });
                setAdminNote("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant={approvalDialog.action === "APPROVED" ? "default" : "destructive"}
              onClick={handleApproval}
              disabled={approveMutation.isPending}
            >
              {approveMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              {approvalDialog.action === "APPROVED" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
