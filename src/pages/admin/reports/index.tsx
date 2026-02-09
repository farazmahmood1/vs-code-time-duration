import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import {
  useAppUsageReport,
  useAppUsageByCategory,
  useIdleTimeSummary,
  useAttendanceHeatmap,
  useDepartmentComparison,
  useCostAnalysis,
  useCostByDepartment,
} from "@/hooks/useReports";
import { format } from "date-fns";
import { BarChart3, Clock, DollarSign, Loader2, Monitor, Users } from "lucide-react";
import { useState } from "react";

const CATEGORY_COLORS: Record<string, string> = {
  PRODUCTIVE: "bg-green-500",
  NEUTRAL: "bg-blue-500",
  UNPRODUCTIVE: "bg-red-500",
  UNCATEGORIZED: "bg-gray-400",
};

const CATEGORY_TEXT_COLORS: Record<string, string> = {
  PRODUCTIVE: "text-green-700",
  NEUTRAL: "text-blue-700",
  UNPRODUCTIVE: "text-red-700",
  UNCATEGORIZED: "text-gray-500",
};

const HEATMAP_COLORS: Record<string, string> = {
  present: "bg-green-400",
  late: "bg-yellow-400",
  "half-day": "bg-orange-400",
  absent: "bg-red-300",
  leave: "bg-blue-300",
};

