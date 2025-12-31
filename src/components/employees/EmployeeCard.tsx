import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/common/UserAvatar";
import type { Employee } from "@/hooks/useEmployees";
import { useNavigate } from "react-router-dom";

interface EmployeeCardProps {
  employee: Employee;
}

export const EmployeeCard = ({ employee }: EmployeeCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/employees/${employee.id}`);
  };

  return (
    <Card className="relative hover:shadow-lg transition-shadow">
      <CardContent className="px-6 py-3">
        <div className="flex flex-col items-center text-center">
          <UserAvatar
            src={employee.avatar}
            alt={employee.name}
            initials={employee.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
            size="xl"
          />
          <h3
            className="font-semibold text-lg mb-2 mt-4 hover:underline cursor-pointer"
            onClick={handleClick}
          >
            {employee.name}
          </h3>
          <div className="space-y-1.5 text-sm w-full">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Role</span>
              <span className="font-medium">{employee.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">ID</span>
              <span className="font-medium">{employee.uniqueId || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium text-xs truncate max-w-[150px]">
                {employee.email}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Department</span>
              <span className="font-medium text-xs">{employee.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date Joined</span>
              <span className="font-medium text-xs">{employee.dateJoined}</span>
            </div>
            {employee.salary && (
              <div className="flex justify-between border-t pt-1.5">
                <span className="text-muted-foreground">Salary</span>
                <span className="font-medium text-green-600">
                  PKR {employee.salary.toLocaleString()}
                </span>
              </div>
            )}
            {/* <div className="flex justify-between">
              <span className="text-muted-foreground">Location</span>
              <span className="font-medium">{employee.location}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Status</span>
              <Badge
                variant={employee.status === "Online" ? "default" : "secondary"}
                className={
                  employee.status === "Online"
                    ? "bg-green-100 text-green-800"
                    : ""
                }
              >
                {employee.status}
              </Badge>
            </div> */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
