import { CurrentDateWidget } from "@/components/dashboard/CurrentDateWidget";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { EfficiencyWidget } from "@/components/dashboard/EfficiencyWidget";
import { OvertimeAlerts } from "@/components/dashboard/OvertimeAlerts";
import { ProjectRoadmapWidget } from "@/components/dashboard/ProjectRoadmapWidget";
import { RecentAttendance } from "@/components/dashboard/RecentAttendance";
import { StatCard } from "@/components/dashboard/StatCard";
import { TotalProjectTimeWidget } from "@/components/dashboard/TotalProjectTimeWidget";
import { UpcomingEventsWidget } from "@/components/dashboard/UpcomingEventsWidget";
import { Skeleton } from "@/components/ui/skeleton";
import { useAttendanceData, useAttendanceSummary } from "@/hooks/useAttendanceData";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useAdminLeaveStats } from "@/hooks/useLeaveData";
import { useOvertimeAlerts } from "@/hooks/useOvertime";
import { useDepartmentComparison } from "@/hooks/useReports";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  LogIn,
  LogOut,
  Plane,
  Timer,
  UserMinus,
  Users,
} from "lucide-react";
import { useState } from "react";

const Dashboard = () => {
  const [department, setDepartment] = useState("all");
  const [project, setProject] = useState("all");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const filters = { department, project, startDate, endDate };

  const { data, isLoading } = useDashboardData(filters);
  const { data: attendanceSummary } = useAttendanceSummary();
  const { data: attendanceData } = useAttendanceData({ pageSize: 8 });
  const { data: leaveStats } = useAdminLeaveStats();
  const { data: overtimeAlerts } = useOvertimeAlerts();
  const { data: departmentData } = useDepartmentComparison(
    startDate || endDate
      ? {
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString(),
        }
      : undefined
  );

  const statCards = [
    {
      title: "Active Employees",
      value: data?.stats.activeEmployees || 0,
      icon: Users,
      color: "green" as const,
      subtitle: "Checked in today",
    },
    {
      title: "Inactive Employees",
      value: data?.stats.inactiveEmployees || 0,
      icon: UserMinus,
      color: "slate" as const,
      subtitle: "Not clocked in",
    },
    {
      title: "Hours Logged",
      value: data?.stats.totalHoursLogged || 0,
      icon: Clock,
      color: "blue" as const,
      subtitle: "Total hours tracked",
    },
    {
      title: "Check-Ins Today",
      value: data?.stats.checkInToday || 0,
      icon: LogIn,
      color: "indigo" as const,
      subtitle: "Employees checked in",
    },
    {
      title: "Check-Outs Today",
      value: data?.stats.checkOutToday || 0,
      icon: LogOut,
      color: "orange" as const,
      subtitle: "Completed for today",
    },
    {
      title: "On Leave",
      value: data?.stats.onLeave || 0,
      icon: Plane,
      color: "purple" as const,
      subtitle: "Approved leaves",
    },
  ];

  const leaveQuickStats = leaveStats
    ? [
        {
          title: "Approved",
          value: leaveStats.approved,
          icon: CheckCircle,
          color: "emerald" as const,
        },
        {
          title: "Pending Requests",
          value: leaveStats.pending,
          icon: Timer,
          color: "yellow" as const,
        },
        {
          title: "Rejected",
          value: leaveStats.rejected,
          icon: AlertTriangle,
          color: "red" as const,
        },
      ]
    : [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of your team's activity and performance
          </p>
        </div>
        <DashboardFilters
          department={department}
          project={project}
          startDate={startDate}
          endDate={endDate}
          onDepartmentChange={setDepartment}
          onProjectChange={setProject}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {/* Quick Glance skeletons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 sm:col-span-2 rounded-2xl" />
          </div>
          {/* Stat card skeletons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
          {/* Projects & Events skeletons */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-[300px] lg:col-span-2 rounded-2xl" />
            <Skeleton className="h-[300px] rounded-2xl" />
          </div>
          {/* Chart skeletons */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-[350px] lg:col-span-2 rounded-2xl" />
            <Skeleton className="h-[350px] rounded-2xl" />
          </div>
        </div>
      ) : (
        <>
          {/* Quick Glance: Date + Total Time + Efficiency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <CurrentDateWidget />
            <TotalProjectTimeWidget totalHours={data?.stats.totalHoursLogged || 0} />
            <div className="sm:col-span-2">
              <EfficiencyWidget weeklyHours={data?.weeklyHours || []} />
            </div>
          </div>

          {/* Main Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {statCards.map((card, index) => (
              <StatCard key={index} {...card} />
            ))}
          </div>

          {/* Leave Quick Stats */}
          {leaveQuickStats.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {leaveQuickStats.map((card, index) => (
                <StatCard key={index} {...card} />
              ))}
            </div>
          )}

          {/* Projects & Events */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ProjectRoadmapWidget />
            </div>
            <UpcomingEventsWidget />
          </div>

          {/* Charts Section */}
          {data && (
            <DashboardCharts
              weeklyHoursData={data.weeklyHours}
              departmentData={departmentData}
              leaveStats={leaveStats}
              attendanceSummary={attendanceSummary}
            />
          )}

          {/* Bottom Section: Overtime Alerts + Recent Attendance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {overtimeAlerts && overtimeAlerts.length > 0 && (
              <OvertimeAlerts alerts={overtimeAlerts} />
            )}
            {attendanceData && (
              <RecentAttendance records={attendanceData.data} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
