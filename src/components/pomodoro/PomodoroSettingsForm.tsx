import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  usePomodoroSettings,
  useUpdatePomodoroSettings,
  type PomodoroSettings,
} from "@/hooks/usePomodoro";
import { Loader2 } from "lucide-react";

export function PomodoroSettingsForm() {
  const { data: settings, isLoading } = usePomodoroSettings();
  const updateSettings = useUpdatePomodoroSettings();
  const [form, setForm] = useState<PomodoroSettings>({
    focusDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    roundsBeforeLongBreak: 4,
  });

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  if (isLoading)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timer Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Focus Duration (min)</Label>
            <Input
              type="number"
              min={1}
              max={120}
              value={form.focusDuration}
              onChange={(e) =>
                setForm({
                  ...form,
                  focusDuration: parseInt(e.target.value) || 25,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Short Break (min)</Label>
            <Input
              type="number"
              min={1}
              max={30}
              value={form.breakDuration}
              onChange={(e) =>
                setForm({
                  ...form,
                  breakDuration: parseInt(e.target.value) || 5,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Long Break (min)</Label>
            <Input
              type="number"
              min={1}
              max={60}
              value={form.longBreakDuration}
              onChange={(e) =>
                setForm({
                  ...form,
                  longBreakDuration: parseInt(e.target.value) || 15,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Rounds Before Long Break</Label>
            <Input
              type="number"
              min={1}
              max={10}
              value={form.roundsBeforeLongBreak}
              onChange={(e) =>
                setForm({
                  ...form,
                  roundsBeforeLongBreak: parseInt(e.target.value) || 4,
                })
              }
            />
          </div>
        </div>
        <Button
          onClick={() => updateSettings.mutate(form)}
          disabled={updateSettings.isPending}
        >
          {updateSettings.isPending && (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          )}
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
}
