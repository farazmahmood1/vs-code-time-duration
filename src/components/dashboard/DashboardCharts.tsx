import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { DepartmentComparisonItem } from "@/hooks/useReports";
import type { AdminLeaveStats } from "@/hooks/useLeaveData";

interface DashboardChartsProps {
  weeklyHoursData: Array<{ week: string; hours: number; percentage: string }>;
  departmentData?: DepartmentComparisonItem[];
  leaveStats?: AdminLeaveStats;
  attendanceSummary?: {
    total: number;
    online: number;
    offline: number;
    absent: number;
    break: number;
  };
}

const ATTENDANCE_COLORS = ["#22c55e", "#94a3b8", "#ef4444", "#f59e0b"];
const LEAVE_COLORS = ["#22c55e", "#f59e0b", "#ef4444", "#6366f1"];

export const DashboardCharts = ({
  weeklyHoursData,
  departmentData,
  leaveStats,
  attendanceSummary,
}: DashboardChartsProps) => {
  const attendancePieData = attendanceSummary
    ? [
        { name: "Online", value: attendanceSummary.online },
        { name: "Offline", value: attendanceSummary.offline },
        { name: "Absent", value: attendanceSummary.absent },
        { name: "On Break", value: attendanceSummary.break },
      ].filter((d) => d.value > 0)
    : [];

  const leavePieData = leaveStats
    ? [
        { name: "Approved", value: leaveStats.approved },
        { name: "Pending", value: leaveStats.pending },
        { name: "Rejected", value: leaveStats.rejected },
        { name: "On Leave", value: leaveStats.onLeave },
      ].filter((d) => d.value > 0)
    : [];

  return (
    <div className="space-y-6">
      {/* Row 1: Weekly Hours + Attendance Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Weekly Working Hours
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] w-full pt-0">
            <ChartContainer
              config={{
                hours: { label: "Hours", color: "hsl(var(--primary))" },
              }}
              className="h-full w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyHoursData}>
                  <defs>
                    <linearGradient
                      id="hoursGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop
                        offset="95%"
                        stopColor="#3b82f6"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="hours"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#hoursGradient)"
                    dot={{ fill: "#3b82f6", r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Today's Attendance
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] w-full pt-0">
            {attendancePieData.length > 0 ? (
              <ChartContainer
                config={{
                  value: { label: "Count", color: "#22c55e" },
                }}
                className="h-full w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attendancePieData}
                      cx="50%"
                      cy="45%"
                      innerRadius="55%"
                      outerRadius="80%"
                      paddingAngle={3}
                      dataKey="value"
                      nameKey="name"
                    >
                      {attendancePieData.map((_, index) => (
                        <Cell
                          key={`att-${index}`}
                          fill={
                            ATTENDANCE_COLORS[
                              index % ATTENDANCE_COLORS.length
                            ]
                          }
                        />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload[0]) {
                          return (
                            <div className="bg-background border rounded-lg px-3 py-2 shadow-md">
                              <p className="text-xs text-muted-foreground">
                                {payload[0].name}
                              </p>
                              <p className="text-lg font-semibold">
                                {payload[0].value}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => (
                        <span className="text-xs text-muted-foreground">
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                No attendance data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Department Comparison + Leave Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {departmentData && departmentData.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Department Comparison
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] w-full pt-0">
              <ChartContainer
                config={{
                  avgHours: { label: "Avg Hours", color: "#3b82f6" },
                  headcount: { label: "Headcount", color: "#8b5cf6" },
                  leaveCount: { label: "Leaves", color: "#f59e0b" },
                }}
                className="h-full w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={departmentData.map((d) => ({
                      name:
                        d.department.name.length > 12
                          ? d.department.name.slice(0, 12) + "..."
                          : d.department.name,
                      avgHours: Number(d.avgHours.toFixed(1)),
                      headcount: d.headcount,
                      leaveCount: d.leaveCount,
                    }))}
                    barGap={4}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e5e7eb"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      iconSize={8}
                    />
                    <Bar
                      dataKey="avgHours"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={32}
                    />
                    <Bar
                      dataKey="headcount"
                      fill="#8b5cf6"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={32}
                    />
                    <Bar
                      dataKey="leaveCount"
                      fill="#f59e0b"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={32}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {leavePieData.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Leave Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] w-full pt-0">
              <ChartContainer
                config={{
                  value: { label: "Count", color: "#22c55e" },
                }}
                className="h-full w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={leavePieData}
                      cx="50%"
                      cy="45%"
                      innerRadius="55%"
                      outerRadius="80%"
                      paddingAngle={3}
                      dataKey="value"
                      nameKey="name"
                    >
                      {leavePieData.map((_, index) => (
                        <Cell
                          key={`leave-${index}`}
                          fill={LEAVE_COLORS[index % LEAVE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload[0]) {
                          return (
                            <div className="bg-background border rounded-lg px-3 py-2 shadow-md">
                              <p className="text-xs text-muted-foreground">
                                {payload[0].name}
                              </p>
                              <p className="text-lg font-semibold">
                                {payload[0].value}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => (
                        <span className="text-xs text-muted-foreground">
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
