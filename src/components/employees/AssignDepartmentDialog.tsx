import { useState } from "react";
import { Button } from "@/components/ui/button";
import DepartmentSelect from "@/components/common/DepartmentSelect";
import ResponsiveDialog from "@/components/ResponsiveDialog";
import { useAssignEmployeeToDepartment } from "@/hooks/useDepartments";

interface AssignDepartmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeId: string;
  employeeName: string;
  currentDepartmentId?: string;
}

export function AssignDepartmentDialog({
  open,
  onOpenChange,
  employeeId,
  employeeName,
  currentDepartmentId = "",
}: AssignDepartmentDialogProps) {
  const [selectedDepartmentId, setSelectedDepartmentId] =
    useState(currentDepartmentId);
  const assignMutation = useAssignEmployeeToDepartment();

  const handleAssign = async () => {
    if (!selectedDepartmentId) {
      return;
    }

    assignMutation.mutate(
      { employeeId, departmentId: selectedDepartmentId },
      {
        onSuccess: () => {
          setSelectedDepartmentId("");
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Assign Department"
      description={`Assign a department to ${employeeName}`}
    >
      <div className="space-y-4">
        <div className="space-y-2 flex flex-col">
          <label className="text-sm font-medium">Department</label>
          <DepartmentSelect
            value={selectedDepartmentId}
            onValueChange={setSelectedDepartmentId}
            placeholder="Select department"
            showAllOption={false}
            variant="outline"
            width="full"
          />
        </div>

        <div className="flex gap-2 justify-end pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={assignMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedDepartmentId || assignMutation.isPending}
          >
            {assignMutation.isPending ? "Assigning..." : "Assign"}
          </Button>
        </div>
      </div>
    </ResponsiveDialog>
  );
}
