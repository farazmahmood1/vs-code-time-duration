import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, Calendar, Clock, Edit } from "lucide-react";
import { format } from "date-fns";
import { type Leave } from "@/hooks/useLeaveData";
import ResponsiveDialog from "../ResponsiveDialog";

interface EmployeeLeaveCardProps {
  leave: Leave;
  onView: (leave: Leave) => void;
  onEdit: (leave: Leave) => void;
  onDelete: (id: string) => void;
}

export const EmployeeLeaveCard = ({
  leave,
  onView,
  onEdit,
  onDelete,
}: EmployeeLeaveCardProps) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const isPending = leave.status === "PENDING";

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-lg">
            {leave.leaveType.replace(/_/g, " ")}
          </h3>
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
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {format(new Date(leave.startDate), "MMM dd")} –{" "}
              {format(new Date(leave.endDate), "MMM dd, yyyy")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{leave.duration} days</span>
          </div>
        </div>

        {leave.reason && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground line-clamp-2">
              <span className="font-bold">Reason:</span> {leave.reason}
            </p>
          </div>
        )}

        {/* {leave.approvalNotes && (
          <div className="pt-2 border-t bg-red-50 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm text-red-900">
                Rejection Details
              </h4>
              {leave.approvalDate && (
                <span className="text-xs text-red-700">
                  {format(new Date(leave.approvalDate), "MMM dd, yyyy")}
                </span>
              )}
            </div>
            <p className="text-sm text-red-800 leading-relaxed">
              {leave.approvalNotes}
            </p>
          </div>
        )} */}

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onView(leave)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>

          {isPending && (
            <Button variant="outline" size="sm" onClick={() => onEdit(leave)}>
              <Edit className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          <ResponsiveDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            title="Delete Leave Request"
            description="Are you sure you want to delete this leave request? This action cannot be undone."
          >
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  onDelete(leave.id);
                  setDeleteOpen(false);
                }}
              >
                Delete
              </Button>
            </div>
          </ResponsiveDialog>
        </div>
      </CardContent>
    </Card>
  );
};
