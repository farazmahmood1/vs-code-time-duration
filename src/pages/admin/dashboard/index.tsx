import { ActivityCard } from "@/components/dashboard/ActivityCard";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { StatCard } from "@/components/dashboard/StatCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Clock, LogIn, LogOut, Plane, UserMinus, Users } from "lucide-react";
import { useState } from "react";

const Dashboard = () => {
  const [department, setDepartment] = useState("all");
  const [project, setProject] = useState("all");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const filters = {
    department,
    project,
    startDate,
    endDate,
  };

  const { data, isLoading } = useDashboardData(filters);

  const statCards = [
    {
      title: "Active Employees",
      value: data?.stats.activeEmployees || 0,
      icon: Users,
      // trend: { text: "2 new employees added", type: "neutral" as const },
      color: "green" as const,
    },
    {
      title: "Inactive Employees",
      value: data?.stats.inactiveEmployees || 0,
      icon: UserMinus,
      // trend: { text: "+5% Increase than yesterday", type: "up" as const },
      color: "red" as const,
    },
    // {
    //   title: "Laid Off Employees",
    //   value: data?.stats.laidOffEmployees || 0,
    //   icon: UserX,
    //   trend: { text: "+3% Increase than yesterday", type: "up" as const },
    //   color: "red-light" as const,
    // },
    {
      title: "Total Hours Logged",
      value: data?.stats.totalHoursLogged || 0,
      icon: Clock,
      // trend: { text: "-10% Less than yesterday", type: "down" as const },
      color: "blue" as const,
    },
  ];

  const activityCards = [
    {
      title: "CheckIn Today",
      value: data?.stats.checkInToday || 0,
      icon: LogIn,
      // trend: { text: "-10% Less than yesterday", type: "down" as const },
      color: "blue" as const,
    },
    {
      title: "CheckOut Today",
      value: data?.stats.checkOutToday || 0,
      icon: LogOut,
      // trend: { text: "+3% Increase than yesterday", type: "up" as const },
      color: "orange" as const,
    },
    // {
    //   title: "Late CheckIn",
    //   value: data?.stats.lateCheckIn || 0,
    //   icon: Moon,
    //   trend: { text: "-10% Less than yesterday", type: "down" as const },
    //   color: "yellow" as const,
    // },
    {
      title: "On Leave",
      value: data?.stats.onLeave || 0,
      icon: Plane,
      // trend: { text: "2% Increase than yesterday", type: "up" as const },
      color: "purple" as const,
    },
  ];

  return (
    <div className="space-y-6">
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

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            {[1].map((i) => (
              <Skeleton key={i} className="h-[400px]" />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {statCards.map((card, index) => (
              <StatCard key={index} {...card} />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {activityCards.map((card, index) => (
              <ActivityCard key={index} {...card} />
            ))}
          </div>

          {data && (
            <DashboardCharts
              weeklyHoursData={data.weeklyHours}
              // projectHoursData={data.projectHours}
              // lateArrivalsData={data.lateArrivals}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
