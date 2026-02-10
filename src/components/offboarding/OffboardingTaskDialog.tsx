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
import { useUpdateOffboardingTask } from "@/hooks/useOffboarding";
import type { OffboardingTask } from "@/hooks/useOffboarding";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  processId: string;
  task?: OffboardingTask;
}

export default function OffboardingTaskDialog({
  open,
  onOpenChange,
  processId,
  task,
}: Props) {
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const updateMutation = useUpdateOffboardingTask();

  const { data: employeesData } = useQuery({
    queryKey: ["all-employees-for-task-assign"],
    queryFn: async () => {
      const { data } = await authClient.admin.listUsers({
        query: { limit: 200, sortBy: "name", sortDirection: "asc" },
      });
      return data?.users || [];
    },
    enabled: open,
  });

  useEffect(() => {
    if (task && open) {
      setAssignedTo(task.assignedTo || "");
      setDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
      setNotes(task.notes || "");
    }
    if (!open) {
      setAssignedTo("");
      setDueDate("");
      setNotes("");
    }
  }, [task, open]);

  const handleSubmit = () => {
    if (!task) return;
    updateMutation.mutate(
      {
        processId,
        taskId: task.id,
        data: {
          assignedTo: assignedTo || undefined,
          dueDate: dueDate || undefined,
          notes: notes || undefined,
        },
      },
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task: {task?.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Assign To</Label>
            <Select value={assignedTo} onValueChange={setAssignedTo}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
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
            <Label>Due Date</Label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1"
              rows={3}
              placeholder="Add notes..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={updateMutation.isPending}>
            {updateMutation.isPending && (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            )}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
