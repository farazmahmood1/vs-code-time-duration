import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import ResponsiveDialog from "@/components/ResponsiveDialog";
import { useUpdateProgress, type WellnessChallenge } from "@/hooks/useWellness";

interface LogProgressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  challenge: WellnessChallenge | null;
  currentProgress: number;
}

export function LogProgressDialog({
  open,
  onOpenChange,
  challenge,
  currentProgress,
}: LogProgressDialogProps) {
  const updateProgress = useUpdateProgress();
  const [amount, setAmount] = useState("");

  if (!challenge) return null;

  const remaining = Math.max(challenge.goal - currentProgress, 0);
  const progressPercent = Math.min(
    (currentProgress / challenge.goal) * 100,
    100
  );
  const previewProgress = amount
    ? Math.min(
        ((currentProgress + parseFloat(amount || "0")) / challenge.goal) * 100,
        100
      )
    : progressPercent;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(amount);
    if (!value || value <= 0) return;

    updateProgress.mutate(
      { id: challenge.id, progress: value },
      {
        onSuccess: () => {
          onOpenChange(false);
          setAmount("");
        },
      }
    );
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Log Progress"
      description={challenge.title}
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Current Progress</span>
            <span className="font-medium">
              {currentProgress} / {challenge.goal} {challenge.unit}
            </span>
          </div>
          <Progress value={previewProgress} className="h-3" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{Math.round(previewProgress)}% complete</span>
            <span>
              {remaining} {challenge.unit} remaining
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="progressAmount">
            Add Progress ({challenge.unit})
          </Label>
          <Input
            id="progressAmount"
            type="number"
            min="0.1"
            step="any"
            placeholder={`Enter ${challenge.unit} to add...`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setAmount("");
            }}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={updateProgress.isPending}>
            {updateProgress.isPending ? "Saving..." : "Log Progress"}
          </Button>
        </div>
      </form>
    </ResponsiveDialog>
  );
}
