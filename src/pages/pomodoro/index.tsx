import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PomodoroTimer } from "@/components/pomodoro/PomodoroTimer";
import { PomodoroStatsCards } from "@/components/pomodoro/PomodoroStatsCards";
import { PomodoroHistory } from "@/components/pomodoro/PomodoroHistory";
import { PomodoroSettingsForm } from "@/components/pomodoro/PomodoroSettingsForm";
import { usePomodoroStats, usePomodoroSettings } from "@/hooks/usePomodoro";

export default function PomodoroPage() {
  const { data: stats } = usePomodoroStats();
  const { data: settings } = usePomodoroSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pomodoro Timer</h1>
        <p className="text-muted-foreground">
          Stay focused with timed work sessions and breaks.
        </p>
      </div>
      <Tabs defaultValue="timer">
        <TabsList>
          <TabsTrigger value="timer">Timer</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="timer" className="space-y-6">
          <PomodoroStatsCards stats={stats} />
          <div className="flex justify-center py-8">
            {settings && <PomodoroTimer settings={settings} />}
          </div>
        </TabsContent>
        <TabsContent value="history">
          <PomodoroHistory />
        </TabsContent>
        <TabsContent value="settings">
          <PomodoroSettingsForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
