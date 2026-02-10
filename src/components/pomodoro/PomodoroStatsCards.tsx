import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Target, Clock } from "lucide-react";
import type { PomodoroStats } from "@/hooks/usePomodoro";

export function PomodoroStatsCards({ stats }: { stats?: PomodoroStats }) {
  const cards = [
    {
      title: "Total Focus Time",
      value: stats
        ? `${Math.floor(stats.totalFocusMinutes / 60)}h ${stats.totalFocusMinutes % 60}m`
        : "--",
      icon: Clock,
    },
    {
      title: "Sessions Completed",
      value: stats?.sessionsCompleted ?? "--",
      icon: Target,
    },
    {
      title: "Current Streak",
      value: stats ? `${stats.currentStreak} days` : "--",
      icon: Flame,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
