import { CustomPagination } from "@/components/CustomPagination";
import { ApplyLeaveDialog } from "@/components/leave/ApplyLeaveDialog";
import { LeaveCard } from "@/components/leave/LeaveCard";
import { LeaveFilters } from "@/components/leave/LeaveFilters";
import { LeaveStatsCards } from "@/components/leave/LeaveStatsCards";
import { LeaveTable } from "@/components/leave/LeaveTable";
import { ViewLeaveDialog } from "@/components/leave/ViewLeaveDialog";
import ResponsiveDialog from "@/components/ResponsiveDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import {
  useDeleteLeave,
  useLeaveData,
  useUpdateLeaveStatus,
  type Leave,
} from "@/hooks/useLeaveData";
import { useState } from "react";

const Leaves = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [leaveType, setLeaveType] = useState("All");
  const [status, setStatus] = useState("All");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);

  const { data, isLoading } = useLeaveData({
    page,
    pageSize,
    search,
    leaveType,
    status,
    startDate,
    endDate,
  });

  const updateStatus = useUpdateLeaveStatus();
  const deleteLeave = useDeleteLeave();

  const handleStatusChange = async (
    id: string,
    newStatus: string,
    approvalNotes?: string
  ) => {
    try {
      await updateStatus.mutateAsync({ id, status: newStatus, approvalNotes });
      toast({
        title: "Success",
        description: `Leave request ${newStatus.toLowerCase()}`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to update leave status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    setSelectedLeave(data?.leaves.find((leave) => leave.id === id) || null);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedLeave) return;
    try {
      await deleteLeave.mutateAsync(selectedLeave.id);
      toast({
        title: "Success",
        description: "Leave request deleted",
      });
      setDeleteDialogOpen(false);
      setSelectedLeave(null);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to delete leave request",
        variant: "destructive",
      });
    }
  };

  const handleView = (leave: Leave) => {
    setSelectedLeave(leave);
    setViewDialogOpen(true);
  };

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-3xl font-bold">Leave Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage employee leave requests
        </p>
      </div>

      <LeaveStatsCards />

      <LeaveFilters
        search={search}
        onSearchChange={setSearch}
        leaveType={leaveType}
        onLeaveTypeChange={setLeaveType}
        status={status}
        onStatusChange={setStatus}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        onViewModeChange={setViewMode}
        viewMode={viewMode}
      />

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : !data?.leaves.length ? (
        <div className="text-center py-12 border rounded-lg bg-muted/50">
          <p className="text-muted-foreground mb-4">No leave requests found</p>
        </div>
      ) : (
        <>
          {isMobile || viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.leaves.map((leave) => (
                <LeaveCard
                  key={leave.id}
                  leave={leave}
                  onView={handleView}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          ) : (
            <LeaveTable
              leaves={data.leaves}
              onView={handleView}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          )}

          <CustomPagination
            page={page}
            totalPages={data.totalPages}
            onPageChange={setPage}
            showPageInfo
          />
        </>
      )}

      <ApplyLeaveDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
      <ViewLeaveDialog
        leave={selectedLeave}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />
      <ResponsiveDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Leave Request"
        description="Are you sure you want to delete this leave request? This action cannot be undone."
      >
        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleteLeave.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmDelete}
            disabled={deleteLeave.isPending}
          >
            {deleteLeave.isPending ? "Deleting..." : "Delete Leave"}
          </Button>
        </div>
      </ResponsiveDialog>
    </div>
  );
};

export default Leaves;
