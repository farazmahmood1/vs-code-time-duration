import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save } from "lucide-react";
import {
  useMyAvailability,
  useUpdateMyAvailability,
} from "@/hooks/useAvailability";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface SlotForm {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export function AvailabilityGrid() {
  const { data: availability, isLoading } = useMyAvailability();
  const updateMutation = useUpdateMyAvailability();

  const [slots, setSlots] = useState<SlotForm[]>([]);

  useEffect(() => {
    if (availability) {
      // Build full 7-day grid from existing data
      const initial: SlotForm[] = DAY_NAMES.map((_, i) => {
        const existing = availability.find((s) => s.dayOfWeek === i);
        return existing
          ? {
              dayOfWeek: i,
              startTime: existing.startTime,
              endTime: existing.endTime,
              isAvailable: existing.isAvailable,
            }
          : {
              dayOfWeek: i,
              startTime: "09:00",
              endTime: "17:00",
              isAvailable: true,
            };
      });
      setSlots(initial);
    }
  }, [availability]);

  const handleToggle = (dayOfWeek: number) => {
    setSlots((prev) =>
      prev.map((s) =>
        s.dayOfWeek === dayOfWeek ? { ...s, isAvailable: !s.isAvailable } : s
      )
    );
  };

  const handleTimeChange = (
    dayOfWeek: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setSlots((prev) =>
      prev.map((s) =>
        s.dayOfWeek === dayOfWeek ? { ...s, [field]: value } : s
      )
    );
  };

  const handleSave = () => {
    updateMutation.mutate(slots);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">My Availability</CardTitle>
        <Button onClick={handleSave} disabled={updateMutation.isPending}>
          {updateMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {slots.map((slot) => (
            <div
              key={slot.dayOfWeek}
              className={`flex items-center gap-4 p-3 rounded-lg border ${
                slot.isAvailable ? "bg-background" : "bg-muted/50 opacity-60"
              }`}
            >
              <div className="w-28 font-medium text-sm">
                {DAY_NAMES[slot.dayOfWeek]}
              </div>
              <Switch
                checked={slot.isAvailable}
                onCheckedChange={() => handleToggle(slot.dayOfWeek)}
              />
              <div className="flex items-center gap-2 flex-1">
                <Input
                  type="time"
                  value={slot.startTime}
                  onChange={(e) =>
                    handleTimeChange(slot.dayOfWeek, "startTime", e.target.value)
                  }
                  disabled={!slot.isAvailable}
                  className="w-32"
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="time"
                  value={slot.endTime}
                  onChange={(e) =>
                    handleTimeChange(slot.dayOfWeek, "endTime", e.target.value)
                  }
                  disabled={!slot.isAvailable}
                  className="w-32"
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
