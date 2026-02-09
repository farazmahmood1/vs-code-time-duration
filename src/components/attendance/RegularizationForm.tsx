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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitRegularization } from "@/hooks/useRegularization";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";

const TYPE_LABELS: Record<string, string> = {
  MISSED_CHECKIN: "Missed Check-in",
  MISSED_CHECKOUT: "Missed Check-out",
  WRONG_TIME: "Wrong Time Recorded",
};

export default function RegularizationForm() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [type, setType] = useState<string>("");
  const [requestedTime, setRequestedTime] = useState("");
  const [reason, setReason] = useState("");

  const submitMutation = useSubmitRegularization();

  const resetForm = () => {
    setDate("");
    setType("");
    setRequestedTime("");
    setReason("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Combine date + time into ISO datetime
    const requestedDateTime = new Date(`${date}T${requestedTime}`).toISOString();

    submitMutation.mutate(
      {
        date,
        type: type as "MISSED_CHECKIN" | "MISSED_CHECKOUT" | "WRONG_TIME",
        requestedTime: requestedDateTime,
        reason,
      },
      {
        onSuccess: () => {
          resetForm();
          setOpen(false);
        },
      }
    );
  };

  const isValid = date && type && requestedTime && reason.length >= 5;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Request Regularization
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Attendance Regularization</DialogTitle>
          <DialogDescription>
            Submit a request to correct your attendance record. An admin will review it.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reg-date">Date</Label>
            <Input
              id="reg-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-type">Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-time">
              {type === "MISSED_CHECKIN"
                ? "Actual Check-in Time"
                : type === "MISSED_CHECKOUT"
                  ? "Actual Check-out Time"
                  : "Correct Time"}
            </Label>
            <Input
              id="reg-time"
              type="time"
              value={requestedTime}
              onChange={(e) => setRequestedTime(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-reason">Reason</Label>
            <Textarea
              id="reg-reason"
              placeholder="Explain why this regularization is needed (min 5 characters)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid || submitMutation.isPending}
            >
              {submitMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              Submit Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
