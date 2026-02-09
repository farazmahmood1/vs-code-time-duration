import { Card, CardContent } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";

type ColorVariant =
  | "green"
  | "red"
  | "red-light"
  | "blue"
  | "orange"
  | "yellow"
  | "purple"
  | "indigo"
  | "emerald"
  | "slate";

const colorConfig: Record<
  ColorVariant,
  { bg: string; text: string; icon: string; subtleBg: string }
> = {
  green: {
    bg: "bg-gradient-to-br from-green-50 to-green-50/30 dark:from-green-950/20 dark:to-green-950/5",
    text: "text-green-700 dark:text-green-400",
    icon: "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30",
    subtleBg: "bg-green-500/10",
  },
  red: {
    bg: "bg-gradient-to-br from-red-50 to-red-50/30 dark:from-red-950/20 dark:to-red-950/5",
    text: "text-red-700 dark:text-red-400",
    icon: "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30",
    subtleBg: "bg-red-500/10",
  },
  "red-light": {
    bg: "bg-gradient-to-br from-orange-50 to-orange-50/30 dark:from-orange-950/20 dark:to-orange-950/5",
    text: "text-orange-700 dark:text-orange-400",
    icon: "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30",
    subtleBg: "bg-orange-500/10",
  },
  blue: {
    bg: "bg-gradient-to-br from-blue-50 to-blue-50/30 dark:from-blue-950/20 dark:to-blue-950/5",
    text: "text-blue-700 dark:text-blue-400",
    icon: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30",
    subtleBg: "bg-blue-500/10",
  },
  orange: {
    bg: "bg-gradient-to-br from-orange-50 to-orange-50/30 dark:from-orange-950/20 dark:to-orange-950/5",
    text: "text-orange-700 dark:text-orange-400",
    icon: "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30",
    subtleBg: "bg-orange-500/10",
  },
  yellow: {
    bg: "bg-gradient-to-br from-amber-50 to-amber-50/30 dark:from-amber-950/20 dark:to-amber-950/5",
    text: "text-amber-700 dark:text-amber-400",
    icon: "text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30",
    subtleBg: "bg-amber-500/10",
  },
  purple: {
    bg: "bg-gradient-to-br from-purple-50 to-purple-50/30 dark:from-purple-950/20 dark:to-purple-950/5",
    text: "text-purple-700 dark:text-purple-400",
    icon: "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30",
    subtleBg: "bg-purple-500/10",
  },
  indigo: {
    bg: "bg-gradient-to-br from-indigo-50 to-indigo-50/30 dark:from-indigo-950/20 dark:to-indigo-950/5",
    text: "text-indigo-700 dark:text-indigo-400",
    icon: "text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/30",
    subtleBg: "bg-indigo-500/10",
  },
  emerald: {
    bg: "bg-gradient-to-br from-emerald-50 to-emerald-50/30 dark:from-emerald-950/20 dark:to-emerald-950/5",
    text: "text-emerald-700 dark:text-emerald-400",
    icon: "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30",
    subtleBg: "bg-emerald-500/10",
  },
  slate: {
    bg: "bg-gradient-to-br from-slate-50 to-slate-50/30 dark:from-slate-950/20 dark:to-slate-950/5",
    text: "text-slate-700 dark:text-slate-400",
    icon: "text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-900/30",
    subtleBg: "bg-slate-500/10",
  },
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  color?: ColorVariant;
}

export const StatCard = ({
  title,
  value,
  icon: Icon,
  subtitle,
  color = "blue",
}: StatCardProps) => {
  const config = colorConfig[color];

  return (
    <Card
      className={`${config.bg} border-0 shadow-sm hover:shadow-md transition-shadow`}
    >
      <CardContent className="px-5 py-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {title}
            </p>
            <p className={`text-3xl font-semibold ${config.text}`}>{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className={`p-2.5 rounded-xl ${config.icon}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
