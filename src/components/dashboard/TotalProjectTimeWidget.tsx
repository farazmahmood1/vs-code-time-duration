import { Clock } from "lucide-react";

interface TotalProjectTimeWidgetProps {
  totalHours: number;
}

export const TotalProjectTimeWidget = ({ totalHours }: TotalProjectTimeWidgetProps) => {
  return (
    <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-6 hover:shadow-md transition-all duration-300 group flex flex-col justify-between h-full">
      <div className="flex items-start justify-between">
        <p className="text-[13px] font-medium text-muted-foreground tracking-wide">
          Total project time
        </p>
        <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-500/10 group-hover:scale-110 transition-transform duration-300">
          <Clock className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        </div>
      </div>
      <div className="mt-3">
        <div className="flex items-baseline gap-1.5">
          <span className="text-4xl font-bold text-foreground">{totalHours}</span>
          <span className="text-lg font-medium text-muted-foreground">h</span>
        </div>
        <p className="text-xs text-muted-foreground/80 mt-1">Across all projects</p>
      </div>
    </div>
  );
};
