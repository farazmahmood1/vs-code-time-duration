import {
  useMyCompensations,
  useMyCompensationSummary,
} from "@/hooks/useCompensation";
import CompensationSummaryCards from "@/components/compensation/CompensationSummaryCards";
import CompensationTable from "@/components/compensation/CompensationTable";

export default function EmployeeCompensation() {
  const { data, isLoading } = useMyCompensations({});
  const { data: summary, isLoading: summaryLoading } =
    useMyCompensationSummary();

  const records = data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Compensation</h1>
        <p className="text-muted-foreground">
          View your bonuses and commissions
        </p>
      </div>

      <CompensationSummaryCards summary={summary} isLoading={summaryLoading} />

      <CompensationTable records={records} isLoading={isLoading} />
    </div>
  );
}
