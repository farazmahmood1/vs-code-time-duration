import { UserAvatar } from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DeactivateEmployeeModal } from "@/components/employees/DeactivateEmployeeModal";
import type { Employee } from "@/hooks/useEmployees";
import { DollarSign, UserMinus, UserPlus, Lock, LockOpen, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEmployeeActions } from "@/hooks/useEmployees";
import { useToast } from "@/hooks/use-toast";
import ResponsiveDialog from "@/components/ResponsiveDialog";

interface EmployeeTableProps {
  employees: Employee[];
  onlineUserIds?: Set<string>;
  onAssignClick?: (employee: Employee) => void;
  onUnassignClick?: (employee: Employee) => void;
  onSalaryClick?: (employee: Employee) => void;
}

export const EmployeeTable = ({
  employees,
  onlineUserIds,
  onAssignClick,
  onUnassignClick,
  onSalaryClick,
}: EmployeeTableProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { deleteUser, isLoading: isDeleting } = useEmployeeActions();
  const [deactivateEmployee, setDeactivateEmployee] = useState<Employee | null>(
    null
  );
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [deleteEmployee, setDeleteEmployee] = useState<Employee | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleAssignClick = (employee: Employee) => {
    if (onAssignClick) {
      onAssignClick(employee);
    }
  };

  const handleRemoveClick = (employee: Employee) => {
    if (onUnassignClick) {
      onUnassignClick(employee);
    }
  };

  const handleSalaryClick = (employee: Employee) => {
    if (onSalaryClick) {
      onSalaryClick(employee);
    }
  };

  const handleDeactivateClick = (employee: Employee) => {
    setDeactivateEmployee(employee);
    setIsDeactivateModalOpen(true);
  };

  const handleDeleteClick = (employee: Employee) => {
    setDeleteEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteEmployee) return;
    const result = await deleteUser(deleteEmployee.id);
    if (result.success) {
      toast({
        title: "Employee deleted",
        description: `${deleteEmployee.name} has been permanently deleted.`,
      });
    } else {
      toast({
        title: "Failed to delete",
        description:
          typeof result.error === "string"
            ? result.error
            : "Something went wrong.",
        variant: "destructive",
      });
    }
    setIsDeleteDialogOpen(false);
    setDeleteEmployee(null);
  };

  const handleClick = (employeeId: string) => {
    navigate(`/app/employees/${employeeId}`);
  };

  return (
    <div className="border rounded-lg overflow-x-auto w-full">
      <Table>
        <TableHeader>
          <TableRow>
            {/* <TableHead className="w-12">
              <Checkbox />
            </TableHead> */}
            {/* <TableHead>ID</TableHead> */}
            <TableHead>Employee</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Date Joined</TableHead>
            <TableHead>Salary</TableHead>
            <TableHead className="text-right">Manage</TableHead>
            {/* <TableHead>Location</TableHead>
            <TableHead>Status</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow
              key={employee.id}
              className="hover:bg-muted/50 transition-colors"
            >
              {/* <TableCell>
                <Checkbox />
              </TableCell> */}
              {/* <TableCell className="font-medium">{employee.id}</TableCell> */}
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <UserAvatar
                      src={employee.avatar}
                      alt={employee.name}
                      initials={employee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                      size="sm"
                    />
                    <span
                      className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${
                        onlineUserIds?.has(employee.id) ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span
                      className="font-medium hover:underline cursor-pointer"
                      onClick={() => handleClick(employee.id)}
                    >
                      {employee.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {employee.uniqueId || "Unassigned"}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {employee.email}
              </TableCell>
              <TableCell>{employee.role}</TableCell>
              <TableCell>{employee.department}</TableCell>
              <TableCell>{employee.dateJoined}</TableCell>
              <TableCell className="text-green-600 font-medium">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {employee.salary ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSalaryClick(employee);
                          }}
                          className="hover:underline cursor-pointer text-left"
                        >
                          PKR {employee.salary.toLocaleString()}
                        </button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSalaryClick(employee);
                          }}
                        >
                          <DollarSign className="h-4 w-4" />
                        </Button>
                      )}
                    </TooltipTrigger>
                    <TooltipContent>
                      {employee.salary
                        ? "Click to edit salary"
                        : "Click to add salary"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className="text-right">
                <TooltipProvider>
                  <div className="flex items-center justify-end gap-1">
                    {/* Deactivate/Reactivate Button */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeactivateClick(employee);
                          }}
                          className={
                            employee.banned
                              ? ""
                              : "text-orange-600 hover:text-orange-700"
                          }
                        >
                          {employee.banned ? (
                            <LockOpen className="h-4 w-4" />
                          ) : (
                            <Lock className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {employee.banned
                          ? "Reactivate Employee"
                          : "Deactivate Employee"}
                      </TooltipContent>
                    </Tooltip>

                    {/* Assign to Department Button */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAssignClick(employee);
                          }}
                        >
                          <UserPlus className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Assign to Department</TooltipContent>
                    </Tooltip>

                    {/* Remove from Department Button */}
                    {employee.department &&
                      employee.department !== "-" &&
                      employee.department !== "Unassigned" && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveClick(employee);
                              }}
                            >
                              <UserMinus className="h-4 w-4 text-red-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            Remove from Department
                          </TooltipContent>
                        </Tooltip>
                      )}

                    {/* Delete Employee Button */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(employee);
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete Employee</TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
              </TableCell>
              {/* <TableCell>{employee.location}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    employee.status === "Online" ? "default" : "secondary"
                  }
                  className={
                    employee.status === "Online"
                      ? "bg-green-100 text-green-800"
                      : ""
                  }
                >
                  {employee.status}
                </Badge>
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Deactivate/Reactivate Modal */}
      <DeactivateEmployeeModal
        isOpen={isDeactivateModalOpen}
        onOpenChange={setIsDeactivateModalOpen}
        employee={deactivateEmployee}
      />

      {/* Delete Employee Confirmation Dialog */}
      <ResponsiveDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Employee Permanently"
        description="This action cannot be undone."
      >
        <div className="space-y-4">
          <div className="flex gap-3 p-3 rounded-md bg-destructive/10 text-destructive">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">
                You are about to permanently delete {deleteEmployee?.name}.
              </p>
              <p className="mt-1">
                All associated data including attendance records, leave requests,
                and other information will be removed. This cannot be reversed.
              </p>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Permanently
            </Button>
          </div>
        </div>
      </ResponsiveDialog>
    </div>
  );
};
