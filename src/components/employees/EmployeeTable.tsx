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
import { DollarSign, UserMinus, UserPlus, Lock, LockOpen } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface EmployeeTableProps {
  employees: Employee[];
  onAssignClick?: (employee: Employee) => void;
  onUnassignClick?: (employee: Employee) => void;
  onSalaryClick?: (employee: Employee) => void;
}

export const EmployeeTable = ({
  employees,
  onAssignClick,
  onUnassignClick,
  onSalaryClick,
}: EmployeeTableProps) => {
  const navigate = useNavigate();
  const [deactivateEmployee, setDeactivateEmployee] = useState<Employee | null>(
    null
  );
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  console.log("Employees:", employees);

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

  const handleClick = (employeeId: string) => {
    navigate(`/employees/${employeeId}`);
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
                  <UserAvatar
                    src={employee.avatar}
                    alt={employee.name}
                    initials={employee.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                    size="sm"
                  />
                  <div className="flex flex-col">
                    <span
                      className="font-medium hover:underline cursor-pointer"
                      onClick={() => handleClick(employee.id)}
                    >
                      {employee.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {employee.uniqueId}
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
    </div>
  );
};
