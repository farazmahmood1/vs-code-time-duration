import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  useMyExpenses,
  useMyExpenseSummary,
  useDeleteExpense,
} from "@/hooks/useExpenses";
import type { Expense } from "@/hooks/useExpenses";
import ExpenseSummaryCards from "@/components/expenses/ExpenseSummaryCards";
import ExpenseTable from "@/components/expenses/ExpenseTable";
import ExpenseForm from "@/components/expenses/ExpenseForm";
import ReceiptPreviewDialog from "@/components/expenses/ReceiptPreviewDialog";

export default function EmployeeExpenses() {
  const [formOpen, setFormOpen] = useState(false);
  const [receiptPreview, setReceiptPreview] = useState<{
    open: boolean;
    expense?: Expense;
  }>({ open: false });

  const { data, isLoading } = useMyExpenses({});
  const { data: summary, isLoading: summaryLoading } = useMyExpenseSummary();
  const deleteMutation = useDeleteExpense();

  const records = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Expenses</h1>
          <p className="text-muted-foreground">
            Submit and track your expense claims
          </p>
        </div>
        <Button className="gap-2" onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4" />
          Submit Expense
        </Button>
      </div>

      <ExpenseSummaryCards summary={summary} isLoading={summaryLoading} />

      <ExpenseTable
        records={records}
        isLoading={isLoading}
        isUpdating={deleteMutation.isPending}
        onDelete={(id) => deleteMutation.mutate(id)}
        onViewReceipt={(expense) =>
          setReceiptPreview({ open: true, expense })
        }
      />

      <ExpenseForm open={formOpen} onOpenChange={setFormOpen} />

      <ReceiptPreviewDialog
        open={receiptPreview.open}
        onOpenChange={(open) => setReceiptPreview((p) => ({ ...p, open }))}
        receiptUrl={receiptPreview.expense?.receiptUrl}
        receiptFileName={receiptPreview.expense?.receiptFileName}
      />
    </div>
  );
}