export default function AdminReports() {
  const [activeTab, setActiveTab] = useState("app-usage");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [heatmapUserId, setHeatmapUserId] = useState("");
  const [heatmapYear] = useState(new Date().getFullYear());
  const [heatmapMonth, setHeatmapMonth] = useState(new Date().getMonth() + 1);

  const dateParams = {
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  };

  const { data: appUsage, isLoading: appUsageLoading } = useAppUsageReport(dateParams);
  const { data: categoryData } = useAppUsageByCategory(dateParams);
  const { data: idleSummary, isLoading: idleLoading } = useIdleTimeSummary(dateParams);
  const { data: heatmapData, isLoading: heatmapLoading } = useAttendanceHeatmap({
    userId: heatmapUserId || undefined,
    year: heatmapYear,
    month: heatmapMonth,
  });
  const { data: deptComparison, isLoading: deptLoading } = useDepartmentComparison(dateParams);
  const { data: costData, isLoading: costLoading } = useCostAnalysis(dateParams);
  const { data: deptCostData } = useCostByDepartment(dateParams);

  const totalCategoryMinutes = categoryData
    ? Object.values(categoryData).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Insights into productivity, attendance, and costs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-auto"
            placeholder="Start date"
          />
          <span className="text-muted-foreground">to</span>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-auto"
            placeholder="End date"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="app-usage" className="gap-1">
            <Monitor className="h-3.5 w-3.5" /> App Usage
          </TabsTrigger>
          <TabsTrigger value="idle-time" className="gap-1">
            <Clock className="h-3.5 w-3.5" /> Idle Time
          </TabsTrigger>
          <TabsTrigger value="heatmap" className="gap-1">
            <BarChart3 className="h-3.5 w-3.5" /> Heatmap
          </TabsTrigger>
          <TabsTrigger value="departments" className="gap-1">
            <Users className="h-3.5 w-3.5" /> Departments
          </TabsTrigger>
          <TabsTrigger value="cost" className="gap-1">
            <DollarSign className="h-3.5 w-3.5" /> Cost Analysis
          </TabsTrigger>
        </TabsList>

        {/* App Usage Tab */}
        <TabsContent value="app-usage" className="mt-4 space-y-4">
          {/* Category Breakdown */}
          {categoryData && totalCategoryMinutes > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(categoryData).map(([cat, minutes]) => (
                <Card key={cat}>
                  <CardHeader className="pb-2">
                    <CardTitle className={`text-sm ${CATEGORY_TEXT_COLORS[cat]}`}>
                      {cat}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{minutes} min</div>
                    <Progress
                      value={(minutes / totalCategoryMinutes) * 100}
                      className="mt-2 h-2"
                    />
                    <span className="text-xs text-muted-foreground">
                      {((minutes / totalCategoryMinutes) * 100).toFixed(0)}%
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Top Apps Table */}
          {appUsageLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !appUsage?.length ? (
            <Card className="p-8 text-center text-muted-foreground">
              No app usage data available for the selected period.
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Top Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Application</TableHead>
                      <TableHead>Time (min)</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Usage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appUsage.map((app) => {
                      const maxMinutes = appUsage[0]?.estimatedMinutes || 1;
                      return (
                        <TableRow key={app.appName}>
                          <TableCell className="font-medium">{app.appName}</TableCell>
                          <TableCell>{app.estimatedMinutes}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={CATEGORY_TEXT_COLORS[app.category]}
                            >
                              {app.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="w-[200px]">
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${CATEGORY_COLORS[app.category]}`}
                                style={{
                                  width: `${(app.estimatedMinutes / maxMinutes) * 100}%`,
                                }}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Idle Time Tab */}
        <TabsContent value="idle-time" className="mt-4">
          {idleLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !idleSummary?.length ? (
            <Card className="p-8 text-center text-muted-foreground">
              No idle time data available.
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Idle Time by Employee</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Total (min)</TableHead>
                      <TableHead>Active (min)</TableHead>
                      <TableHead>Idle (min)</TableHead>
                      <TableHead>Idle %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {idleSummary.map((item) => (
                      <TableRow key={item.user?.id}>
                        <TableCell className="font-medium">
                          {item.user?.name || "Unknown"}
                        </TableCell>
                        <TableCell>{item.totalMinutes}</TableCell>
                        <TableCell>{item.activeMinutes}</TableCell>
                        <TableCell>{item.idleMinutes}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={item.idlePercentage}
                              className="w-16 h-2"
                            />
                            <span
                              className={
                                item.idlePercentage > 30
                                  ? "text-red-600 font-medium"
                                  : "text-muted-foreground"
                              }
                            >
                              {item.idlePercentage}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Attendance Heatmap Tab */}
        <TabsContent value="heatmap" className="mt-4 space-y-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="User ID (leave empty for your own)"
              value={heatmapUserId}
              onChange={(e) => setHeatmapUserId(e.target.value)}
              className="w-64"
            />
            <select
              className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
              value={heatmapMonth}
              onChange={(e) => setHeatmapMonth(parseInt(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {format(new Date(2026, i, 1), "MMMM")}
                </option>
              ))}
            </select>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-sm">
            {Object.entries(HEATMAP_COLORS).map(([status, color]) => (
              <div key={status} className="flex items-center gap-1">
                <div className={`w-3 h-3 rounded ${color}`} />
                <span className="capitalize">{status}</span>
              </div>
            ))}
          </div>

          {heatmapLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-7 gap-1">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                    <div
                      key={d}
                      className="text-center text-xs font-medium text-muted-foreground pb-1"
                    >
                      {d}
                    </div>
                  ))}
                  {/* Offset for first day of month */}
                  {heatmapData &&
                    heatmapData.length > 0 &&
                    (() => {
                      const firstDay = new Date(heatmapData[0].date);
                      const dayOfWeek = (firstDay.getDay() + 6) % 7; // Monday=0
                      return Array.from({ length: dayOfWeek }, (_, i) => (
                        <div key={`empty-${i}`} />
                      ));
                    })()}
                  {heatmapData?.map((day) => (
                    <div
                      key={day.date}
                      className={`aspect-square rounded flex items-center justify-center text-xs font-medium ${
                        day.isWeekend
                          ? "bg-muted text-muted-foreground"
                          : HEATMAP_COLORS[day.status] || "bg-muted"
                      }`}
                      title={`${day.date}: ${day.status} (${day.hours}h)`}
                    >
                      {new Date(day.date).getDate()}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Department Comparison Tab */}
        <TabsContent value="departments" className="mt-4">
          {deptLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !deptComparison?.length ? (
            <Card className="p-8 text-center text-muted-foreground">
              No department data available.
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Department Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Department</TableHead>
                      <TableHead>Headcount</TableHead>
                      <TableHead>Avg Hours</TableHead>
                      <TableHead>Overtime</TableHead>
                      <TableHead>Leaves</TableHead>
                      <TableHead>Late Arrivals</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deptComparison.map((dept) => (
                      <TableRow key={dept.department.id}>
                        <TableCell className="font-medium">
                          {dept.department.name}
                        </TableCell>
                        <TableCell>{dept.headcount}</TableCell>
                        <TableCell>{dept.avgHours}h</TableCell>
                        <TableCell>{dept.overtimeCount}</TableCell>
                        <TableCell>{dept.leaveCount}</TableCell>
                        <TableCell>
                          {dept.lateArrivals > 0 ? (
                            <Badge variant="destructive">{dept.lateArrivals}</Badge>
                          ) : (
                            "0"
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Cost Analysis Tab */}
        <TabsContent value="cost" className="mt-4 space-y-4">
          {costLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {/* Project Costs */}
              <Card>
                <CardHeader>
                  <CardTitle>Cost per Project</CardTitle>
                </CardHeader>
                <CardContent>
                  {!costData?.length ? (
                    <p className="text-center text-muted-foreground py-4">
                      No project cost data available.
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Project</TableHead>
                          <TableHead>Total Hours</TableHead>
                          <TableHead>Team Size</TableHead>
                          <TableHead>Avg Hourly Cost</TableHead>
                          <TableHead>Total Cost</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {costData.map((item) => (
                          <TableRow key={item.projectId}>
                            <TableCell className="font-medium">
                              {item.projectName}
                            </TableCell>
                            <TableCell>{item.totalHours}h</TableCell>
                            <TableCell>{item.teamSize}</TableCell>
                            <TableCell>${item.avgHourlyCost}</TableCell>
                            <TableCell className="font-semibold">
                              ${item.totalCost.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              {/* Department Costs */}
              {deptCostData && deptCostData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Department Monthly Salary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Department</TableHead>
                          <TableHead>Headcount</TableHead>
                          <TableHead>Monthly Salary</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {deptCostData.map((item) => (
                          <TableRow key={item.departmentId}>
                            <TableCell className="font-medium">
                              {item.departmentName}
                            </TableCell>
                            <TableCell>{item.headcount}</TableCell>
                            <TableCell className="font-semibold">
                              ${item.totalMonthlySalary.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
