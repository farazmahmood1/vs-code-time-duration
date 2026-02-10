import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCompensation } from "@/hooks/useCompensation";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const TYPES = ["BONUS", "COMMISSION"];
const CATEGORIES = [
  "PERFORMANCE",
  "REFERRAL",
  "HOLIDAY",
  "SALES",
  "RETENTION",
  "SIGNING",
  "OTHER_COMPENSATION",
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CompensationForm({ open, onOpenChange }: Props) {
  const [form, setForm] = useState({
    userId: "",
    type: "",
    category: "",
    amount: "",
    description: "",
  });

  const createMutation = useCreateCompensation();

  const { data: employeesData } = useQuery({
    queryKey: ["all-employees-for-compensation"],
    queryFn: async () => {
      const { data } = await authClient.admin.listUsers({
        query: { limit: 200, sortBy: "name", sortDirection: "asc" },
      });
      return data?.users || [];
    },
    enabled: open,
  });

  useEffect(() => {
    if (!open) {
      setForm({ userId: "", type: "", category: "", amount: "", description: "" });
    }
  }, [open]);

  const handleSubmit = () => {
    createMutation.mutate(
      {
        userId: form.userId,
        type: form.type,
        category: form.category,
        amount: parseFloat(form.amount),
        description: form.description || undefined,
      },
      {
        onSuccess: () => onOpenChange(false),
      }
    );
  };

  const isValid = form.userId && form.type && form.category && form.amount && parseFloat(form.amount) > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Bonus / Commission</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Employee</Label>
            <Select
              value={form.userId}
              onValueChange={(v) => setForm((p) => ({ ...p, userId: v }))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select an employee" />
              </SelectTrigger>
              <SelectContent>
                {employeesData?.map(
                  (emp: { id: string; name: string; email: string }) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name} ({emp.email})
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Type</Label>
              <Select
                value={form.type}
                onValueChange={(v) => setForm((p) => ({ ...p, type: v }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Amount ($)</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
              className="mt-1"
              placeholder="0.00"
            />
          </div>

          <div>
            <Label>Description (optional)</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              className="mt-1"
              rows={3}
              placeholder="Add details about this compensation..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || createMutation.isPending}
          >
            {createMutation.isPending && (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            )}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
