import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

// Mock data for user assignments
const mockUserAssignments = [
  {
    id: "1",
    userName: "John Doe",
    department: "IT",
    project: "Website Redesign",
    hoursLogged: 45.5,
    status: "active",
    joinDate: "2024-01-15",
  },
  {
    id: "2",
    userName: "Jane Smith",
    department: "IT",
    project: "Mobile App Development",
    hoursLogged: 120.75,
    status: "active",
    joinDate: "2024-01-10",
  },
  {
    id: "3",
    userName: "Mike Johnson",
    department: "HR",
    project: "HR System Overhaul",
    hoursLogged: 30.0,
    status: "active",
    joinDate: "2024-01-20",
  },
  {
    id: "4",
    userName: "Sarah Williams",
    department: "SALES",
    project: "Website Redesign",
    hoursLogged: 15.25,
    status: "inactive",
    joinDate: "2024-01-05",
  },
];

export function ProjectUserAssignments() {
  const [assignments, setAssignments] = useState(mockUserAssignments);

  const handleRemoveAssignment = (id: string) => {
    setAssignments(assignments.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">User Assignments</h2>
        <p className="text-muted-foreground">
          Manage user assignments and track hours per person
        </p>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Assigned Project</TableHead>
              <TableHead>Hours Logged</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.map((assignment) => (
              <TableRow key={assignment.id}>
                <TableCell>
                  <span className="font-medium">{assignment.userName}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{assignment.department}</Badge>
                </TableCell>
                <TableCell>{assignment.project}</TableCell>
                <TableCell>
                  <span className="font-medium">{assignment.hoursLogged}h</span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(assignment.joinDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      assignment.status === "active" ? "default" : "secondary"
                    }
                  >
                    {assignment.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveAssignment(assignment.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
