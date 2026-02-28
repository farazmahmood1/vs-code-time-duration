import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle } from "lucide-react";
import type { OvertimeAlert } from "@/hooks/useOvertime";

interface OvertimeAlertsProps {
  alerts: OvertimeAlert[];
}

export const OvertimeAlerts = ({ alerts }: OvertimeAlertsProps) => {
  if (alerts.length === 0) return null;

  return (
    <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
        </div>
        <h3 className="text-base font-semibold text-foreground">
          Overtime Alerts
        </h3>
        <Badge variant="secondary" className="ml-auto text-xs rounded-lg">
          {alerts.length}
        </Badge>
      </div>
      <div className="space-y-4">
        {alerts.slice(0, 5).map((alert) => (
          <div key={`${alert.userId}-${alert.type}`} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium truncate max-w-[180px]">
                {alert.user.name}
              </span>
              <div className="flex items-center gap-2">
                <Badge
                  variant={alert.exceeded ? "destructive" : "secondary"}
                  className="text-[10px] px-2 py-0.5 rounded-md"
                >
                  {alert.type}
                </Badge>
                <span className="text-xs text-muted-foreground font-medium">
                  {alert.currentHours.toFixed(1)}h / {alert.limitHours}h
                </span>
              </div>
            </div>
            <Progress
              value={Math.min(alert.percentage, 100)}
              className={`h-1.5 rounded-full ${alert.exceeded ? "[&>div]:bg-red-500" : "[&>div]:bg-amber-500"}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
