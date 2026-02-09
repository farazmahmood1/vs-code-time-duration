import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AttendanceRecord } from "@/hooks/useAttendanceData";

interface RecentAttendanceProps {
  records: AttendanceRecord[];
}

const statusConfig: Record<
  string,
  { variant: "default" | "secondary" | "destructive" | "outline"; label: string }
> = {
  Online: { variant: "default", label: "Online" },
  Offline: { variant: "secondary", label: "Offline" },
  Absent: { variant: "destructive", label: "Absent" },
  Break: { variant: "outline", label: "Break" },
};

export const RecentAttendance = ({ records }: RecentAttendanceProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Recent Attendance
        </CardTitle>
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            No attendance records today
          </p>
        ) : (
          <div className="space-y-2">
            {records.slice(0, 8).map((record) => {
              const config = statusConfig[record.status] || statusConfig.Offline;
              return (
                <div
                  key={record.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`h-2 w-2 rounded-full shrink-0 ${
                        record.status === "Online"
                          ? "bg-green-500"
                          : record.status === "Break"
                            ? "bg-amber-500"
                            : record.status === "Absent"
                              ? "bg-red-500"
                              : "bg-slate-400"
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {record.employeeName}
                      </p>
                      {record.department && (
                        <p className="text-xs text-muted-foreground truncate">
                          {record.department}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-muted-foreground">
                      {record.workHours}h
                    </span>
                    <Badge variant={config.variant} className="text-[10px] px-1.5 py-0">
                      {config.label}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
