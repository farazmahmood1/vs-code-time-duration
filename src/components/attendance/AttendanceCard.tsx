import { type AttendanceRecord } from "@/hooks/useAttendanceData";
import { StatusBadge } from "./StatusBadge";
import { format } from "date-fns";
import { formatWorkHours } from "@/lib/utils";

interface AttendanceCardProps {
  record: AttendanceRecord;
}

export const AttendanceCard = ({ record }: AttendanceCardProps) => {
  return (
    <div className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow">
      <div className="space-y-4">
        {/* Employee Info */}
        <div>
          <h3 className="font-semibold text-lg">{record.employeeName}</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {record.uniqueId}
          </p>
        </div>

        {/* Department & Status */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Department</p>
            <p className="text-sm font-medium mt-1">
              {record.department || "-"}
            </p>
          </div>
          <StatusBadge status={record.status} />
        </div>

        {/* Time Info */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p className="text-xs text-muted-foreground">Check-in</p>
            <p className="text-sm font-medium mt-1">
              {record.checkInTime
                ? format(new Date(record.checkInTime), "hh:mm a")
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Check-out</p>
            <p className="text-sm font-medium mt-1">
              {record.checkOutTime
                ? format(new Date(record.checkOutTime), "hh:mm a")
                : "-"}
            </p>
          </div>
        </div>

        {/* Work Hours */}
        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">Work Hours</p>
          <p className="text-2xl font-bold mt-1">
            {formatWorkHours(Number(record.workHours))}
          </p>
        </div>
      </div>
    </div>
  );
};
