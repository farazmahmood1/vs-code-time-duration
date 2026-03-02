import { useIdleTimeReport } from "@/hooks/useReports";
import { Activity, TrendingDown, TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";

interface EfficiencyWidgetProps {
  weeklyHours: Array<{ week: string; hours: number; percentage: string }>;
}

export const EfficiencyWidget = ({ weeklyHours }: EfficiencyWidgetProps) => {
  const { data: idleData } = useIdleTimeReport();

  const efficiency = idleData ? Math.round(100 - idleData.idlePercentage) : null;

  // Compute change from last two weeks
  let change: number | null = null;
  if (weeklyHours.length >= 2) {
    const current = weeklyHours[weeklyHours.length - 1].hours;
    const previous = weeklyHours[weeklyHours.length - 2].hours;
    if (previous > 0) {
      change = Math.round(((current - previous) / previous) * 100);
    }
  }

  const isPositive = change !== null && change >= 0;

  return (
    <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-6 hover:shadow-md transition-all duration-300 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10">
            <Activity className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Efficiency</h3>
            <p className="text-[11px] text-muted-foreground">Team productivity</p>
          </div>
        </div>
        {change !== null && (
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
            isPositive
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
              : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
          }`}>
            {isPositive ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            {isPositive ? "+" : ""}{change}%
          </div>
        )}
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-3xl font-bold text-foreground">
          {efficiency !== null ? `${efficiency}%` : "—"}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mb-3">vs last week</p>

      {/* Sparkline */}
      {weeklyHours.length > 0 && (
        <div className="h-[80px] w-full -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyHours} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="effGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="hours"
                stroke="#4f46e5"
                strokeWidth={2}
                fill="url(#effGradient)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
