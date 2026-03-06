import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMyDeviations } from "@/hooks/useDeviations";
import { useMyRegularizations } from "@/hooks/useRegularization";
import { useActiveSession, useCheckIn, useCheckOut, useMyAttendanceHistory } from "@/hooks/useTimer";
import RegularizationForm from "@/components/attendance/RegularizationForm";
import { format } from "date-fns";
import { CalendarCheck, Loader2, Play, Square } from "lucide-react";
import { useState } from "react";

const TYPE_LABELS: Record<string, string> = {
  MISSED_CHECKIN: "Missed Check-in",
  MISSED_CHECKOUT: "Missed Check-out",
  WRONG_TIME: "Wrong Time",
};

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "secondary",
  APPROVED: "default",
  REJECTED: "destructive",
};

export default function EmployeeAttendance() {
  const [activeTab, setActiveTab] = useState("history");
  const { data: deviationsData, isLoading: deviationsLoading } = useMyDeviations({});
  const { data: regularizationsData, isLoading: regularizationsLoading } = useMyRegularizations({});
  const { data: historyData, isLoading: historyLoading } = useMyAttendanceHistory({ limit: 30 });
  const { data: activeSessionData } = useActiveSession();
  const checkInMutation = useCheckIn();
  const checkOutMutation = useCheckOut();

  const isCheckedIn = !!activeSessionData?.timer?.isActive;
  const timesheets = historyData?.data || [];

  const deviations = deviationsData?.data || [];
  const regularizations = regularizationsData?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Attendance</h1>
          <p className="text-muted-foreground">
            View your attendance history, deviations, and submit regularization requests
          </p>
        </div>
        <div className="flex gap-2">
          {isCheckedIn ? (
            <Button
              variant="destructive"
              onClick={() => checkOutMutation.mutate()}
              disabled={checkOutMutation.isPending}
              className="gap-2"
            >
              {checkOutMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Square className="h-4 w-4" />
              )}
              Check Out
            </Button>
          ) : (
            <Button
              onClick={() => checkInMutation.mutate(undefined)}
              disabled={checkInMutation.isPending}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700"
            >
              {checkInMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Check In
            </Button>
          )}
          <RegularizationForm />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="history">
            Attendance History
          </TabsTrigger>
          <TabsTrigger value="deviations">
            Late / Early
            {deviations.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {deviations.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="regularizations">
            My Requests
            {regularizations.filter((r) => r.status === "PENDING").length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {regularizations.filter((r) => r.status === "PENDING").length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Attendance History Tab */}
        <TabsContent value="history" className="mt-4">
          {historyLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : timesheets.length === 0 ? (
            <div className="rounded-lg border bg-card p-8 text-center">
              <CalendarCheck className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="font-semibold">No attendance records</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your attendance history will appear here once you start checking in.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Total Hours</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timesheets.map((ts: { id: string; workDate: string; checkInTime: string | null; checkOutTime: string | null; totalHours: number | null; status?: string }) => (
                    <TableRow key={ts.id}>
                      <TableCell>
                        {format(new Date(ts.workDate), "MMM dd, yyyy (EEE)")}
                      </TableCell>
                      <TableCell>
                        {ts.checkInTime
                          ? format(new Date(ts.checkInTime), "hh:mm a")
                          : "—"}
                      </TableCell>
                      <TableCell>
                        {ts.checkOutTime
                          ? format(new Date(ts.checkOutTime), "hh:mm a")
                          : "—"}
                      </TableCell>
                      <TableCell>
                        {ts.totalHours != null
                          ? `${Number(ts.totalHours).toFixed(1)}h`
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={ts.checkOutTime ? "default" : ts.checkInTime ? "secondary" : "outline"}>
                          {ts.checkOutTime ? "Complete" : ts.checkInTime ? "In Progress" : "No Record"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* Deviations Tab */}
        <TabsContent value="deviations" className="mt-4">
          {deviationsLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : deviations.length === 0 ? (
            <div className="rounded-lg border bg-card p-8 text-center">
              <CalendarCheck className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="font-semibold">No deviations</h3>
              <p className="text-sm text-muted-foreground mt-1">
                You have no late arrivals or early departures recorded.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Late (min)</TableHead>
                    <TableHead>Early (min)</TableHead>
                    <TableHead>Excused</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deviations.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell>
                        {format(new Date(d.date), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        {d.lateMinutes > 0 ? (
                          <Badge variant="destructive">{d.lateMinutes} min</Badge>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>
                        {d.earlyMinutes > 0 ? (
                          <Badge variant="outline">{d.earlyMinutes} min</Badge>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>
                        {d.isExcused ? (
                          <Badge variant="default">Excused</Badge>
                        ) : (
                          <Badge variant="secondary">No</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* Regularization Requests Tab */}
        <TabsContent value="regularizations" className="mt-4">
          {regularizationsLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : regularizations.length === 0 ? (
            <div className="rounded-lg border bg-card p-8 text-center">
              <CalendarCheck className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="font-semibold">No requests</h3>
              <p className="text-sm text-muted-foreground mt-1">
                You haven't submitted any regularization requests yet.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Requested Time</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {regularizations.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        {format(new Date(r.date), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {TYPE_LABELS[r.type] || r.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(r.requestedTime), "hh:mm a")}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {r.reason}
                      </TableCell>
                      <TableCell>
                        <Badge variant={STATUS_VARIANTS[r.status] || "secondary"}>
                          {r.status}
                        </Badge>
                        {r.adminNote && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {r.adminNote}
                          </p>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
