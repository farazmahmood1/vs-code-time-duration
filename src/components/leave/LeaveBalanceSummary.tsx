import { Skeleton } from "@/components/ui/skeleton";
import { useMyLeaveBalances } from "@/hooks/useLeaveBalance";
import LeaveBalanceCard from "./LeaveBalanceCard";

interface LeaveBalanceSummaryProps {
  year?: number;
}

const LeaveBalanceSummary = ({ year }: LeaveBalanceSummaryProps) => {
  const { data: balances, isLoading } = useMyLeaveBalances(year);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-36" />
        ))}
      </div>
    );
  }

  if (!balances || balances.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No leave balances found for this year. Contact your admin.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {balances.map((balance) => (
        <LeaveBalanceCard key={balance.id} balance={balance} />
      ))}
    </div>
  );
};

export default LeaveBalanceSummary;
