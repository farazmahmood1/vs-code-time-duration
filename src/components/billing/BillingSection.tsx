import { useState } from "react";
import {
  useSubscription,
  usePublicPlans,
  useCreateCheckout,
  useCreatePortalSession,
  useInvoices,
} from "@/hooks/useBilling";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CreditCard,
  ExternalLink,
  Check,
  Zap,
  Crown,
  Receipt,
} from "lucide-react";
import { format } from "date-fns";

const BillingSection = () => {
  const { data: subscription, isLoading: subLoading } = useSubscription();
  const { data: plans, isLoading: plansLoading } = usePublicPlans();
  const { data: invoices } = useInvoices();
  const checkout = useCreateCheckout();
  const portalSession = useCreatePortalSession();
  const [billingCycle, setBillingCycle] = useState<"MONTHLY" | "YEARLY">(
    "MONTHLY"
  );

  if (subLoading || plansLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );
  }

  const sortedPlans = plans
    ? [...plans]
        .filter((p) => p.isActive && !p.isCustom)
        .sort((a, b) => a.sortOrder - b.sortOrder)
    : [];

  const statusColors: Record<string, string> = {
    ACTIVE: "bg-emerald-100 text-emerald-700",
    PAST_DUE: "bg-amber-100 text-amber-700",
    CANCELED: "bg-red-100 text-red-700",
    TRIALING: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <Card className="p-6 rounded-2xl border border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="h-5 w-5 text-indigo-600" />
          <h3 className="font-semibold text-lg">Current Plan</h3>
        </div>

        {subscription ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold">
                {subscription.plan.name}
              </span>
              <Badge className={statusColors[subscription.status] || ""}>
                {subscription.status}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                Billing: <strong>{subscription.billingCycle}</strong>
              </p>
              {subscription.currentPeriodEnd && (
                <p>
                  Next billing date:{" "}
                  <strong>
                    {format(
                      new Date(subscription.currentPeriodEnd),
                      "MMMM d, yyyy"
                    )}
                  </strong>
                </p>
              )}
            </div>
            <Button
              variant="outline"
              onClick={() => portalSession.mutate()}
              disabled={portalSession.isPending}
              className="mt-2"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {portalSession.isPending
                ? "Opening..."
                : "Manage Billing"}
            </Button>
          </div>
        ) : (
          <div>
            <p className="text-muted-foreground mb-2">
              You're on the <strong>Free</strong> plan. Upgrade to unlock more
              features.
            </p>
          </div>
        )}
      </Card>

      {/* Billing Cycle Toggle */}
      <div className="flex items-center gap-3">
        <Button
          variant={billingCycle === "MONTHLY" ? "default" : "outline"}
          size="sm"
          onClick={() => setBillingCycle("MONTHLY")}
        >
          Monthly
        </Button>
        <Button
          variant={billingCycle === "YEARLY" ? "default" : "outline"}
          size="sm"
          onClick={() => setBillingCycle("YEARLY")}
        >
          Yearly (Save 20%)
        </Button>
      </div>

      {/* Available Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sortedPlans.map((plan) => {
          const isCurrent = subscription?.plan.id === plan.id;
          const Icon = plan.price === 0 ? Zap : Crown;
          const price =
            plan.price === 0
              ? "Free"
              : billingCycle === "YEARLY" && plan.yearlyPrice > 0
                ? `$${Math.round(plan.yearlyPrice / 12)}`
                : `$${plan.price}`;

          return (
            <Card
              key={plan.id}
              className={`p-5 rounded-2xl border ${
                isCurrent
                  ? "border-indigo-600/50 bg-indigo-600/5"
                  : "border-border/50"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon className="h-4 w-4 text-indigo-600" />
                <h4 className="font-semibold">{plan.name}</h4>
                {isCurrent && (
                  <Badge className="bg-indigo-600 text-white text-[10px]">
                    Current
                  </Badge>
                )}
              </div>
              <div className="mb-3">
                <span className="text-2xl font-bold">{price}</span>
                {price !== "Free" && (
                  <span className="text-muted-foreground text-sm">/mo</span>
                )}
              </div>
              <div className="space-y-1.5 mb-4 text-sm">
                {plan.features
                  .filter((f) => f.enabled)
                  .slice(0, 4)
                  .map((f) => (
                    <div key={f.id} className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-emerald-600" />
                      <span className="text-muted-foreground">
                        {f.featureName}
                      </span>
                    </div>
                  ))}
              </div>
              {!isCurrent && plan.price > 0 && (
                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  size="sm"
                  onClick={() =>
                    checkout.mutate({
                      planId: plan.id,
                      billingCycle,
                    })
                  }
                  disabled={checkout.isPending}
                >
                  {checkout.isPending ? "Redirecting..." : "Upgrade"}
                </Button>
              )}
              {isCurrent && (
                <Button variant="outline" className="w-full" size="sm" disabled>
                  Current Plan
                </Button>
              )}
            </Card>
          );
        })}
      </div>

      {/* Invoices */}
      {invoices && invoices.length > 0 && (
        <Card className="p-6 rounded-2xl border border-border/50">
          <div className="flex items-center gap-3 mb-4">
            <Receipt className="h-5 w-5 text-indigo-600" />
            <h3 className="font-semibold">Recent Invoices</h3>
          </div>
          <div className="space-y-2">
            {invoices.slice(0, 5).map((invoice: any) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-xl text-sm"
              >
                <div>
                  <p className="font-medium">
                    {invoice.description || "Invoice"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {invoice.createdAt &&
                      format(new Date(invoice.createdAt), "MMM d, yyyy")}
                  </p>
                </div>
                <Badge variant="outline">{invoice.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default BillingSection;
