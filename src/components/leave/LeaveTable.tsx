import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ApprovalDialog } from "@/components/leave/ApprovalDialog";
import { type Leave } from "@/hooks/useLeaveData";
import { format } from "date-fns";
import { Eye, Trash2, Check, X } from "lucide-react";
import { useState } from "react";

interface LeaveTableProps {
  leaves: Leave[];
  onView: (leave: Leave) => void;
  onStatusChange: (id: string, status: string, approvalNotes?: string) => void;
  onDelete: (id: string) => void;
}

export const LeaveTable = ({
  leaves,
  onView,
  onStatusChange,
  onDelete,
}: LeaveTableProps) => {
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [actionType, setActionType] = useState<"APPROVE" | "REJECT">("APPROVE");

  const handleApproveClick = (leave: Leave) => {
    setSelectedLeave(leave);
    setActionType("APPROVE");
    setApprovalDialogOpen(true);
  };

  const handleRejectClick = (leave: Leave) => {
    setSelectedLeave(leave);
    setActionType("REJECT");
    setApprovalDialogOpen(true);
  };

  const handleApprovalConfirm = (leaveId: string, notes: string) => {
    const status = actionType === "APPROVE" ? "APPROVED" : "REJECTED";
    onStatusChange(leaveId, status, notes);
  };

  return (
    <>
      <ScrollArea className="border rounded-lg">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Leave Type</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applied Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaves.map((leave) => (
              <TableRow key={leave.id}>
                <TableCell>{leave.employee.name}</TableCell>
                <TableCell>{leave.leaveType.replace(/_/g, " ")}</TableCell>
                <TableCell>{leave.duration} days</TableCell>
                <TableCell>{format(new Date(leave.startDate), "PP")}</TableCell>
                <TableCell>{format(new Date(leave.endDate), "PP")}</TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>{format(new Date(leave.createdAt), "PP")}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    {leave.status === "PENDING" && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleApproveClick(leave)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRejectClick(leave)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(leave)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(leave.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {selectedLeave && (
        <ApprovalDialog
          open={approvalDialogOpen}
          onOpenChange={setApprovalDialogOpen}
          leaveId={selectedLeave.id}
          employeeName={selectedLeave.employee.name}
          actionType={actionType}
          onConfirm={handleApprovalConfirm}
        />
      )}
    </>
  );
};
