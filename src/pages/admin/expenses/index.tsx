import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  useAllExpenses,
  useExpenseSummary,
  useUpdateExpenseStatus,
} from "@/hooks/useExpenses";
import type { Expense } from "@/hooks/useExpenses";
import ExpenseSummaryCards from "@/components/expenses/ExpenseSummaryCards";
import ExpenseTable from "@/components/expenses/ExpenseTable";
import ReceiptPreviewDialog from "@/components/expenses/ReceiptPreviewDialog";

export default function AdminExpenses() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(
    undefined
  );
  const [search, setSearch] = useState("");
  const [receiptPreview, setReceiptPreview] = useState<{
    open: boolean;
    expense?: Expense;
  }>({ open: false });

  const { data, isLoading } = useAllExpenses({
    status: statusFilter,
    category: categoryFilter,
    search: search || undefined,
  });
  const { data: summary, isLoading: summaryLoading } = useExpenseSummary();
  const updateStatusMutation = useUpdateExpenseStatus();

  const records = data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Expense Management
        </h1>
        <p className="text-muted-foreground">
          Review and manage employee expense claims
        </p>
      </div>

      <ExpenseSummaryCards summary={summary} isLoading={summaryLoading} />

      <div className="flex items-center gap-2">
        <select
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
          value={statusFilter || ""}
          onChange={(e) => setStatusFilter(e.target.value || undefined)}
        >
          <option value="">All Status</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="REIMBURSED">Reimbursed</option>
        </select>
        <select
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
          value={categoryFilter || ""}
          onChange={(e) => setCategoryFilter(e.target.value || undefined)}
        >
          <option value="">All Categories</option>
          <option value="TRAVEL">Travel</option>
          <option value="MEALS">Meals</option>
          <option value="EQUIPMENT">Equipment</option>
          <option value="SOFTWARE">Software</option>
          <option value="OFFICE_SUPPLIES">Office Supplies</option>
          <option value="TRAINING">Training</option>
          <option value="OTHER_EXPENSE">Other</option>
        </select>
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <ExpenseTable
        records={records}
        isAdmin
        isLoading={isLoading}
        isUpdating={updateStatusMutation.isPending}
        onApprove={(id) =>
          updateStatusMutation.mutate({ id, status: "APPROVED" })
        }
        onReject={(id) =>
          updateStatusMutation.mutate({ id, status: "REJECTED" })
        }
        onReimburse={(id) =>
          updateStatusMutation.mutate({ id, status: "REIMBURSED" })
        }
        onViewReceipt={(expense) =>
          setReceiptPreview({ open: true, expense })
        }
      />

      <ReceiptPreviewDialog
        open={receiptPreview.open}
        onOpenChange={(open) => setReceiptPreview((p) => ({ ...p, open }))}
        receiptUrl={receiptPreview.expense?.receiptUrl}
        receiptFileName={receiptPreview.expense?.receiptFileName}
      />
    </div>
  );
}
