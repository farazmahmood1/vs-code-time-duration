import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResponsiveDialog from "@/components/ResponsiveDialog";
import {
  useAllOvertime,
  useOvertimeAlerts,
  useOvertimeSummary,
  useOvertimeConfig,
  useUpdateOvertimeConfig,
  type OvertimeConfig,
} from "@/hooks/useOvertime";
import {
  AlertTriangle,
  Clock,
  Settings2,
  TrendingUp,
} from "lucide-react";
import { format } from "date-fns";

export default function OvertimePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [configDialogOpen, setConfigDialogOpen] = useState(false);

  const { data: summary, isLoading: summaryLoading } = useOvertimeSummary();
  const { data: alerts } = useOvertimeAlerts();
  const { data: records } = useAllOvertime({ page: 1 });
  const { data: config } = useOvertimeConfig();
  const updateConfig = useUpdateOvertimeConfig();

  const [configForm, setConfigForm] = useState<Partial<OvertimeConfig>>({});

  const handleOpenConfig = () => {
    if (config) {
      setConfigForm({
        dailyLimitHours: config.dailyLimitHours,
        weeklyLimitHours: config.weeklyLimitHours,
        monthlyLimitHours: config.monthlyLimitHours,
        alertThreshold: config.alertThreshold,
      });
    }
    setConfigDialogOpen(true);
  };

  const handleSaveConfig = () => {
    updateConfig.mutate(configForm, {
      onSuccess: () => setConfigDialogOpen(false),
    });
  };

  if (summaryLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Overtime Tracking</h1>
          <p className="text-muted-foreground mt-1">
            Monitor employee overtime hours and alerts
          </p>
        </div>
        <Button variant="outline" onClick={handleOpenConfig}>
          <Settings2 className="h-4 w-4 mr-2" />
          Configure Limits
        </Button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Weekly Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {summary.weekly.totalHours.toFixed(1)}h
              </p>
              <Progress
                value={Math.min(
                  (summary.weekly.totalHours / summary.weekly.limit) * 100,
                  100
                )}
                className="h-2 mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {summary.weekly.overtimeHours.toFixed(1)}h overtime / {summary.weekly.limit}h limit
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Monthly Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {summary.monthly.totalHours.toFixed(1)}h
              </p>
              <Progress
                value={Math.min(
                  (summary.monthly.totalHours / summary.monthly.limit) * 100,
                  100
                )}
                className="h-2 mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {summary.monthly.overtimeHours.toFixed(1)}h overtime / {summary.monthly.limit}h limit
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Active Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{alerts?.length || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Employees near or exceeding limits
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Alerts</TabsTrigger>
          <TabsTrigger value="records">Records</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          {!alerts || alerts.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                No overtime alerts at this time
              </p>
            </Card>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Current Hours</TableHead>
                    <TableHead>Limit</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.map((alert, idx) => (
                    <TableRow key={`${alert.userId}-${alert.type}-${idx}`}>
                      <TableCell>
                        <p className="font-medium">{alert.user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {alert.user.email}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {alert.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{alert.currentHours.toFixed(1)}h</TableCell>
                      <TableCell>{alert.limitHours}h</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={Math.min(alert.percentage, 100)}
                            className="h-2 w-20"
                          />
                          <span className="text-xs">{alert.percentage}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={alert.exceeded ? "destructive" : "secondary"}
                        >
                          {alert.exceeded ? "Exceeded" : "Warning"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="records" className="mt-4">
          {!records?.data || records.data.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No overtime records yet</p>
            </Card>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Regular Hours</TableHead>
                    <TableHead>Overtime</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.data.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <p className="font-medium">
                          {record.user?.name || "Unknown"}
                        </p>
                      </TableCell>
                      <TableCell>
                        {format(new Date(record.date), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>{record.regularHours.toFixed(1)}h</TableCell>
                      <TableCell>
                        {record.overtimeHours > 0 ? (
                          <Badge variant="destructive">
                            +{record.overtimeHours.toFixed(1)}h
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">0h</span>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {record.totalHours.toFixed(1)}h
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Config Dialog */}
      <ResponsiveDialog
        open={configDialogOpen}
        onOpenChange={setConfigDialogOpen}
        title="Overtime Configuration"
        description="Set overtime limits and alert thresholds"
      >
        <div className="space-y-4">
          <div>
            <Label>Daily Limit (hours)</Label>
            <Input
              type="number"
              min={1}
              step={0.5}
              value={configForm.dailyLimitHours || ""}
              onChange={(e) =>
                setConfigForm({
                  ...configForm,
                  dailyLimitHours: parseFloat(e.target.value) || 0,
                })
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label>Weekly Limit (hours)</Label>
            <Input
              type="number"
              min={1}
              step={0.5}
              value={configForm.weeklyLimitHours || ""}
              onChange={(e) =>
                setConfigForm({
                  ...configForm,
                  weeklyLimitHours: parseFloat(e.target.value) || 0,
                })
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label>Monthly Limit (hours)</Label>
            <Input
              type="number"
              min={1}
              step={0.5}
              value={configForm.monthlyLimitHours || ""}
              onChange={(e) =>
                setConfigForm({
                  ...configForm,
                  monthlyLimitHours: parseFloat(e.target.value) || 0,
                })
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label>Alert Threshold (0-1)</Label>
            <Input
              type="number"
              min={0}
              max={1}
              step={0.05}
              value={configForm.alertThreshold || ""}
              onChange={(e) =>
                setConfigForm({
                  ...configForm,
                  alertThreshold: parseFloat(e.target.value) || 0,
                })
              }
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Alert when employee reaches this percentage of limit (e.g., 0.9 =
              90%)
            </p>
          </div>
        </div>

        <div className="flex gap-2 pt-6 justify-end">
          <Button variant="outline" onClick={() => setConfigDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveConfig} disabled={updateConfig.isPending}>
            {updateConfig.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </ResponsiveDialog>
    </div>
  );
}
