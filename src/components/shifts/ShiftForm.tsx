import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import ResponsiveDialog from "@/components/ResponsiveDialog";
import type { Shift, ShiftFormData } from "@/hooks/useShifts";

interface ShiftFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shift?: Shift | null;
  onSubmit: (data: ShiftFormData) => void;
}

export function ShiftForm({
  open,
  onOpenChange,
  shift,
  onSubmit,
}: ShiftFormProps) {
  const [formData, setFormData] = React.useState<ShiftFormData>({
    name: "",
    startTime: "09:00",
    endTime: "18:00",
    graceMinutes: 15,
    breakMinutes: 60,
    isDefault: false,
    isActive: true,
  });

  React.useEffect(() => {
    if (shift) {
      setFormData({
        name: shift.name,
        startTime: shift.startTime,
        endTime: shift.endTime,
        graceMinutes: shift.graceMinutes,
        breakMinutes: shift.breakMinutes,
        isDefault: shift.isDefault,
        isActive: shift.isActive,
      });
    } else {
      setFormData({
        name: "",
        startTime: "09:00",
        endTime: "18:00",
        graceMinutes: 15,
        breakMinutes: 60,
        isDefault: false,
        isActive: true,
      });
    }
  }, [shift, open]);

  const handleSubmit = () => {
    onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={shift ? "Edit Shift" : "Create Shift"}
      description={
        shift ? "Update shift details" : "Define a new work shift schedule"
      }
    >
      <div className="space-y-4">
        <div>
          <Label>Shift Name</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Morning Shift, Night Shift"
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Start Time</Label>
            <Input
              type="time"
              value={formData.startTime}
              onChange={(e) =>
                setFormData({ ...formData, startTime: e.target.value })
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label>End Time</Label>
            <Input
              type="time"
              value={formData.endTime}
              onChange={(e) =>
                setFormData({ ...formData, endTime: e.target.value })
              }
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Grace Period (minutes)</Label>
            <Input
              type="number"
              min={0}
              max={120}
              value={formData.graceMinutes}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  graceMinutes: parseInt(e.target.value) || 0,
                })
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label>Break Duration (minutes)</Label>
            <Input
              type="number"
              min={0}
              max={180}
              value={formData.breakMinutes}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  breakMinutes: parseInt(e.target.value) || 0,
                })
              }
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Default Shift</Label>
            <p className="text-sm text-muted-foreground">
              Auto-assign to new employees
            </p>
          </div>
          <Switch
            checked={formData.isDefault}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isDefault: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Active</Label>
            <p className="text-sm text-muted-foreground">
              Inactive shifts can't be assigned
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
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!formData.name.trim()}>
          {shift ? "Update" : "Create"}
        </Button>
      </div>
    </ResponsiveDialog>
  );
}
