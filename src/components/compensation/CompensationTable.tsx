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
import type { Compensation } from "@/hooks/useCompensation";
import { format } from "date-fns";
import { Loader2, Trash2, CheckCircle, DollarSign, XCircle } from "lucide-react";

const STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "secondary",
  APPROVED: "default",
  PAID: "outline",
  CANCELLED: "destructive",
};

const STATUS_CLASS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  APPROVED: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  PAID: "bg-green-100 text-green-800 hover:bg-green-100",
  CANCELLED: "bg-red-100 text-red-800 hover:bg-red-100",
};

const TYPE_CLASS: Record<string, string> = {
  BONUS: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  COMMISSION: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100",
};

const formatCurrency = (amount: number, currency: string = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    amount
  );

interface Props {
  records: Compensation[];
  isAdmin?: boolean;
  isLoading?: boolean;
  onApprove?: (id: string) => void;
  onPay?: (id: string) => void;
  onCancel?: (id: string) => void;
  onDelete?: (id: string) => void;
  isUpdating?: boolean;
}

export default function CompensationTable({
  records,
  isAdmin,
  isLoading,
  onApprove,
  onPay,
  onCancel,
  onDelete,
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
        <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <p className="text-muted-foreground">No compensation records found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {isAdmin && <TableHead>Employee</TableHead>}
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            {isAdmin && <TableHead className="text-right">Actions</TableHead>}
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
              <TableCell>
                <Badge variant="outline" className={TYPE_CLASS[item.type]}>
                  {item.type}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">
                {item.category.replace(/_/g, " ")}
              </TableCell>
              <TableCell className="font-medium">
                {formatCurrency(item.amount, item.currency)}
              </TableCell>
              <TableCell>
                <Badge variant={STATUS_VARIANT[item.status]} className={STATUS_CLASS[item.status]}>
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(item.createdAt), "MMM dd, yyyy")}
              </TableCell>
              {isAdmin && (
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {item.status === "PENDING" && (
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
                          className="gap-1"
                          onClick={() => onCancel?.(item.id)}
                          disabled={isUpdating}
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          Cancel
                        </Button>
                      </>
                    )}
                    {item.status === "APPROVED" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1"
                        onClick={() => onPay?.(item.id)}
                        disabled={isUpdating}
                      >
                        <DollarSign className="h-3.5 w-3.5" />
                        Pay
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => onDelete?.(item.id)}
                      disabled={isUpdating}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
