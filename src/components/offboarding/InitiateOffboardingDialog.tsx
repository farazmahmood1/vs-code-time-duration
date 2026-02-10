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
import { useInitiateOffboarding } from "@/hooks/useOffboarding";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function InitiateOffboardingDialog({
  open,
  onOpenChange,
}: Props) {
  const [employeeId, setEmployeeId] = useState("");
  const [lastWorkingDate, setLastWorkingDate] = useState("");
  const initiateMutation = useInitiateOffboarding();

  const { data: employeesData } = useQuery({
    queryKey: ["all-employees-for-offboarding"],
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
      setEmployeeId("");
      setLastWorkingDate("");
    }
  }, [open]);

  const handleSubmit = () => {
    initiateMutation.mutate(
      { employeeId, lastWorkingDate },
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Initiate Offboarding</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Employee</Label>
            <Select value={employeeId} onValueChange={setEmployeeId}>
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
          <div>
            <Label>Last Working Date</Label>
            <Input
              type="date"
              value={lastWorkingDate}
              onChange={(e) => setLastWorkingDate(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !employeeId || !lastWorkingDate || initiateMutation.isPending
            }
          >
            {initiateMutation.isPending && (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            )}
            Initiate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
