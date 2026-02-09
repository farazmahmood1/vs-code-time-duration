import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ResponsiveDialog from "@/components/ResponsiveDialog";
import { useShifts, useAssignShift } from "@/hooks/useShifts";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";

interface AssignShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedShiftId?: string;
}

export function AssignShiftDialog({
  open,
  onOpenChange,
  preselectedShiftId,
}: AssignShiftDialogProps) {
  const [userId, setUserId] = React.useState("");
  const [shiftId, setShiftId] = React.useState(preselectedShiftId || "");
  const [startDate, setStartDate] = React.useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = React.useState("");

  const { data: shifts } = useShifts();
  const assignMutation = useAssignShift();

  // Fetch employees for the dropdown
  const { data: employeesData } = useQuery({
    queryKey: ["all-employees-for-shift"],
    queryFn: async () => {
      const { data } = await authClient.admin.listUsers({
        query: { limit: 200, sortBy: "name", sortDirection: "asc" },
      });
      return data?.users || [];
    },
    enabled: open,
  });

  React.useEffect(() => {
    if (preselectedShiftId) {
      setShiftId(preselectedShiftId);
    }
  }, [preselectedShiftId]);

  React.useEffect(() => {
    if (!open) {
      setUserId("");
      setShiftId(preselectedShiftId || "");
      setStartDate(new Date().toISOString().split("T")[0]);
      setEndDate("");
    }
  }, [open, preselectedShiftId]);

  const handleSubmit = () => {
    assignMutation.mutate(
      {
        userId,
        shiftId,
        startDate,
        endDate: endDate || undefined,
      },
      {
        onSuccess: () => onOpenChange(false),
      }
    );
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Assign Employee to Shift"
      description="Select an employee and assign them to a shift schedule"
    >
      <div className="space-y-4">
        <div>
          <Label>Employee</Label>
          <Select value={userId} onValueChange={setUserId}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select an employee" />
            </SelectTrigger>
            <SelectContent>
              {employeesData?.map(
                (emp: { id: string; name: string; email: string }) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.name} ({emp.email})
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Shift</Label>
          <Select value={shiftId} onValueChange={setShiftId}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select a shift" />
            </SelectTrigger>
            <SelectContent>
              {shifts
                ?.filter((s) => s.isActive)
                .map((shift) => (
                  <SelectItem key={shift.id} value={shift.id}>
                    {shift.name} ({shift.startTime} - {shift.endTime})
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Start Date</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>End Date (optional)</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-6 justify-end">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!userId || !shiftId || !startDate || assignMutation.isPending}
        >
          {assignMutation.isPending ? "Assigning..." : "Assign"}
        </Button>
      </div>
    </ResponsiveDialog>
  );
}
