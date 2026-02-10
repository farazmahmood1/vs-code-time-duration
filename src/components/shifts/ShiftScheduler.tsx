import { useState, useMemo } from "react";
import { format, addDays, startOfWeek, addWeeks, subWeeks } from "date-fns";
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Plus, AlertTriangle } from "lucide-react";
import {
  useShiftSchedule,
  useMoveScheduleEntry,
  useShiftConflicts,
  type ScheduleEntry,
} from "@/hooks/useShiftSchedule";
import { useShifts } from "@/hooks/useShifts";
import { useEmployees } from "@/hooks/useEmployees";
import { DroppableCell } from "./DroppableCell";
import { DraggableShiftBlock } from "./DraggableShiftBlock";
import { CreateScheduleEntryDialog } from "./CreateScheduleEntryDialog";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function ShiftScheduler() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createDate, setCreateDate] = useState("");
  const [createEmployeeId, setCreateEmployeeId] = useState("");
  const [activeEntry, setActiveEntry] = useState<ScheduleEntry | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const weekStart = useMemo(() => {
    const base = startOfWeek(new Date(), { weekStartsOn: 1 });
    return weekOffset > 0
      ? addWeeks(base, weekOffset)
      : weekOffset < 0
        ? subWeeks(base, Math.abs(weekOffset))
        : base;
  }, [weekOffset]);

  const weekStartStr = format(weekStart, "yyyy-MM-dd");

  const { data: schedule = [], isLoading } = useShiftSchedule(
    weekStartStr,
    departmentFilter || undefined
  );
  const { data: conflicts = [] } = useShiftConflicts(weekStartStr);
  const { data: shifts = [] } = useShifts();
  const { data: employeesData } = useEmployees(1, "", "", "", "", "");
  const employees = employeesData?.employees || [];
  const moveMutation = useMoveScheduleEntry();

  // Get unique employees from schedule
  const scheduleEmployees = useMemo(() => {
    const map = new Map<string, ScheduleEntry["employee"]>();
    schedule.forEach((entry) => map.set(entry.employeeId, entry.employee));
    return Array.from(map.values());
  }, [schedule]);

  // Group entries by employeeId + date
  const entriesByCell = useMemo(() => {
    const map: Record<string, ScheduleEntry[]> = {};
    schedule.forEach((entry) => {
      const dateStr = format(new Date(entry.date), "yyyy-MM-dd");
      const key = `${entry.employeeId}-${dateStr}`;
      if (!map[key]) map[key] = [];
      map[key].push(entry);
    });
    return map;
  }, [schedule]);

  // Build conflict set for quick lookup
  const conflictEntryIds = useMemo(() => {
    const set = new Set<string>();
    conflicts.forEach((c) => {
      set.add(c.entryId);
      set.add(c.conflictingEntryId);
    });
    return set;
  }, [conflicts]);

  const dates = DAYS.map((_, i) => addDays(weekStart, i));

  const handleDragStart = (event: DragStartEvent) => {
    const entry = schedule.find((e) => e.id === event.active.id);
    setActiveEntry(entry || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveEntry(null);
    const { active, over } = event;
    if (!over) return;

    const [targetEmployeeId, targetDate] = (over.id as string).split("||");
    const entry = schedule.find((e) => e.id === active.id);
    if (!entry) return;

    const currentDate = format(new Date(entry.date), "yyyy-MM-dd");
    if (entry.employeeId === targetEmployeeId && currentDate === targetDate)
      return;

    moveMutation.mutate({
      id: entry.id,
      date: targetDate,
      employeeId: targetEmployeeId,
    });
  };

  const handleCellClick = (employeeId: string, date: string) => {
    setCreateEmployeeId(employeeId);
    setCreateDate(date);
    setCreateDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">Shift Schedule</CardTitle>
        <div className="flex items-center gap-2">
          <Select
            value={departmentFilter}
            onValueChange={setDepartmentFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Departments</SelectItem>
              {Array.from(
                new Set(employees.map((e: any) => e.departmentId).filter(Boolean))
              ).map((deptId) => {
                const emp = employees.find(
                  (e: any) => e.departmentId === deptId
                );
                return (
                  <SelectItem key={deptId as string} value={deptId as string}>
                    {(emp as any)?.department || deptId}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <Button
            size="sm"
            onClick={() => {
              setCreateEmployeeId("");
              setCreateDate("");
              setCreateDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Entry
          </Button>
        </div>
      </CardHeader>
      <CardContent>
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

        {/* Conflict warnings */}
        {conflicts.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-destructive mb-3 p-2 bg-destructive/10 rounded">
            <AlertTriangle className="h-4 w-4" />
            <span>
              {conflicts.length} conflict{conflicts.length > 1 ? "s" : ""}{" "}
              detected this week
            </span>
          </div>
        )}

        {/* Schedule grid */}
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading schedule...
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2 bg-muted text-left text-sm font-medium min-w-[140px]">
                      Employee
                    </th>
                    {dates.map((date, i) => (
                      <th
                        key={i}
                        className="border p-2 bg-muted text-center text-sm font-medium min-w-[120px]"
                      >
                        <div>{DAYS[i]}</div>
                        <div className="text-xs text-muted-foreground">
                          {format(date, "MMM d")}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {scheduleEmployees.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="border p-8 text-center text-muted-foreground"
                      >
                        No schedule entries this week. Click "Add Entry" to
                        create one.
                      </td>
                    </tr>
                  ) : (
                    scheduleEmployees.map((employee) => (
                      <tr key={employee.id}>
                        <td className="border p-2">
                          <div className="flex items-center gap-2">
                            {employee.image ? (
                              <img
                                src={employee.image}
                                alt={employee.name}
                                className="h-6 w-6 rounded-full"
                              />
                            ) : (
                              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                                {employee.name.charAt(0)}
                              </div>
                            )}
                            <span className="text-sm font-medium truncate max-w-[100px]">
                              {employee.name}
                            </span>
                          </div>
                        </td>
                        {dates.map((date, i) => {
                          const dateStr = format(date, "yyyy-MM-dd");
                          const cellKey = `${employee.id}-${dateStr}`;
                          const cellEntries = entriesByCell[cellKey] || [];

                          return (
                            <DroppableCell
                              key={i}
                              id={`${employee.id}||${dateStr}`}
                              onClick={() =>
                                handleCellClick(employee.id, dateStr)
                              }
                            >
                              {cellEntries.map((entry) => (
                                <DraggableShiftBlock
                                  key={entry.id}
                                  entry={entry}
                                  hasConflict={conflictEntryIds.has(entry.id)}
                                />
                              ))}
                            </DroppableCell>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <DragOverlay>
              {activeEntry ? (
                <div className="bg-primary/20 border border-primary rounded px-2 py-1 text-xs shadow-lg">
                  {activeEntry.shift.name} ({activeEntry.startTime}-
                  {activeEntry.endTime})
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </CardContent>

      <CreateScheduleEntryDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        defaultDate={createDate}
        defaultEmployeeId={createEmployeeId}
        shifts={shifts}
        employees={employees}
      />
    </Card>
  );
}
