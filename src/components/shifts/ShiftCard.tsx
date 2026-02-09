import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Coffee, Edit2, ShieldCheck, Trash2, Users } from "lucide-react";
import type { Shift } from "@/hooks/useShifts";

interface ShiftCardProps {
  shift: Shift;
  onEdit: (shift: Shift) => void;
  onDelete: (id: string) => void;
  onViewEmployees: (shift: Shift) => void;
}

const ShiftCard = ({
  shift,
  onEdit,
  onDelete,
  onViewEmployees,
}: ShiftCardProps) => {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{shift.name}</CardTitle>
            {shift.isDefault && (
              <Badge variant="secondary" className="text-xs">
                Default
              </Badge>
            )}
          </div>
          <Badge variant={shift.isActive ? "default" : "secondary"}>
            {shift.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>
            {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          <span>{shift.graceMinutes} min grace period</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Coffee className="h-4 w-4 text-muted-foreground" />
          <span>{shift.breakMinutes} min break</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-muted-foreground" />
          <button
            onClick={() => onViewEmployees(shift)}
            className="text-primary hover:underline"
          >
            {shift._count?.employees || 0} employees
          </button>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(shift)}
          >
            <Edit2 className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-500 hover:text-red-600"
            onClick={() => onDelete(shift.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShiftCard;
