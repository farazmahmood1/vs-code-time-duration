import { useMemo, useState } from "react";
import { format, startOfWeek, addDays, addWeeks, subWeeks } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Clock, ArrowRightLeft, Loader2 } from "lucide-react";
import { useMyShift } from "@/hooks/useShifts";
import { useShiftSchedule, type ScheduleEntry } from "@/hooks/useShiftSchedule";
import { useMySwapRequests } from "@/hooks/useShiftSwap";
import { useAuth } from "@/hooks/useAuth";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function EmployeeShiftsPage() {
  const { user } = useAuth();
  const { data: currentShift } = useMyShift();
  const [weekOffset, setWeekOffset] = useState(0);
  const { data: swapRequests = [], isLoading: swapsLoading } = useMySwapRequests();

  const weekStart = useMemo(() => {
    const base = startOfWeek(new Date(), { weekStartsOn: 1 });
    return weekOffset > 0
      ? addWeeks(base, weekOffset)
      : weekOffset < 0
        ? subWeeks(base, Math.abs(weekOffset))
        : base;
  }, [weekOffset]);

  const weekStartStr = format(weekStart, "yyyy-MM-dd");
  const { data: schedule = [], isLoading } = useShiftSchedule(weekStartStr);

  const dates = DAYS.map((_, i) => addDays(weekStart, i));

  // Filter schedule entries for current user
  const myEntries = useMemo(
    () => schedule.filter((e) => e.employeeId === user?.id),
    [schedule, user?.id]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Shifts</h1>
        <p className="text-muted-foreground">
          View your assigned shifts and swap requests
        </p>
      </div>

      {/* Current shift info */}
      {currentShift && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Assigned Shift
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold">{currentShift.name}</p>
                <p className="text-sm text-muted-foreground">
                  {currentShift.startTime} - {currentShift.endTime}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="schedule">
        <TabsList>
          <TabsTrigger value="schedule">Weekly Schedule</TabsTrigger>
          <TabsTrigger value="swaps">
            Swap Requests
            {swapRequests.filter((r) => r.status === "PENDING").length > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 px-1.5 text-xs">
                {swapRequests.filter((r) => r.status === "PENDING").length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          <Card>
            <CardContent className="pt-6">
              {/* Week navigation */}
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setWeekOffset((w) => w - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {format(weekStart, "MMM d")} -{" "}
                    {format(addDays(weekStart, 6), "MMM d, yyyy")}
                  </span>
                  {weekOffset !== 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setWeekOffset(0)}
                    >
                      Today
                    </Button>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setWeekOffset((w) => w + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : myEntries.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No shifts scheduled this week
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-2">
                  {dates.map((date, i) => {
                    const dateStr = format(date, "yyyy-MM-dd");
                    const dayEntries = myEntries.filter(
                      (e) =>
                        format(new Date(e.date), "yyyy-MM-dd") === dateStr
                    );
                    const isToday =
                      format(new Date(), "yyyy-MM-dd") === dateStr;

                    return (
                      <div
                        key={i}
                        className={`border rounded-lg p-2 min-h-[100px] ${
                          isToday ? "border-primary bg-primary/5" : ""
                        }`}
                      >
                        <div className="text-center mb-2">
                          <div className="text-xs font-medium">{DAYS[i]}</div>
                          <div className="text-lg font-bold">
                            {format(date, "d")}
                          </div>
                        </div>
                        {dayEntries.map((entry) => (
                          <div
                            key={entry.id}
                            className="bg-primary/10 rounded px-2 py-1 text-xs mb-1"
                          >
                            <div className="font-medium">
                              {entry.shift.name}
                            </div>
                            <div className="text-muted-foreground">
                              {entry.startTime}-{entry.endTime}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="swaps">
          <Card>
            <CardContent className="pt-6">
              {swapsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : swapRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ArrowRightLeft className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  No swap requests yet
                </div>
              ) : (
                <div className="space-y-3">
                  {swapRequests.map((req) => (
                    <div
                      key={req.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">
                            {req.requester.id === user?.id
                              ? `You → ${req.targetEmployee.name}`
                              : `${req.requester.name} → You`}
                          </p>
                          {req.reason && (
                            <p className="text-xs text-muted-foreground">
                              {req.reason}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge
                        variant={
                          req.status === "APPROVED"
                            ? "default"
                            : req.status === "REJECTED"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {req.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
