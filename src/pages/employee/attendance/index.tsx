import { Badge } from "@/components/ui/badge";
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
import RegularizationForm from "@/components/attendance/RegularizationForm";
import { format } from "date-fns";
import { CalendarCheck, Loader2 } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState("deviations");
  const { data: deviationsData, isLoading: deviationsLoading } = useMyDeviations({});
  const { data: regularizationsData, isLoading: regularizationsLoading } = useMyRegularizations({});

  const deviations = deviationsData?.data || [];
  const regularizations = regularizationsData?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Attendance</h1>
          <p className="text-muted-foreground">
            View your attendance deviations and submit regularization requests
          </p>
        </div>
        <RegularizationForm />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
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
