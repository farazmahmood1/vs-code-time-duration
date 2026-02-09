import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Overtime Alerts
          </CardTitle>
          <Badge variant="secondary" className="ml-auto text-xs">
            {alerts.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.slice(0, 5).map((alert) => (
          <div key={`${alert.userId}-${alert.type}`} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium truncate max-w-[180px]">
                {alert.user.name}
              </span>
              <div className="flex items-center gap-2">
                <Badge
                  variant={alert.exceeded ? "destructive" : "secondary"}
                  className="text-[10px] px-1.5 py-0"
                >
                  {alert.type}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {alert.currentHours.toFixed(1)}h / {alert.limitHours}h
                </span>
              </div>
            </div>
            <Progress
              value={Math.min(alert.percentage, 100)}
              className={`h-1.5 ${alert.exceeded ? "[&>div]:bg-red-500" : "[&>div]:bg-amber-500"}`}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
