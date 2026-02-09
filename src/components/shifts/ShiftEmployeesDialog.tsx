import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserMinus } from "lucide-react";
import ResponsiveDialog from "@/components/ResponsiveDialog";
import { useShiftEmployees, useUnassignShift } from "@/hooks/useShifts";
import type { Shift } from "@/hooks/useShifts";
import { format } from "date-fns";

interface ShiftEmployeesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shift: Shift | null;
}

export function ShiftEmployeesDialog({
  open,
  onOpenChange,
  shift,
}: ShiftEmployeesDialogProps) {
  const { data: employees, isLoading } = useShiftEmployees(shift?.id || "");
  const unassignMutation = useUnassignShift();

  const handleUnassign = (userId: string) => {
    if (!shift) return;
    unassignMutation.mutate({ userId, shiftId: shift.id });
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Employees in ${shift?.name || "Shift"}`}
      description="View and manage employees assigned to this shift"
    >
      {isLoading ? (
        <p className="text-sm text-muted-foreground py-4">Loading...</p>
      ) : !employees || employees.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">
          No employees assigned to this shift yet.
        </p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Assigned</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((emp) => (
                <TableRow key={emp.assignmentId}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={emp.image} />
                        <AvatarFallback className="text-xs">
                          {getInitials(emp.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{emp.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {emp.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {emp.department?.name || "Unassigned"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {emp.assignedAt
                      ? format(new Date(emp.assignedAt), "MMM d, yyyy")
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUnassign(emp.id)}
                      disabled={unassignMutation.isPending}
                    >
                      <UserMinus className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </ResponsiveDialog>
  );
}
