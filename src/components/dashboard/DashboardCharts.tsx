import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  // PieChart,
  // Pie,
  // Cell,
  // Legend,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface DashboardChartsProps {
  weeklyHoursData: Array<{ week: string; hours: number; percentage: string }>;
  // projectHoursData: Array<{ week: string; estimated: number; logged: number }>;
  // lateArrivalsData: Array<{ name: string; value: number; color: string }>;
}

export const DashboardCharts = ({
  weeklyHoursData,
}: // projectHoursData,
// lateArrivalsData,
DashboardChartsProps) => {
  return (
    <div className="grid grid-cols-1">
      {/* Average Working Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">
            Average Working Hours per week
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[350px] w-full p-4">
          <ChartContainer
            config={{
              hours: {
                label: "Hours",
                color: "hsl(var(--primary))",
              },
            }}
            className="h-full w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyHoursData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="hours"
                  stroke="#01339a"
                  strokeWidth={2}
                  dot={{ fill: "#01339a", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Project-wise Hours */}
      {/*<Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">
            Project-wise hours
          </CardTitle>
          <p className="text-xs text-muted-foreground">Last 12 Months</p>
        </CardHeader>

        <CardContent className="h-[350px] w-full p-4">
          <ChartContainer
            config={{
              estimated: {
                label: "Estimated",
                color: "hsl(var(--primary))",
              },
              logged: {
                label: "Logged",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={projectHoursData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend verticalAlign="bottom" height={36} />
                <Area
                  type="monotone"
                  dataKey="estimated"
                  stackId="1"
                  // stroke="hsl(var(--primary))"
                  stroke="#01339a"
                  // fill="hsl(var(--primary))"
                  fill="#01339a"
                  fillOpacity={0.6}
                />
                {/* <Area
                  type="monotone"
                  dataKey="logged"
                  stackId="1"
                  // stroke="hsl(var(--chart-2))"
                  stroke="hsl(var(--chart-2))"
                  // fill="hsl(var(--chart-2))"
                  fill="#01339a"
                  fillOpacity={0.6}
                /> 
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">
            Late arrivals distribution
          </CardTitle>
        </CardHeader>

        <CardContent className="h-[350px] w-full -p-4">
          <ChartContainer
            config={{
              value: {
                label: "Count",
                color: "#1e40af",
              },
            }}
            className="h-full w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={lateArrivalsData}
                  cx="65%"
                  cy="50%"
                  innerRadius="72%"
                  outerRadius="100%"
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                >
                  {lateArrivalsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>

                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload[0]) {
                      return (
                        <div className="bg-white p-2 rounded-md shadow-md border">
                          <p className="text-sm font-medium">
                            {payload[0].name}
                          </p>
                          <p className="text-lg font-bold">
                            {payload[0].value}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Legend
                  layout="vertical"
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingLeft: "20px" }}
                  iconType="square"
                  formatter={(value) => (
                    <span className="text-sm text-gray-700">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card> 
*/}
    </div>
  );
};
