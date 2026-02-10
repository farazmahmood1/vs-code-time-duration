import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { LeaveBalance } from "@/hooks/useLeaveBalance";

interface LeaveBalanceCardProps {
  balance: LeaveBalance;
}

const LEAVE_TYPE_LABELS: Record<string, string> = {
  ANNUAL_LEAVE: "Annual Leave",
  MATERNITY_LEAVE: "Maternity Leave",
  CASUAL_LEAVE: "Casual Leave",
  SICK_LEAVE: "Sick Leave",
  PERSONAL_LEAVE: "Personal Leave",
  UNPAID_LEAVE: "Unpaid Leave",
};

const LeaveBalanceCard = ({ balance }: LeaveBalanceCardProps) => {
  const total = balance.totalDays + balance.carriedOver;
  const usedPercent = total > 0 ? (balance.usedDays / total) * 100 : 0;
  const label = LEAVE_TYPE_LABELS[balance.leaveType] || balance.leaveType;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-end">
          <span className="text-2xl font-bold">{balance.remainingDays}</span>
          <span className="text-sm text-muted-foreground">
            of {total} days remaining
          </span>
        </div>

        <Progress value={usedPercent} className="h-2" />

        <div className="grid grid-cols-3 text-xs text-muted-foreground">
          <div>
            <p className="font-medium text-foreground">{balance.totalDays}</p>
            <p>Allocated</p>
          </div>
          <div>
            <p className="font-medium text-foreground">{balance.usedDays}</p>
            <p>Used</p>
          </div>
          <div>
            <p className="font-medium text-foreground">{balance.carriedOver}</p>
            <p>Carried Over</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaveBalanceCard;
