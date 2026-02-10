import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateScheduleEntry } from "@/hooks/useShiftSchedule";
import type { Shift } from "@/hooks/useShifts";
import { Loader2 } from "lucide-react";

interface CreateScheduleEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate?: string;
  defaultEmployeeId?: string;
  shifts: Shift[];
  employees: any[];
}

export function CreateScheduleEntryDialog({
  open,
  onOpenChange,
  defaultDate = "",
  defaultEmployeeId = "",
  shifts,
  employees,
}: CreateScheduleEntryDialogProps) {
  const [employeeId, setEmployeeId] = useState(defaultEmployeeId);
  const [shiftId, setShiftId] = useState("");
  const [date, setDate] = useState(defaultDate);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const createMutation = useCreateScheduleEntry();

  useEffect(() => {
    setEmployeeId(defaultEmployeeId);
    setDate(defaultDate);
  }, [defaultEmployeeId, defaultDate]);

  // Auto-fill times when shift is selected
  useEffect(() => {
    if (shiftId) {
      const shift = shifts.find((s) => s.id === shiftId);
      if (shift) {
        setStartTime(shift.startTime);
        setEndTime(shift.endTime);
      }
    }
  }, [shiftId, shifts]);

  const handleSubmit = () => {
    if (!employeeId || !shiftId || !date || !startTime || !endTime) return;
    createMutation.mutate(
      { employeeId, shiftId, date, startTime, endTime },
      {
        onSuccess: () => {
          onOpenChange(false);
          setShiftId("");
          setStartTime("");
          setEndTime("");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Schedule Entry</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Employee</Label>
            <Select value={employeeId} onValueChange={setEmployeeId}>
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp: any) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Shift</Label>
            <Select value={shiftId} onValueChange={setShiftId}>
              <SelectTrigger>
                <SelectValue placeholder="Select shift" />
              </SelectTrigger>
              <SelectContent>
                {shifts.map((shift) => (
                  <SelectItem key={shift.id} value={shift.id}>
                    {shift.name} ({shift.startTime}-{shift.endTime})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>End Time</Label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                createMutation.isPending ||
                !employeeId ||
                !shiftId ||
                !date ||
                !startTime ||
                !endTime
              }
            >
              {createMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              Create
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
