import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Expense } from "@/hooks/useExpenses";
import { format } from "date-fns";
import {
  Loader2,
  Trash2,
  CheckCircle,
  DollarSign,
  XCircle,
  Eye,
  Receipt,
} from "lucide-react";

const STATUS_CLASS: Record<string, string> = {
  SUBMITTED: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  APPROVED: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  REJECTED: "bg-red-100 text-red-800 hover:bg-red-100",
  REIMBURSED: "bg-green-100 text-green-800 hover:bg-green-100",
};

const formatCurrency = (amount: number, currency: string = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    amount
  );

interface Props {
  records: Expense[];
  isAdmin?: boolean;
  isLoading?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onReimburse?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewReceipt?: (expense: Expense) => void;
  isUpdating?: boolean;
}

export default function ExpenseTable({
  records,
  isAdmin,
  isLoading,
  onApprove,
  onReject,
  onReimburse,
  onDelete,
  onViewReceipt,
  isUpdating,
}: Props) {
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!records.length) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <p className="text-muted-foreground">No expenses found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {isAdmin && <TableHead>Employee</TableHead>}
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Receipt</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((item) => (
            <TableRow key={item.id}>
              {isAdmin && (
                <TableCell className="font-medium">
                  {item.user?.name || "---"}
                </TableCell>
              )}
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell className="text-sm">
                {item.category.replace(/_/g, " ")}
              </TableCell>
              <TableCell className="font-medium">
                {formatCurrency(item.amount, item.currency)}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={STATUS_CLASS[item.status]}>
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell>
                {item.receiptUrl ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="gap-1 text-blue-600"
                    onClick={() => onViewReceipt?.(item)}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </Button>
                ) : (
                  <span className="text-sm text-muted-foreground">None</span>
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(item.createdAt), "MMM dd, yyyy")}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  {isAdmin && item.status === "SUBMITTED" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1"
                        onClick={() => onApprove?.(item.id)}
                        disabled={isUpdating}
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 text-destructive"
                        onClick={() => onReject?.(item.id)}
                        disabled={isUpdating}
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Reject
                      </Button>
                    </>
                  )}
                  {isAdmin && item.status === "APPROVED" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1"
                      onClick={() => onReimburse?.(item.id)}
                      disabled={isUpdating}
                    >
                      <DollarSign className="h-3.5 w-3.5" />
                      Reimburse
                    </Button>
                  )}
                  {(!isAdmin && item.status === "SUBMITTED") && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => onDelete?.(item.id)}
                      disabled={isUpdating}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  {isAdmin && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => onDelete?.(item.id)}
                      disabled={isUpdating}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
