import { useState } from "react";
import {
  useSubscriptions,
  useOverrideSubscription,
  useAdminPlans,
  type Subscription,
} from "@/hooks/useSuperAdmin";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Shield, Building2, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const subStatusColors: Record<string, string> = {
  ACTIVE:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  PAST_DUE:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  CANCELED:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  TRIALING:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  INCOMPLETE:
    "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
};

const SubscriptionsPage = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [overrideTarget, setOverrideTarget] = useState<Subscription | null>(null);
  const [selectedPlan, setSelectedPlan] = useState("");

  const { data, isLoading } = useSubscriptions({
    page,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });
  const { data: plans } = useAdminPlans();
  const overrideSub = useOverrideSubscription();

  const handleOverride = () => {
    if (!overrideTarget || !selectedPlan) return;
    overrideSub.mutate(
      { companyId: overrideTarget.companyId, planId: selectedPlan },
      {
        onSuccess: () => {
          setOverrideTarget(null);
          setSelectedPlan("");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  const subscriptions = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Subscriptions</h1>
        <p className="text-muted-foreground text-sm mt-1">
          View and manage all company subscriptions.
        </p>
      </div>

      {/* Filter */}
      <div className="flex gap-3">
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="PAST_DUE">Past Due</SelectItem>
            <SelectItem value="CANCELED">Canceled</SelectItem>
            <SelectItem value="TRIALING">Trialing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="rounded-2xl border border-border/50 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Billing</TableHead>
              <TableHead>Period End</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map((sub: Subscription) => (
              <TableRow key={sub.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">
                      {sub.company?.name || sub.companyId}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{sub.plan.name}</Badge>
                </TableCell>
                <TableCell>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${subStatusColors[sub.status] || ""}`}
                  >
                    {sub.status}
                  </span>
                </TableCell>
                <TableCell className="text-sm">{sub.billingCycle}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {sub.currentPeriodEnd
                    ? format(new Date(sub.currentPeriodEnd), "MMM d, yyyy")
                    : "—"}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setOverrideTarget(sub)}
                    >
                      Change Plan
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        navigate(`/super-admin/companies/${sub.companyId}`)
                      }
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {subscriptions.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <Shield className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground">No subscriptions found</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Override Dialog */}
      <Dialog
        open={!!overrideTarget}
        onOpenChange={(open) => {
          if (!open) {
            setOverrideTarget(null);
            setSelectedPlan("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Subscription Plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">
              Override the subscription plan for{" "}
              <strong>{overrideTarget?.company?.name}</strong>. Current plan:{" "}
              <Badge variant="outline">{overrideTarget?.plan.name}</Badge>
            </p>
            <Select value={selectedPlan} onValueChange={setSelectedPlan}>
              <SelectTrigger>
                <SelectValue placeholder="Select new plan" />
              </SelectTrigger>
              <SelectContent>
                {plans?.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} — ${p.price}/mo
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleOverride}
              disabled={!selectedPlan || overrideSub.isPending}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              {overrideSub.isPending ? "Updating..." : "Update Plan"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionsPage;
