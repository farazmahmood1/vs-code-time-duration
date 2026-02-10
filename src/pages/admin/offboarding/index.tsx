import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useOffboardingProcesses } from "@/hooks/useOffboarding";
import OffboardingList from "@/components/offboarding/OffboardingList";
import InitiateOffboardingDialog from "@/components/offboarding/InitiateOffboardingDialog";

export default function AdminOffboarding() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading } = useOffboardingProcesses({
    status: statusFilter,
  });

  const records = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Offboarding</h1>
          <p className="text-muted-foreground">
            Manage employee offboarding workflows
          </p>
        </div>
        <Button className="gap-2" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Initiate Offboarding
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <select
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
          value={statusFilter || ""}
          onChange={(e) => setStatusFilter(e.target.value || undefined)}
        >
          <option value="">All Status</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <OffboardingList records={records} isLoading={isLoading} />

      <InitiateOffboardingDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
