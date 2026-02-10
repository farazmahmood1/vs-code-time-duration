import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  type CalendarLeave,
  type Holiday,
  useCalendarData,
  useCreateHoliday,
  useDeleteHoliday,
} from "@/hooks/useCalendar";
import { useRole } from "@/hooks/useRole";
import { cn } from "@/lib/utils";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isToday,
  startOfMonth,
  subMonths,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";

const LEAVE_COLORS: Record<string, string> = {
  ANNUAL_LEAVE: "bg-blue-100 text-blue-700",
  SICK_LEAVE: "bg-red-100 text-red-700",
  CASUAL_LEAVE: "bg-green-100 text-green-700",
  MATERNITY_LEAVE: "bg-purple-100 text-purple-700",
  PERSONAL_LEAVE: "bg-yellow-100 text-yellow-700",
  UNPAID_LEAVE: "bg-gray-100 text-gray-700",
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarPage() {
  const { isAdmin } = useRole();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidayOpen, setHolidayOpen] = useState(false);
  const [holidayForm, setHolidayForm] = useState({
    name: "",
    date: "",
    isOptional: false,
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const { data, isLoading } = useCalendarData(year, month);
  const createHoliday = useCreateHoliday();
  const deleteHoliday = useDeleteHoliday();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart);

  const holidayMap = useMemo(() => {
    const map = new Map<string, Holiday[]>();
    data?.holidays?.forEach((h) => {
      const key = format(new Date(h.date), "yyyy-MM-dd");
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(h);
    });
    return map;
  }, [data?.holidays]);

  const leaveMap = useMemo(() => {
    const map = new Map<string, CalendarLeave[]>();
    data?.leaves?.forEach((l) => {
      const start = new Date(l.startDate);
      const end = new Date(l.endDate);
      const interval = eachDayOfInterval({ start, end });
      interval.forEach((d) => {
        if (d >= monthStart && d <= monthEnd) {
          const key = format(d, "yyyy-MM-dd");
          if (!map.has(key)) map.set(key, []);
          map.get(key)!.push(l);
        }
      });
    });
    return map;
  }, [data?.leaves, monthStart, monthEnd]);

  const handleCreateHoliday = () => {
    createHoliday.mutate(holidayForm, {
      onSuccess: () => {
        setHolidayOpen(false);
        setHolidayForm({ name: "", date: "", isOptional: false });
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Calendar</h1>
          <p className="text-muted-foreground">
            Holidays, leaves, and team availability
          </p>
        </div>
        {isAdmin && (
          <Dialog open={holidayOpen} onOpenChange={setHolidayOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Holiday
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Holiday</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={holidayForm.name}
                    onChange={(e) =>
                      setHolidayForm((p) => ({ ...p, name: e.target.value }))
                    }
                    placeholder="e.g. Independence Day"
                  />
                </div>
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={holidayForm.date}
                    onChange={(e) =>
                      setHolidayForm((p) => ({ ...p, date: e.target.value }))
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={holidayForm.isOptional}
                    onCheckedChange={(v) =>
                      setHolidayForm((p) => ({ ...p, isOptional: v }))
                    }
                  />
                  <Label>Optional Holiday</Label>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setHolidayOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateHoliday}
                  disabled={
                    !holidayForm.name ||
                    !holidayForm.date ||
                    createHoliday.isPending
                  }
                >
                  {createHoliday.isPending && (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  )}
                  Add
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Month navigation */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold min-w-[200px] text-center">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentDate(new Date())}
        >
          Today
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 border-b">
              {WEEKDAYS.map((d) => (
                <div
                  key={d}
                  className="p-2 text-center text-xs font-medium text-muted-foreground"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7">
              {/* Empty cells for days before month start */}
              {Array.from({ length: startDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[100px] border-b border-r bg-muted/20" />
              ))}

              {days.map((day) => {
                const key = format(day, "yyyy-MM-dd");
                const dayHolidays = holidayMap.get(key) || [];
                const dayLeaves = leaveMap.get(key) || [];
                const today = isToday(day);

                return (
                  <div
                    key={key}
                    className={cn(
                      "min-h-[100px] border-b border-r p-1.5",
                      today && "bg-blue-50/50"
                    )}
                  >
                    <div
                      className={cn(
                        "text-sm font-medium mb-1",
                        today &&
                          "bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs"
                      )}
                    >
                      {format(day, "d")}
                    </div>

                    {/* Holidays */}
                    {dayHolidays.map((h) => (
                      <div
                        key={h.id}
                        className="flex items-center gap-1 text-[10px] bg-red-100 text-red-700 rounded px-1 py-0.5 mb-0.5 truncate group"
                      >
                        <span className="truncate">
                          {h.isOptional ? "🔸" : "🔴"} {h.name}
                        </span>
                        {isAdmin && (
                          <button
                            onClick={() => deleteHoliday.mutate(h.id)}
                            className="hidden group-hover:block ml-auto"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))}

                    {/* Leaves */}
                    {dayLeaves.slice(0, 2).map((l, i) => (
                      <div
                        key={`${l.id}-${i}`}
                        className={cn(
                          "text-[10px] rounded px-1 py-0.5 mb-0.5 truncate",
                          LEAVE_COLORS[l.leaveType] || "bg-gray-100 text-gray-700"
                        )}
                      >
                        {l.employee.name.split(" ")[0]} —{" "}
                        {l.leaveType.replace(/_/g, " ")}
                      </div>
                    ))}
                    {dayLeaves.length > 2 && (
                      <div className="text-[10px] text-muted-foreground">
                        +{dayLeaves.length - 2} more
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-red-100" /> Holiday
        </span>
        {Object.entries(LEAVE_COLORS).map(([type, cls]) => (
          <span key={type} className="flex items-center gap-1">
            <span className={cn("w-3 h-3 rounded", cls.split(" ")[0])} />
            {type.replace(/_/g, " ")}
          </span>
        ))}
      </div>
    </div>
  );
}
