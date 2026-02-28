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
  { iconBg: string; iconText: string; valueText: string }
> = {
  green: {
    iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
    iconText: "text-emerald-600 dark:text-emerald-400",
    valueText: "text-emerald-700 dark:text-emerald-400",
  },
  red: {
    iconBg: "bg-red-50 dark:bg-red-500/10",
    iconText: "text-red-500 dark:text-red-400",
    valueText: "text-red-600 dark:text-red-400",
  },
  "red-light": {
    iconBg: "bg-orange-50 dark:bg-orange-500/10",
    iconText: "text-orange-500 dark:text-orange-400",
    valueText: "text-orange-600 dark:text-orange-400",
  },
  blue: {
    iconBg: "bg-blue-50 dark:bg-blue-500/10",
    iconText: "text-blue-600 dark:text-blue-400",
    valueText: "text-blue-700 dark:text-blue-400",
  },
  orange: {
    iconBg: "bg-orange-50 dark:bg-orange-500/10",
    iconText: "text-orange-500 dark:text-orange-400",
    valueText: "text-orange-600 dark:text-orange-400",
  },
  yellow: {
    iconBg: "bg-amber-50 dark:bg-amber-500/10",
    iconText: "text-amber-500 dark:text-amber-400",
    valueText: "text-amber-600 dark:text-amber-400",
  },
  purple: {
    iconBg: "bg-violet-50 dark:bg-violet-500/10",
    iconText: "text-violet-600 dark:text-violet-400",
    valueText: "text-violet-700 dark:text-violet-400",
  },
  indigo: {
    iconBg: "bg-indigo-50 dark:bg-indigo-500/10",
    iconText: "text-indigo-600 dark:text-indigo-400",
    valueText: "text-indigo-700 dark:text-indigo-400",
  },
  emerald: {
    iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
    iconText: "text-emerald-600 dark:text-emerald-400",
    valueText: "text-emerald-700 dark:text-emerald-400",
  },
  slate: {
    iconBg: "bg-slate-100 dark:bg-slate-500/10",
    iconText: "text-slate-500 dark:text-slate-400",
    valueText: "text-slate-600 dark:text-slate-400",
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
    <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/50 hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-[13px] font-medium text-muted-foreground tracking-wide">
            {title}
          </p>
          <p className={`text-3xl font-bold ${config.valueText}`}>{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground/80">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-2xl ${config.iconBg} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`h-5 w-5 ${config.iconText}`} />
        </div>
      </div>
    </div>
  );
};
