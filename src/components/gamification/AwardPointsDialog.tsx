import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAwardPoints } from "@/hooks/useGamification";
import { Gift, Loader2 } from "lucide-react";
import { useState } from "react";

const CATEGORIES = [
  { value: "ATTENDANCE", label: "Attendance" },
  { value: "PRODUCTIVITY", label: "Productivity" },
  { value: "RECOGNITION", label: "Recognition" },
  { value: "TRAINING", label: "Training" },
  { value: "WELLNESS", label: "Wellness" },
];

interface Employee {
  id: string;
  name: string;
}

interface AwardPointsDialogProps {
  employees: Employee[];
}

export function AwardPointsDialog({ employees }: AwardPointsDialogProps) {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [points, setPoints] = useState("");
  const [reason, setReason] = useState("");
  const [category, setCategory] = useState("");
  const awardMutation = useAwardPoints();

  const handleSubmit = () => {
    if (!userId || !points || !reason || !category) return;
    awardMutation.mutate(
      {
        userId,
        points: parseInt(points),
        reason,
        category,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setUserId("");
          setPoints("");
          setReason("");
          setCategory("");
        },
      }
    );
  };

  const isValid = userId && points && parseInt(points) > 0 && reason && category;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Gift className="h-4 w-4 mr-2" />
          Award Points
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Award Points to Employee</DialogTitle>
          <DialogDescription>
            Recognize an employee by awarding gamification points.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Employee</Label>
            <Select value={userId} onValueChange={setUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Points</Label>
            <Input
              type="number"
              min={1}
              max={1000}
              placeholder="e.g. 50"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Reason</Label>
            <Textarea
              placeholder="Describe why this employee is being awarded points..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || awardMutation.isPending}
          >
            {awardMutation.isPending && (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            )}
            Award Points
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
