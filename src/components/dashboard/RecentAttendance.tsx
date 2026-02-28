import { Badge } from "@/components/ui/badge";
import type { AttendanceRecord } from "@/hooks/useAttendanceData";
import { Clock } from "lucide-react";

interface RecentAttendanceProps {
  records: AttendanceRecord[];
}

const statusConfig: Record<
  string,
  { variant: "default" | "secondary" | "destructive" | "outline"; label: string; dot: string }
> = {
  Online: { variant: "default", label: "Online", dot: "bg-emerald-500" },
  Offline: { variant: "secondary", label: "Offline", dot: "bg-slate-400" },
  Absent: { variant: "destructive", label: "Absent", dot: "bg-red-500" },
  Break: { variant: "outline", label: "Break", dot: "bg-amber-500" },
};

export const RecentAttendance = ({ records }: RecentAttendanceProps) => {
  return (
    <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10">
          <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-base font-semibold text-foreground">
          Recent Attendance
        </h3>
      </div>
      {records.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No attendance records today
        </p>
      ) : (
        <div className="space-y-1">
          {records.slice(0, 8).map((record) => {
            const config = statusConfig[record.status] || statusConfig.Offline;
            return (
              <div
                key={record.id}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${config.dot}`} />
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
                  <span className="text-xs text-muted-foreground font-medium">
                    {record.workHours}h
                  </span>
                  <Badge variant={config.variant} className="text-[10px] px-2 py-0.5 rounded-md">
                    {config.label}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
