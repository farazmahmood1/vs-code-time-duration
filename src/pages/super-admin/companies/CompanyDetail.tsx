import { useParams, useNavigate } from "react-router-dom";
import {
  useCompany,
  useUpdateCompanyStatus,
  useSetFeatureOverride,
  useOverrideSubscription,
  useAdminPlans,
} from "@/hooks/useSuperAdmin";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  ArrowLeft,
  Building2,
  Users,
  Calendar,
  Shield,
  CreditCard,
} from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";

const statusColors: Record<string, string> = {
  ACTIVE:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  SUSPENDED:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  DEACTIVATED:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const CompanyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: company, isLoading } = useCompany(id ?? null);
  const { data: plans } = useAdminPlans();
  const updateStatus = useUpdateCompanyStatus();
  const overrideSub = useOverrideSubscription();
  const setFeature = useSetFeatureOverride();
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [confirmStatus, setConfirmStatus] = useState<string | null>(null);

  // Initialize the dropdown with the current subscription's plan
  useEffect(() => {
    if (company?.subscriptions?.[0]?.planId) {
      setSelectedPlan(company.subscriptions[0].planId);
    }
  }, [company?.subscriptions]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Company not found</p>
      </div>
    );
  }

  const subscription = company.subscriptions?.[0];

  const handleStatusChange = (status: string) => {
    if (status === "SUSPENDED" || status === "DEACTIVATED") {
      setConfirmStatus(status);
    } else {
      updateStatus.mutate({ id: company.id, status });
    }
  };

  const confirmStatusAction = () => {
    if (!confirmStatus) return;
    updateStatus.mutate({ id: company.id, status: confirmStatus });
    setConfirmStatus(null);
  };

  const handlePlanOverride = () => {
    if (!selectedPlan) return;
    overrideSub.mutate({ companyId: company.id, planId: selectedPlan });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/super-admin/companies")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{company.name}</h1>
          <p className="text-muted-foreground text-sm">{company.slug}</p>
        </div>
        <Badge className={statusColors[company.status]}>{company.status}</Badge>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Card className="p-5 rounded-2xl border border-border/50 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <Building2 className="h-5 w-5 text-indigo-600" />
            <h3 className="font-semibold">Company Info</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">{company.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Slug</span>
              <span className="font-medium">{company.slug}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Domain</span>
              <span className="font-medium">{company.domain || "—"}</span>
            </div>
            {company.owner && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Owner</span>
                  <span className="font-medium">{company.owner.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Owner Email</span>
                  <span className="font-medium text-xs">{company.owner.email}</span>
                </div>
              </>
            )}
          </div>
        </Card>

        <Card className="p-5 rounded-2xl border border-border/50 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <Users className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Users</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current</span>
              <span className="font-medium">
                {company._count?.users ?? company.currentUserCount ?? 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Max Allowed</span>
              <span className="font-medium">{company.maxUsers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Departments</span>
              <span className="font-medium">{company._count?.departments ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Projects</span>
              <span className="font-medium">{company._count?.projects ?? 0}</span>
            </div>
          </div>
        </Card>

        <Card className="p-5 rounded-2xl border border-border/50 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold">Timeline</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created</span>
              <span className="font-medium">
                {format(new Date(company.createdAt), "MMM d, yyyy")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Updated</span>
              <span className="font-medium">
                {format(new Date(company.updatedAt), "MMM d, yyyy")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Stripe ID</span>
              <span className="font-medium text-xs">
                {company.stripeCustomerId || "—"}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Owner & Company Details */}
      {(company.owner?.designation || company.industry || company.website) && (
        <Card className="p-5 rounded-2xl border border-border/50 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <Users className="h-5 w-5 text-teal-600" />
            <h3 className="font-semibold">Owner & Company Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
            {company.owner?.designation && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Designation</span>
                <span className="font-medium">{company.owner.designation}</span>
              </div>
            )}
            {company.owner?.phone && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone</span>
                <span className="font-medium">{company.owner.phone}</span>
              </div>
            )}
            {company.industry && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Industry</span>
                <span className="font-medium">{company.industry}</span>
              </div>
            )}
            {company.teamSize && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Team Size</span>
                <span className="font-medium">{company.teamSize}</span>
              </div>
            )}
            {company.website && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Website</span>
                <span className="font-medium text-xs">{company.website}</span>
              </div>
            )}
            {company.companyAddress && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Address</span>
                <span className="font-medium text-xs">{company.companyAddress}</span>
              </div>
            )}
            {company.timezone && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Timezone</span>
                <span className="font-medium">{company.timezone}</span>
              </div>
            )}
            {company.workingHours && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Working Hours</span>
                <span className="font-medium">{company.workingHours}</span>
              </div>
            )}
            {company.description && (
              <div className="md:col-span-2 flex flex-col gap-1">
                <span className="text-muted-foreground">Description</span>
                <span className="font-medium">{company.description}</span>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Subscription & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subscription */}
        <Card className="p-6 rounded-2xl border border-border/50 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="h-5 w-5 text-indigo-600" />
            <h3 className="font-semibold">Subscription</h3>
          </div>
          {subscription ? (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Plan</span>
                <span className="font-medium">{subscription.plan.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="outline">{subscription.status}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Billing</span>
                <span className="font-medium">{subscription.billingCycle}</span>
              </div>
              {subscription.currentPeriodEnd && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Renews</span>
                  <span className="font-medium">
                    {format(new Date(subscription.currentPeriodEnd), "MMM d, yyyy")}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No active subscription</p>
          )}

          <div className="mt-4 pt-4 border-t space-y-3">
            <p className="text-sm font-medium">Override Plan</p>
            <div className="flex gap-2">
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  {plans?.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handlePlanOverride}
                disabled={!selectedPlan || overrideSub.isPending}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Apply
              </Button>
            </div>
          </div>
        </Card>

        {/* Status Management */}
        <Card className="p-6 rounded-2xl border border-border/50 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-5 w-5 text-indigo-600" />
            <h3 className="font-semibold">Status Management</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Change the company's operational status. Suspended companies cannot
            access the platform. Deactivated companies are effectively archived.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={company.status === "ACTIVE" ? "default" : "outline"}
              onClick={() => handleStatusChange("ACTIVE")}
              disabled={company.status === "ACTIVE" || updateStatus.isPending}
              className={
                company.status === "ACTIVE"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : ""
              }
            >
              Activate
            </Button>
            <Button
              variant={company.status === "SUSPENDED" ? "default" : "outline"}
              onClick={() => handleStatusChange("SUSPENDED")}
              disabled={company.status === "SUSPENDED" || updateStatus.isPending}
              className={
                company.status === "SUSPENDED"
                  ? "bg-amber-500 hover:bg-amber-600"
                  : ""
              }
            >
              Suspend
            </Button>
            <Button
              variant={company.status === "DEACTIVATED" ? "default" : "outline"}
              onClick={() => handleStatusChange("DEACTIVATED")}
              disabled={company.status === "DEACTIVATED" || updateStatus.isPending}
              className={
                company.status === "DEACTIVATED"
                  ? "bg-red-600 hover:bg-red-700"
                  : ""
              }
            >
              Deactivate
            </Button>
          </div>

          {/* Feature Overrides */}
          <div className="mt-6 pt-4 border-t">
            <h4 className="text-sm font-medium mb-3">Feature Overrides</h4>
            {company.featureOverrides && company.featureOverrides.length > 0 ? (
              <div className="space-y-2">
                {company.featureOverrides.map((fo) => (
                  <div
                    key={fo.id}
                    className="flex items-center justify-between text-sm bg-muted/50 rounded-lg px-3 py-2"
                  >
                    <span className="font-mono text-xs">{fo.featureKey}</span>
                    <Badge
                      variant={fo.enabled ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {fo.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No feature overrides set. Company uses plan defaults.
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!confirmStatus} onOpenChange={(open) => { if (!open) setConfirmStatus(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmStatus === "SUSPENDED" ? "Suspend" : "Deactivate"} {company.name}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmStatus === "SUSPENDED"
                ? "The company will lose access to the platform until reactivated."
                : "This will archive the company and all its data."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmStatusAction}
              className={confirmStatus === "DEACTIVATED" ? "bg-red-600 hover:bg-red-700" : "bg-amber-500 hover:bg-amber-600"}
            >
              {confirmStatus === "SUSPENDED" ? "Suspend" : "Deactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CompanyDetailPage;
