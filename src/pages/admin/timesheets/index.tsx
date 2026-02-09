import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  useAllTimesheetSubmissions,
  useApproveTimesheetSubmission,
  type TimesheetSubmission,
} from "@/hooks/useTimesheetSubmissions";
import { format } from "date-fns";
import { Check, ChevronDown, ChevronUp, FileSpreadsheet, Loader2, X } from "lucide-react";
import { useState } from "react";

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive"> = {
  PENDING: "secondary",
  APPROVED: "default",
  REJECTED: "destructive",
};

export default function AdminTimesheets() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data, isLoading } = useAllTimesheetSubmissions({
    page,
    limit: 15,
    status: statusFilter,
  });

  const approveMutation = useApproveTimesheetSubmission();

  const [approvalDialog, setApprovalDialog] = useState<{
    open: boolean;
    item: TimesheetSubmission | null;
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

  // Stats
  const pendingCount = records.filter((r) => r.status === "PENDING").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Timesheets</h1>
          <p className="text-muted-foreground">
            Review and approve employee timesheet submissions
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meta?.total || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Page
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {page} / {meta?.totalPages || 1}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
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
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : records.length === 0 ? (
        <div className="rounded-lg border bg-card p-8 text-center">
          <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="font-semibold">No submissions</h3>
          <p className="text-sm text-muted-foreground mt-1">
            No timesheet submissions found.
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Week</TableHead>
                <TableHead>Total Hours</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <>
                  <TableRow key={record.id}>
                    <TableCell>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() =>
                          setExpandedId(expandedId === record.id ? null : record.id)
                        }
                      >
                        {expandedId === record.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">
                      {record.user?.name || "—"}
                    </TableCell>
                    <TableCell>
                      {format(new Date(record.weekStart), "MMM dd")} –{" "}
                      {format(new Date(record.weekEnd), "MMM dd")}
                    </TableCell>
                    <TableCell>{record.totalHours}h</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANTS[record.status]}>
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(record.submittedAt), "MMM dd, yyyy")}
                    </TableCell>
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
                    </TableCell>
                  </TableRow>
                  {expandedId === record.id && (
                    <TableRow key={`${record.id}-detail`}>
                      <TableCell colSpan={7} className="bg-muted/30 p-4">
                        <div className="rounded-md border bg-background">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Day</TableHead>
                                <TableHead>Project</TableHead>
                                <TableHead>Hours</TableHead>
                                <TableHead>Description</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {record.entries.map((entry) => (
                                <TableRow key={entry.id}>
                                  <TableCell>
                                    {format(new Date(entry.date), "EEE, MMM dd")}
                                  </TableCell>
                                  <TableCell>
                                    {entry.project?.name || "—"}
                                  </TableCell>
                                  <TableCell>{entry.hours}h</TableCell>
                                  <TableCell className="max-w-[300px] truncate">
                                    {entry.description || "—"}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                        {record.adminNote && (
                          <p className="mt-2 text-sm text-muted-foreground">
                            Admin note: {record.adminNote}
                          </p>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </>
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
                ? "Approve Timesheet"
                : "Reject Timesheet"}
            </DialogTitle>
            <DialogDescription>
              {approvalDialog.item && (
                <>
                  {approvalDialog.item.user?.name} — Week of{" "}
                  {format(new Date(approvalDialog.item.weekStart), "MMM dd, yyyy")} (
                  {approvalDialog.item.totalHours}h)
                </>
              )}
            </DialogDescription>
          </DialogHeader>

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
