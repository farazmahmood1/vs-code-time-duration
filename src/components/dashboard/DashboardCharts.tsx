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
const LEAVE_COLORS = ["#22c55e", "#f59e0b", "#ef4444", "#818cf8"];

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
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border/50 shadow-sm p-6">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-foreground">Weekly Working Hours</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Track changes in hours over time</p>
          </div>
          <div className="h-[280px] w-full">
            <ChartContainer
              config={{
                hours: { label: "Hours", color: "#4f46e5" },
              }}
              className="h-full w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyHoursData}>
                  <defs>
                    <linearGradient id="hoursGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="hours"
                    stroke="#4f46e5"
                    strokeWidth={2.5}
                    fill="url(#hoursGradient)"
                    dot={{ fill: "#4f46e5", r: 4, strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 6, stroke: "#4f46e5", strokeWidth: 2, fill: "#fff" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-6">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-foreground">Today's Attendance</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Current status overview</p>
          </div>
          <div className="h-[280px] w-full">
            {attendancePieData.length > 0 ? (
              <ChartContainer
                config={{ value: { label: "Count", color: "#22c55e" } }}
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
                      paddingAngle={4}
                      dataKey="value"
                      nameKey="name"
                      strokeWidth={0}
                    >
                      {attendancePieData.map((_, index) => (
                        <Cell
                          key={`att-${index}`}
                          fill={ATTENDANCE_COLORS[index % ATTENDANCE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload[0]) {
                          return (
                            <div className="bg-card border border-border/50 rounded-xl px-3 py-2 shadow-lg">
                              <p className="text-xs text-muted-foreground">{payload[0].name}</p>
                              <p className="text-lg font-bold">{payload[0].value}</p>
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
                        <span className="text-xs text-muted-foreground">{value}</span>
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
          </div>
        </div>
      </div>

      {/* Row 2: Department Comparison + Leave Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {departmentData && departmentData.length > 0 && (
          <div className="lg:col-span-2 bg-card rounded-2xl border border-border/50 shadow-sm p-6">
            <div className="mb-4">
              <h3 className="text-base font-semibold text-foreground">Department Comparison</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Performance across teams</p>
            </div>
            <div className="h-[280px] w-full">
              <ChartContainer
                config={{
                  avgHours: { label: "Avg Hours", color: "#4f46e5" },
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
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#94a3b8" }}
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
                    <Bar dataKey="avgHours" fill="#4f46e5" radius={[6, 6, 0, 0]} maxBarSize={28} />
                    <Bar dataKey="headcount" fill="#8b5cf6" radius={[6, 6, 0, 0]} maxBarSize={28} />
                    <Bar dataKey="leaveCount" fill="#f59e0b" radius={[6, 6, 0, 0]} maxBarSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        )}

        {leavePieData.length > 0 && (
          <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-6">
            <div className="mb-4">
              <h3 className="text-base font-semibold text-foreground">Leave Overview</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Distribution by status</p>
            </div>
            <div className="h-[280px] w-full">
              <ChartContainer
                config={{ value: { label: "Count", color: "#22c55e" } }}
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
                      paddingAngle={4}
                      dataKey="value"
                      nameKey="name"
                      strokeWidth={0}
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
                            <div className="bg-card border border-border/50 rounded-xl px-3 py-2 shadow-lg">
                              <p className="text-xs text-muted-foreground">{payload[0].name}</p>
                              <p className="text-lg font-bold">{payload[0].value}</p>
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
                        <span className="text-xs text-muted-foreground">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
