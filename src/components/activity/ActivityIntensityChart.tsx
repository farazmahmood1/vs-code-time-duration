import {
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface IntensityDataPoint {
    time: string; // ISO string
    keyboardCount: number;
    mouseClicks: number;
}

interface ActivityIntensityChartProps {
    data: IntensityDataPoint[];
}

export const ActivityIntensityChart = ({ data }: ActivityIntensityChartProps) => {
    return (
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>Activity Intensity</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={data}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                            <XAxis
                                dataKey="time"
                                tick={{ fontSize: 12, fill: "#6b7280" }}
                                tickFormatter={(str) => format(new Date(str), "HH:mm")}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: "#6b7280" }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--card))",
                                    borderColor: "hsl(var(--border))",
                                    borderRadius: "var(--radius)",
                                }}
                                labelFormatter={(label) => format(new Date(label), "MMM d, HH:mm")}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="keyboardCount"
                                name="Keystrokes"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 6 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="mouseClicks"
                                name="Mouse Clicks"
                                stroke="#10b981"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};
