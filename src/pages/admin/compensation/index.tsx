import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import {
  useAllCompensations,
  useCompensationSummary,
  useUpdateCompensationStatus,
  useDeleteCompensation,
} from "@/hooks/useCompensation";
import CompensationSummaryCards from "@/components/compensation/CompensationSummaryCards";
import CompensationTable from "@/components/compensation/CompensationTable";
import CompensationForm from "@/components/compensation/CompensationForm";

export default function AdminCompensation() {
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  const { data, isLoading } = useAllCompensations({
    type: typeFilter,
    status: statusFilter,
    search: search || undefined,
  });
  const { data: summary, isLoading: summaryLoading } = useCompensationSummary();
  const updateStatusMutation = useUpdateCompensationStatus();
  const deleteMutation = useDeleteCompensation();

  const records = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Bonus & Commission
          </h1>
          <p className="text-muted-foreground">
            Manage employee bonuses and commissions
          </p>
        </div>
        <Button className="gap-2" onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Bonus/Commission
        </Button>
      </div>

      <CompensationSummaryCards summary={summary} isLoading={summaryLoading} />

      <div className="flex items-center gap-2">
        <select
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
          value={typeFilter || ""}
          onChange={(e) => setTypeFilter(e.target.value || undefined)}
        >
          <option value="">All Types</option>
          <option value="BONUS">Bonus</option>
          <option value="COMMISSION">Commission</option>
        </select>
        <select
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
          value={statusFilter || ""}
          onChange={(e) => setStatusFilter(e.target.value || undefined)}
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="PAID">Paid</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <Input
          placeholder="Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <CompensationTable
        records={records}
        isAdmin
        isLoading={isLoading}
        isUpdating={updateStatusMutation.isPending || deleteMutation.isPending}
        onApprove={(id) =>
          updateStatusMutation.mutate({ id, status: "APPROVED" })
        }
        onPay={(id) => updateStatusMutation.mutate({ id, status: "PAID" })}
        onCancel={(id) =>
          updateStatusMutation.mutate({ id, status: "CANCELLED" })
        }
        onDelete={(id) => deleteMutation.mutate(id)}
      />

      <CompensationForm open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
}
