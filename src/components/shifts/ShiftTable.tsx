import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Users } from "lucide-react";
import type { Shift } from "@/hooks/useShifts";

interface ShiftTableProps {
  shifts: Shift[];
  onEdit: (shift: Shift) => void;
  onDelete: (id: string) => void;
  onViewEmployees: (shift: Shift) => void;
}

const ShiftTable = ({
  shifts,
  onEdit,
  onDelete,
  onViewEmployees,
}: ShiftTableProps) => {
  if (shifts.length === 0) {
    return null;
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto w-full">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow>
              <TableHead>Shift Name</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Grace Period</TableHead>
              <TableHead>Break</TableHead>
              <TableHead>Employees</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shifts.map((shift) => (
              <TableRow key={shift.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{shift.name}</p>
                    {shift.isDefault && (
                      <Badge variant="secondary" className="text-xs">
                        Default
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm">
                    {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-sm">{shift.graceMinutes} min</p>
                </TableCell>
                <TableCell>
                  <p className="text-sm">{shift.breakMinutes} min</p>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1"
                    onClick={() => onViewEmployees(shift)}
                  >
                    <Users className="h-4 w-4" />
                    <span>{shift._count?.employees || 0}</span>
                  </Button>
                </TableCell>
                <TableCell>
                  <Badge variant={shift.isActive ? "default" : "secondary"}>
                    {shift.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(shift)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(shift.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ShiftTable;
