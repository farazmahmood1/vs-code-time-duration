import { useAdminPlans, useSeedPlans, useUpdatePlan, type Plan } from "@/hooks/useSuperAdmin";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CreditCard,
  Check,
  X,
  Zap,
  Database,
  Users,
  Crown,
  Pencil,
} from "lucide-react";
import { useState } from "react";

const planIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  free: Zap,
  basic: Database,
  enterprise: Crown,
  custom: Crown,
};

const PlansPage = () => {
  const { data: plans, isLoading } = useAdminPlans();
  const seedPlans = useSeedPlans();
  const updatePlan = useUpdatePlan();
  const [editPlan, setEditPlan] = useState<Plan | null>(null);
  const [editForm, setEditForm] = useState({ name: "", price: 0, yearlyPrice: 0, maxUsers: 0, isActive: true });

  const openEditDialog = (plan: Plan) => {
    setEditPlan(plan);
    setEditForm({ name: plan.name, price: plan.price, yearlyPrice: plan.yearlyPrice, maxUsers: plan.maxUsers, isActive: plan.isActive });
  };

  const handleSavePlan = () => {
    if (!editPlan) return;
    updatePlan.mutate({ id: editPlan.id, ...editForm }, { onSuccess: () => setEditPlan(null) });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const sortedPlans = [...(plans ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);

  const formatStorage = (mb: number) => {
    if (mb >= 1024) return `${(mb / 1024).toFixed(0)} GB`;
    return `${mb} MB`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Plans</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage pricing plans and features available to companies.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => seedPlans.mutate()}
          disabled={seedPlans.isPending}
        >
          {seedPlans.isPending ? "Seeding..." : "Seed Default Plans"}
        </Button>
      </div>

      {/* Plan Cards */}
      {sortedPlans.length === 0 ? (
        <Card className="p-12 rounded-2xl border border-border/50 shadow-sm text-center">
          <CreditCard className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">No Plans Created</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Click "Seed Default Plans" to create the standard Free, Basic,
            Enterprise, and Custom plans.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {sortedPlans.map((plan) => {
            const Icon = planIcons[plan.slug] || CreditCard;
            return (
              <Card
                key={plan.id}
                className={`p-6 rounded-2xl border shadow-sm ${
                  plan.slug === "enterprise"
                    ? "border-indigo-600/50 bg-indigo-600/5"
                    : "border-border/50"
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`p-2 rounded-xl ${
                      plan.slug === "enterprise"
                        ? "bg-indigo-600 text-white"
                        : "bg-indigo-600/10 text-indigo-600"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{plan.name}</h3>
                    {!plan.isActive && (
                      <Badge variant="secondary" className="text-xs mt-0.5">
                        Inactive
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  {plan.isCustom ? (
                    <p className="text-2xl font-bold">Custom</p>
                  ) : plan.price === 0 ? (
                    <p className="text-2xl font-bold">Free</p>
                  ) : (
                    <div>
                      <span className="text-2xl font-bold">
                        ${plan.price}
                      </span>
                      <span className="text-muted-foreground text-sm">/mo</span>
                      {plan.yearlyPrice > 0 && (
                        <p className="text-xs text-muted-foreground">
                          ${plan.yearlyPrice}/yr
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-sm border-t pt-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>
                      {plan.maxUsers === -1 ? "Unlimited" : plan.maxUsers} users
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Database className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>
                      {plan.maxStorage === -1
                        ? "Unlimited"
                        : formatStorage(plan.maxStorage)}{" "}
                      storage
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {plan.apiAccess ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <X className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                    <span>API Access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">
                      {plan.supportLevel}
                    </Badge>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {plan.features.filter((f) => f.enabled).length} of{" "}
                    {plan.features.length} features enabled
                  </p>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditDialog(plan)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Feature Matrix */}
      {sortedPlans.length > 0 && (
        <Card className="rounded-2xl border border-border/50 shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Feature Matrix</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Detailed feature availability across all plans.
            </p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Feature</TableHead>
                  {sortedPlans.map((plan) => (
                    <TableHead key={plan.id} className="text-center min-w-[100px]">
                      {plan.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Get all unique feature keys */}
                {Array.from(
                  new Set(
                    sortedPlans.flatMap((p) => p.features.map((f) => f.featureKey))
                  )
                ).map((featureKey) => (
                  <TableRow key={featureKey}>
                    <TableCell className="font-medium text-sm">
                      {sortedPlans
                        .flatMap((p) => p.features)
                        .find((f) => f.featureKey === featureKey)?.featureName ||
                        featureKey}
                    </TableCell>
                    {sortedPlans.map((plan) => {
                      const feature = plan.features.find(
                        (f) => f.featureKey === featureKey
                      );
                      return (
                        <TableCell key={plan.id} className="text-center">
                          {feature?.enabled ? (
                            <Check className="h-4 w-4 text-emerald-600 mx-auto" />
                          ) : (
                            <X className="h-4 w-4 text-muted-foreground/40 mx-auto" />
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Edit Plan Dialog */}
      <Dialog open={!!editPlan} onOpenChange={(open) => { if (!open) setEditPlan(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Plan: {editPlan?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label>Plan Name</Label>
              <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Monthly Price ($)</Label>
                <Input type="number" min={0} value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) || 0 })} />
              </div>
              <div>
                <Label>Yearly Price ($)</Label>
                <Input type="number" min={0} value={editForm.yearlyPrice} onChange={(e) => setEditForm({ ...editForm, yearlyPrice: parseFloat(e.target.value) || 0 })} />
              </div>
            </div>
            <div>
              <Label>Max Users (-1 for unlimited)</Label>
              <Input type="number" min={-1} value={editForm.maxUsers} onChange={(e) => setEditForm({ ...editForm, maxUsers: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={editForm.isActive} onCheckedChange={(v) => setEditForm({ ...editForm, isActive: v })} />
              <Label>Active</Label>
            </div>
            <Button onClick={handleSavePlan} disabled={!editForm.name.trim() || updatePlan.isPending} className="w-full bg-indigo-600 hover:bg-indigo-700">
              {updatePlan.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlansPage;
