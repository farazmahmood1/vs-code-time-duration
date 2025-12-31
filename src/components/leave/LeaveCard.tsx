import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, Calendar, Clock, Check, X } from "lucide-react";
import { ApprovalDialog } from "@/components/leave/ApprovalDialog";
import { format } from "date-fns";
import { type Leave } from "@/hooks/useLeaveData";
import { useSession } from "@/lib/auth-client";
import { useState } from "react";

interface LeaveCardProps {
  leave: Leave;
  onView: (leave: Leave) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, status: string, approvalNotes?: string) => void;
}

export const LeaveCard = ({
  leave,
  onView,
  onDelete,
  onStatusChange,
}: LeaveCardProps) => {
  const { data: session } = useSession();
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"APPROVE" | "REJECT">("APPROVE");

  const handleApproveClick = () => {
    setActionType("APPROVE");
    setApprovalDialogOpen(true);
  };

  const handleRejectClick = () => {
    setActionType("REJECT");
    setApprovalDialogOpen(true);
  };

  const handleApprovalConfirm = (leaveId: string, notes: string) => {
    const status = actionType === "APPROVE" ? "APPROVED" : "REJECTED";
    onStatusChange?.(leaveId, status, notes);
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg">{leave.employee.name}</h3>
            <Badge
              className={
                leave.status === "APPROVED"
                  ? "bg-green-500 hover:bg-green-600"
                  : leave.status === "REJECTED"
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }
            >
              {leave.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Type:</span>
              <span className="text-muted-foreground">
                {leave.leaveType.replace(/_/g, " ")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {format(new Date(leave.startDate), "MMM dd")} –{" "}
                {format(new Date(leave.endDate), "MMM dd, yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {leave.duration} days
              </span>
            </div>
          </div>

          {leave.reason && (
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                <span className="font-bold">Reason:</span> {leave.reason}
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onView(leave)}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            {session?.user.role === "admin" && leave.status === "PENDING" && (
              <>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleApproveClick}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleRejectClick}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(leave.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <ApprovalDialog
        open={approvalDialogOpen}
        onOpenChange={setApprovalDialogOpen}
        leaveId={leave.id}
        employeeName={leave.employee.name}
        actionType={actionType}
        onConfirm={handleApprovalConfirm}
      />
    </>
  );
};
