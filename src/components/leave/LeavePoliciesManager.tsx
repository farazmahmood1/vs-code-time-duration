import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import ResponsiveDialog from "@/components/ResponsiveDialog";
import {
  useLeavePolicies,
  useUpsertLeavePolicy,
  useInitializeLeaveBalances,
  type LeavePolicy,
  type LeavePolicyFormData,
} from "@/hooks/useLeaveBalance";
import { Edit2, Play, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const LEAVE_TYPES = [
  { value: "ANNUAL_LEAVE", label: "Annual Leave" },
  { value: "MATERNITY_LEAVE", label: "Maternity Leave" },
  { value: "CASUAL_LEAVE", label: "Casual Leave" },
  { value: "SICK_LEAVE", label: "Sick Leave" },
  { value: "PERSONAL_LEAVE", label: "Personal Leave" },
  { value: "UNPAID_LEAVE", label: "Unpaid Leave" },
];

const LeavePoliciesManager = () => {
  const { data: policies, isLoading } = useLeavePolicies();
  const upsertMutation = useUpsertLeavePolicy();
  const initializeMutation = useInitializeLeaveBalances();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [initDialogOpen, setInitDialogOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<LeavePolicy | null>(null);
  const [initYear, setInitYear] = useState(new Date().getFullYear());

  const [formData, setFormData] = useState<LeavePolicyFormData>({
    leaveType: "",
    annualDays: 0,
    maxCarryOver: 0,
    isActive: true,
  });

  const handleCreate = () => {
    setEditingPolicy(null);
    setFormData({
      leaveType: "",
      annualDays: 0,
      maxCarryOver: 0,
      isActive: true,
    });
    setDialogOpen(true);
  };

  const handleEdit = (policy: LeavePolicy) => {
    setEditingPolicy(policy);
    setFormData({
      leaveType: policy.leaveType,
      annualDays: policy.annualDays,
      maxCarryOver: policy.maxCarryOver,
      isActive: policy.isActive,
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    upsertMutation.mutate(formData, {
      onSuccess: () => setDialogOpen(false),
    });
  };

  const handleInitialize = () => {
    initializeMutation.mutate(initYear, {
      onSuccess: () => setInitDialogOpen(false),
    });
  };

  const getLeaveLabel = (type: string) =>
    LEAVE_TYPES.find((t) => t.value === type)?.label || type;

  // Leave types that don't already have a policy
  const availableLeaveTypes = LEAVE_TYPES.filter(
    (t) => !policies?.some((p) => p.leaveType === t.value)
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Leave Policies</h2>
          <p className="text-sm text-muted-foreground">
            Configure annual leave allocations per type
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setInitDialogOpen(true)}>
            <Play className="h-4 w-4 mr-1" />
            Initialize Balances
          </Button>
          <Button onClick={handleCreate} disabled={availableLeaveTypes.length === 0}>
            <Plus className="h-4 w-4 mr-1" />
            Add Policy
          </Button>
        </div>
      </div>

      {(!policies || policies.length === 0) ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            No leave policies configured yet. Add policies to define annual
            allocations.
          </p>
        </Card>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Leave Type</TableHead>
                <TableHead>Annual Days</TableHead>
                <TableHead>Max Carry Over</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {policies.map((policy) => (
                <TableRow key={policy.id}>
                  <TableCell className="font-medium">
                    {getLeaveLabel(policy.leaveType)}
                  </TableCell>
                  <TableCell>{policy.annualDays} days</TableCell>
                  <TableCell>{policy.maxCarryOver} days</TableCell>
                  <TableCell>
                    <Badge variant={policy.isActive ? "default" : "secondary"}>
                      {policy.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(policy)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create/Edit Policy Dialog */}
      <ResponsiveDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingPolicy ? "Edit Leave Policy" : "Add Leave Policy"}
        description="Configure the annual leave allocation for a leave type"
      >
        <div className="space-y-4">
          <div>
            <Label>Leave Type</Label>
            {editingPolicy ? (
              <Input
                value={getLeaveLabel(formData.leaveType)}
                disabled
                className="mt-1"
              />
            ) : (
              <Select
                value={formData.leaveType}
                onValueChange={(val) =>
                  setFormData({ ...formData, leaveType: val })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  {availableLeaveTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div>
            <Label>Annual Days</Label>
            <Input
              type="number"
              min={0}
              max={365}
              value={formData.annualDays}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  annualDays: parseFloat(e.target.value) || 0,
                })
              }
              className="mt-1"
            />
          </div>

          <div>
            <Label>Max Carry Over (days)</Label>
            <Input
              type="number"
              min={0}
              max={365}
              value={formData.maxCarryOver}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  maxCarryOver: parseFloat(e.target.value) || 0,
                })
              }
              className="mt-1"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Active</Label>
              <p className="text-sm text-muted-foreground">
                Inactive policies won't allocate balances
              </p>
            </div>
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isActive: checked })
              }
            />
          </div>
        </div>

        <div className="flex gap-2 pt-6 justify-end">
          <Button variant="outline" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!formData.leaveType || upsertMutation.isPending}
          >
            {upsertMutation.isPending ? "Saving..." : "Save Policy"}
          </Button>
        </div>
      </ResponsiveDialog>

      {/* Initialize Balances Dialog */}
      <ResponsiveDialog
        open={initDialogOpen}
        onOpenChange={setInitDialogOpen}
        title="Initialize Leave Balances"
        description="Create or update leave balances for all employees based on active policies. Carry-over from the previous year will be calculated automatically."
      >
        <div className="space-y-4">
          <div>
            <Label>Year</Label>
            <Input
              type="number"
              value={initYear}
              onChange={(e) => setInitYear(parseInt(e.target.value) || new Date().getFullYear())}
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-6 justify-end">
          <Button variant="outline" onClick={() => setInitDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleInitialize}
            disabled={initializeMutation.isPending}
          >
            {initializeMutation.isPending ? "Initializing..." : "Initialize"}
          </Button>
        </div>
      </ResponsiveDialog>
    </div>
  );
};

export default LeavePoliciesManager;
