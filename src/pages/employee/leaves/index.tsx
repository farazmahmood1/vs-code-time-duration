import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle, Clock, XCircle, FileText } from "lucide-react";
import { ApplyLeaveDialog } from "@/components/leave/ApplyLeaveDialog";
import { EmployeeLeaveCard } from "@/components/leave/EmployeeLeaveCard";
import { EditLeaveDialog } from "@/components/leave/EditLeaveDialog";
import { ViewLeaveDialog } from "@/components/leave/ViewLeaveDialog";
import {
  useMyLeaves,
  useLeaveStats,
  useDeleteLeave,
  type Leave,
} from "@/hooks/useLeaveData";
import { Skeleton } from "@/components/ui/skeleton";

export default function EmployeeLeaves() {
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [editingLeave, setEditingLeave] = useState<Leave | null>(null);
  const [currentPage] = useState(1);

  const { data, isLoading } = useMyLeaves({
    page: currentPage,
    pageSize: 10,
  });

  const { data: stats } = useLeaveStats();
  const deleteLeave = useDeleteLeave();

  const handleViewLeave = (leave: Leave) => {
    setSelectedLeave(leave);
  };

  const handleEditLeave = (leave: Leave) => {
    setEditingLeave(leave);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLeave.mutateAsync(id);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  const leaves = data?.data || [];
  const totalLeaves = data?.meta?.total || 0;
  const pendingCount = leaves.filter((l) => l.status === "PENDING").length;
  const approvedCount = leaves.filter((l) => l.status === "APPROVED").length;
  const rejectedCount = leaves.filter((l) => l.status === "REJECTED").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Leaves</h1>
          <p className="text-muted-foreground mt-1">
            View and manage your leave requests
          </p>
        </div>
        <Button onClick={() => setIsApplyDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Apply Leave
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-brand/70 font-medium">
                Total Requests
              </p>
              <p className="text-3xl font-bold mt-2 text-brand">
                {totalLeaves}
              </p>
            </div>
            <div className="p-2 bg-brand/10 rounded-lg">
              <FileText className="h-5 w-5 text-brand" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-brand/70 font-medium">Pending</p>
              <p className="text-3xl font-bold mt-2 text-brand">
                {pendingCount}
              </p>
            </div>
            <div className="p-2 bg-gray-200 rounded-lg">
              <Clock className="h-5 w-5 text-gray-700" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-brand/70 font-medium">Approved</p>
              <p className="text-3xl font-bold mt-2 text-brand">
                {approvedCount}
              </p>
            </div>
            <div className="p-2 bg-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-700" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-brand/70 font-medium">Rejected</p>
              <p className="text-3xl font-bold mt-2 text-brand">
                {rejectedCount}
              </p>
            </div>
            <div className="p-2 bg-red-200 rounded-lg">
              <XCircle className="h-5 w-5 text-red-700" />
            </div>
          </div>
        </Card>
      </div>

      {stats && (
        <Card className="p-4 bg-brand/5 border-blue-200">
          <p className="text-sm text-brand/70">Total Leave Days (Approved)</p>
          <p className="text-2xl font-bold text-brand">
            {stats.totalDays} days
          </p>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {leaves.map((leave) => (
          <EmployeeLeaveCard
            key={leave.id}
            leave={leave}
            onView={handleViewLeave}
            onEdit={handleEditLeave}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {leaves.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No leave requests found</p>
          <Button onClick={() => setIsApplyDialogOpen(true)} className="mt-4">
            Apply for your first leave
          </Button>
        </Card>
      )}

      <ApplyLeaveDialog
        open={isApplyDialogOpen}
        onOpenChange={setIsApplyDialogOpen}
      />
      <EditLeaveDialog
        leave={editingLeave}
        open={!!editingLeave}
        onOpenChange={(open) => !open && setEditingLeave(null)}
      />
      <ViewLeaveDialog
        leave={selectedLeave}
        open={!!selectedLeave}
        onOpenChange={(open) => !open && setSelectedLeave(null)}
      />
    </div>
  );
}
