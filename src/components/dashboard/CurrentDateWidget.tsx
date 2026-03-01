import { format } from "date-fns";
import { CalendarDays } from "lucide-react";

export const CurrentDateWidget = () => {
  const now = new Date();

  return (
    <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-6 hover:shadow-md transition-all duration-300 group flex flex-col justify-between h-full">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {format(now, "EEEE")}
          </p>
          <p className="text-5xl font-bold text-primary mt-1 leading-tight">
            {format(now, "dd")}
          </p>
        </div>
        <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 group-hover:scale-110 transition-transform duration-300">
          <CalendarDays className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        </div>
      </div>
      <p className="text-sm font-medium text-foreground mt-3">
        {format(now, "MMMM, yyyy")}
      </p>
    </div>
  );
};
