import { useUpcomingMilestones } from "@/hooks/useMilestones";
import { useHolidays } from "@/hooks/useCalendar";
import { Cake, Trophy, Calendar, Loader2 } from "lucide-react";
import { format, isAfter, isBefore, addDays, differenceInCalendarDays } from "date-fns";
import { useMemo } from "react";

interface UnifiedEvent {
  id: string;
  type: "BIRTHDAY" | "WORK_ANNIVERSARY" | "HOLIDAY";
  title: string;
  subtitle: string;
  date: Date;
  daysUntil: number;
}

const eventConfig = {
  BIRTHDAY: {
    icon: Cake,
    iconBg: "bg-pink-50 dark:bg-pink-500/10",
    iconText: "text-pink-500 dark:text-pink-400",
  },
  WORK_ANNIVERSARY: {
    icon: Trophy,
    iconBg: "bg-amber-50 dark:bg-amber-500/10",
    iconText: "text-amber-500 dark:text-amber-400",
  },
  HOLIDAY: {
    icon: Calendar,
    iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
    iconText: "text-emerald-500 dark:text-emerald-400",
  },
};

const getDaysLabel = (days: number) => {
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `${days} days`;
};

export const UpcomingEventsWidget = () => {
  const { data: milestones, isLoading: milestonesLoading } = useUpcomingMilestones(14);
  const { data: holidays, isLoading: holidaysLoading } = useHolidays(new Date().getFullYear());

  const events = useMemo(() => {
    const now = new Date();
    const cutoff = addDays(now, 14);
    const unified: UnifiedEvent[] = [];

    // Add milestones
    if (milestones) {
      for (const m of milestones) {
        unified.push({
          id: `milestone-${m.userId}-${m.type}`,
          type: m.type,
          title: m.userName,
          subtitle: m.type === "BIRTHDAY" ? "Birthday" : "Work Anniversary",
          date: new Date(m.eventDate),
          daysUntil: m.daysUntil ?? differenceInCalendarDays(new Date(m.eventDate), now),
        });
      }
    }

    // Add upcoming holidays
    if (holidays) {
      for (const h of holidays) {
        const hDate = new Date(h.date);
        if (isAfter(hDate, addDays(now, -1)) && isBefore(hDate, cutoff)) {
          unified.push({
            id: `holiday-${h.id}`,
            type: "HOLIDAY",
            title: h.name,
            subtitle: h.isOptional ? "Optional Holiday" : "Public Holiday",
            date: hDate,
            daysUntil: differenceInCalendarDays(hDate, now),
          });
        }
      }
    }

    // Sort by date ascending, take first 6
    unified.sort((a, b) => a.daysUntil - b.daysUntil);
    return unified.slice(0, 6);
  }, [milestones, holidays]);

  const isLoading = milestonesLoading || holidaysLoading;

  return (
    <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-6 hover:shadow-md transition-all duration-300 h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10">
          <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground">Upcoming Events</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Next 14 days</p>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : events.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">
          No upcoming events
        </p>
      ) : (
        <div className="space-y-1">
          {events.map((event) => {
            const config = eventConfig[event.type];
            const Icon = config.icon;
            return (
              <div
                key={event.id}
                className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <div className={`p-2 rounded-xl shrink-0 ${config.iconBg}`}>
                  <Icon className={`h-3.5 w-3.5 ${config.iconText}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{event.title}</p>
                  <p className="text-[11px] text-muted-foreground">{event.subtitle}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-medium text-foreground">
                    {format(event.date, "MMM dd")}
                  </p>
                  <p className={`text-[11px] font-medium ${
                    event.daysUntil === 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : event.daysUntil <= 2
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-muted-foreground"
                  }`}>
                    {getDaysLabel(event.daysUntil)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
