import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

// Mock data for project hours
const projectHoursData = [
  { name: "Website Redesign", hours: 240.5, budget: 300 },
  { name: "Mobile App", hours: 680.75, budget: 800 },
  { name: "HR System", hours: 120.25, budget: 200 },
  { name: "Marketing Campaign", hours: 180.5, budget: 250 },
  { name: "Dashboard Update", hours: 95.0, budget: 150 },
];

// Mock data for hours by department
const hoursByDepartment = [
  { department: "IT", hours: 920.75, projects: 3 },
  { department: "HR", hours: 120.25, projects: 1 },
  { department: "MARKETING", hours: 180.5, projects: 1 },
  { department: "SALES", hours: 0, projects: 0 },
  { department: "FINANCE", hours: 0, projects: 0 },
  { department: "OPERATIONS", hours: 0, projects: 0 },
];

// Mock data for project hours trend
const projectTrendData = [
  { week: "Week 1", hours: 120, projects: 3 },
  { week: "Week 2", hours: 245, projects: 4 },
  { week: "Week 3", hours: 189, projects: 3 },
  { week: "Week 4", hours: 327, projects: 5 },
  { week: "Week 5", hours: 412, projects: 5 },
];

export function ProjectAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Project Analytics</h2>
        <p className="text-muted-foreground">
          Track hours and performance across all projects
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Total Hours Logged
              </p>
              <p className="text-3xl font-bold">1,317.5h</p>
              <p className="text-xs text-green-600">+12% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Active Projects
              </p>
              <p className="text-3xl font-bold">5</p>
              <p className="text-xs text-muted-foreground">
                Across 3 departments
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Team Members
              </p>
              <p className="text-3xl font-bold">22</p>
              <p className="text-xs text-muted-foreground">
                Assigned to projects
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Budget Utilization
              </p>
              <p className="text-3xl font-bold">78%</p>
              <p className="text-xs text-green-600">Within budget</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hours by Project */}
      <Card>
        <CardHeader>
          <CardTitle>Hours by Project</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectHoursData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="hours" fill="#3b82f6" name="Hours Logged" />
              <Bar dataKey="budget" fill="#d1d5db" name="Budget Hours" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hours by Department */}
        <Card>
          <CardHeader>
            <CardTitle>Hours by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {hoursByDepartment.map((dept) => (
                <div key={dept.department} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {dept.department}
                    </span>
                    <span className="text-sm font-bold">{dept.hours}h</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(dept.hours / 920.75) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {dept.projects} project{dept.projects !== 1 ? "s" : ""}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hours Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Hours Trend (Last 5 Weeks)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={projectTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="hours"
                  stroke="#3b82f6"
                  name="Hours Logged"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
