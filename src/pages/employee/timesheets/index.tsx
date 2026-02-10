import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useCurrentWeekData,
  useMyTimesheetSubmissions,
  useSubmitTimesheet,
  type TimesheetEntryInput,
} from "@/hooks/useTimesheetSubmissions";
import { format, startOfWeek, addDays } from "date-fns";
import { CalendarDays, Clock, Loader2, Send } from "lucide-react";
import { useEffect, useState } from "react";

// Inline project fetch for the select
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

function useProjects() {
  return useQuery({
    queryKey: ["projects-list"],
    queryFn: async () => {
      const { data } = await api.get("/projects");
      return data.data as { id: string; name: string }[];
    },
  });
}

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive"> = {
  PENDING: "secondary",
  APPROVED: "default",
  REJECTED: "destructive",
};

function getWeekStart(date: Date) {
  return startOfWeek(date, { weekStartsOn: 1 }); // Monday
}

export default function EmployeeTimesheets() {
  const [selectedWeek, setSelectedWeek] = useState(() => {
    const ws = getWeekStart(new Date());
    return ws.toISOString().split("T")[0];
  });

  const weekStartDate = new Date(selectedWeek);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStartDate, i));

  const { data: weekData, isLoading: weekLoading } = useCurrentWeekData(selectedWeek);
  const { data: submissions, isLoading: submissionsLoading } = useMyTimesheetSubmissions({});
  const { data: projects } = useProjects();
  const submitMutation = useSubmitTimesheet();

  const [entries, setEntries] = useState<
    { date: string; projectId: string; hours: number; description: string }[]
  >([]);
  const [submitOpen, setSubmitOpen] = useState(false);

  // Initialize entries from current week data
  useEffect(() => {
    if (weekData && !weekData.isSubmitted) {
      const autoEntries = weekData.entries || [];
      const newEntries = weekDays.map((day) => {
        const dateStr = day.toISOString().split("T")[0];
        const existing = autoEntries.find(
          (e) => new Date(e.date).toISOString().split("T")[0] === dateStr
        );
        return {
          date: dateStr,
          projectId: existing?.projectId || "",
          hours: existing?.hours || 0,
          description: existing?.description || "",
        };
      });
      setEntries(newEntries);
    }
  }, [weekData, selectedWeek]);

  const totalHours = entries.reduce((sum, e) => sum + (e.hours || 0), 0);
  const isSubmitted = weekData?.isSubmitted || false;

  const handleSubmit = () => {
    const validEntries: TimesheetEntryInput[] = entries
      .filter((e) => e.hours > 0)
      .map((e) => ({
        date: e.date,
        projectId: e.projectId || null,
        hours: e.hours,
        description: e.description || null,
      }));

    if (validEntries.length === 0) return;

    submitMutation.mutate(
      { weekStart: selectedWeek, entries: validEntries },
      { onSuccess: () => setSubmitOpen(false) }
    );
  };

  const updateEntry = (index: number, field: string, value: string | number) => {
    setEntries((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Timesheets</h1>
          <p className="text-muted-foreground">
            Submit your weekly timesheets for approval
          </p>
        </div>
      </div>

      {/* Week Selector */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Week of {format(weekStartDate, "MMM dd, yyyy")}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={selectedWeek}
                onChange={(e) => {
                  const ws = getWeekStart(new Date(e.target.value));
                  setSelectedWeek(ws.toISOString().split("T")[0]);
                }}
                className="w-auto"
              />
              {isSubmitted && (
                <Badge variant={STATUS_VARIANTS[weekData?.submission?.status || "PENDING"]}>
                  {weekData?.submission?.status}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {weekLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : isSubmitted ? (
            <div className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Day</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {weekData?.submission?.entries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">
                          {format(new Date(entry.date), "EEE, MMM dd")}
                        </TableCell>
                        <TableCell>{entry.project?.name || "—"}</TableCell>
                        <TableCell>{entry.hours}h</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {entry.description || "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Total: <strong>{weekData?.submission?.totalHours}h</strong>
                </span>
                {weekData?.submission?.adminNote && (
                  <span className="text-sm text-muted-foreground">
                    Admin note: {weekData.submission.adminNote}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Day</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead className="w-24">Hours</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entries.map((entry, index) => (
                      <TableRow key={entry.date}>
                        <TableCell className="font-medium">
                          {format(new Date(entry.date + "T00:00:00"), "EEE, MMM dd")}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={entry.projectId}
                            onValueChange={(v) => updateEntry(index, "projectId", v)}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select project" />
                            </SelectTrigger>
                            <SelectContent>
                              {projects?.map((p) => (
                                <SelectItem key={p.id} value={p.id}>
                                  {p.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min={0}
                            max={24}
                            step={0.5}
                            value={entry.hours}
                            onChange={(e) =>
                              updateEntry(index, "hours", parseFloat(e.target.value) || 0)
                            }
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={entry.description}
                            onChange={(e) =>
                              updateEntry(index, "description", e.target.value)
                            }
                            placeholder="What did you work on?"
                            className="w-full"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Total: <strong>{totalHours}h</strong>
                  </span>
                </div>
                <Dialog open={submitOpen} onOpenChange={setSubmitOpen}>
                  <DialogTrigger asChild>
                    <Button disabled={totalHours === 0} className="gap-2">
                      <Send className="h-4 w-4" />
                      Submit Timesheet
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Submit Weekly Timesheet</DialogTitle>
                      <DialogDescription>
                        Submit your timesheet for the week of{" "}
                        {format(weekStartDate, "MMM dd, yyyy")} ({totalHours}h total).
                        This will be sent for admin approval.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setSubmitOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={submitMutation.isPending}
                      >
                        {submitMutation.isPending && (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        )}
                        Confirm Submit
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Past Submissions */}
      <Card>
        <CardHeader>
          <CardTitle>Past Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {submissionsLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !submissions?.data?.length ? (
            <p className="text-center text-muted-foreground py-4">
              No past submissions found.
            </p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Week</TableHead>
                    <TableHead>Total Hours</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.data.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell className="font-medium">
                        {format(new Date(sub.weekStart), "MMM dd")} –{" "}
                        {format(new Date(sub.weekEnd), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>{sub.totalHours}h</TableCell>
                      <TableCell>
                        <Badge variant={STATUS_VARIANTS[sub.status]}>
                          {sub.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(sub.submittedAt), "MMM dd, yyyy")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
