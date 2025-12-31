import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEmployeeAnnouncements } from "@/hooks/useEmployeeAnnouncements";
import {
  useEmployeeDashboardStats,
  useWeeklyHours,
} from "@/hooks/useEmployeeDashboardStats";
import { CheckCircle, Clock, LogIn, LogOut } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";

const getBarColor = (day: string) => {
  return day === "Sat" || day === "Sun" ? "#FF0000" : "#01339a";
};

export default function EmployeeDashboard() {
  // const { data: session } = useSession();
  // const userName = session?.user?.name || "Employee";

  const { data: announcements, isLoading: isLoadingAnnouncements } =
    useEmployeeAnnouncements();
  const { data: dashboardStats, isLoading: isLoadingStats } =
    useEmployeeDashboardStats();
  const { data: weeklyHoursData } = useWeeklyHours();

  const announcementsList = announcements?.announcements || [];
  const stats = dashboardStats || {
    checkInTime: null,
    checkOutTime: null,
    leavesApproved: 0,
    leavesPending: 0,
  };
  const chartData = weeklyHoursData || [
    { Days: "Mon", hours: 0 },
    { Days: "Tue", hours: 0 },
    { Days: "Wed", hours: 0 },
    { Days: "Thu", hours: 0 },
    { Days: "Fri", hours: 0 },
    { Days: "Sat", hours: 0 },
    { Days: "Sun", hours: 0 },
  ];

  // Format check-in time with user's local timezone
  const formattedCheckInTime = stats.checkInTime
    ? format(new Date(stats.checkInTime), "hh:mm a")
    : "N/A";

  // Format check-out time with user's local timezone
  const formattedCheckOutTime = stats.checkOutTime
    ? format(new Date(stats.checkOutTime), "hh:mm a")
    : "N/A";

  return (
    <div className="space-y-6">
      {/* <Card>
        <CardContent>
          <div className="flex gap-4">
            <div>
              <div className="p-8 bg-slate-100 rounded-full w-fit">
                <UsersRound className="h-10 w-10 text-blue-900" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{userName}</h1>
              <p className="text-muted-foreground text-base">
                Full Stack Developer
              </p>
              <button className="flex items-center gap-2 w-fit border rounded-xl px-3 py-1 text-sm font-medium text-slate-400 border-slate-400">
                Edit <Pencil className="h-4 w-4" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Check-in */}
        <Card className="bg-gradient-to-b from-blue-50 to-white">
          <CardContent>
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <p className="text-3xl text-blue-700 font-semibold">
                  {isLoadingStats ? "..." : formattedCheckInTime}
                </p>
                <p className="text-blue-700 font-medium">CheckIn Today</p>
                {/* <p className="flex items-center gap-1 text-sm text-slate-400">
                  <span className="p-1 bg-red-200 rounded-full">
                    <MoveDownLeft className="h-3 w-3 text-red-600" />
                  </span>
                  30 Minutes Late
                </p> */}
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <LogIn className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Check-out */}
        <Card className="bg-gradient-to-b from-orange-50 to-white">
          <CardContent>
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <p className="text-3xl text-orange-700 font-semibold">
                  {isLoadingStats ? "..." : formattedCheckOutTime}
                </p>
                <p className="text-orange-700 font-medium w-fit whitespace-nowrap">
                  CheckOut Today
                </p>
                {/* <p className="flex items-center gap-1 text-sm text-slate-400">
                  <span className="p-1 bg-green-200 rounded-full">
                    <MoveUpRight className="h-3 w-3 text-green-600" />
                  </span>
                  On Time
                </p> */}
              </div>
              <div className="p-2 bg-orange-100 rounded-full">
                <LogOut className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leaves Approved */}
        <Card className="bg-gradient-to-b from-green-50 to-white">
          <CardContent>
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <p className="text-3xl text-green-700 font-semibold">
                  {isLoadingStats ? "..." : stats.leavesApproved}
                </p>
                <p className="text-green-700 font-medium">Leaves Approved</p>
                {/* <p className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="p-1 bg-red-200 rounded-full">
                    <MoveDownLeft className="h-3 w-3 text-red-600" />
                  </span>
                  Decline
                </p> */}
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leaves Pending */}
        <Card className="bg-gradient-to-b from-purple-50 to-white">
          <CardContent>
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <p className="text-3xl text-purple-700 font-semibold">
                  {isLoadingStats ? "..." : stats.leavesPending}
                </p>
                <p className="text-purple-700 font-medium">Leaves Pending</p>
                {/* <p className="flex items-center gap-1 text-sm text-slate-400">
                  <span className="p-1 bg-red-200 rounded-full">
                    <MoveDownLeft className="h-3 w-3 text-red-600" />
                  </span>
                  Decline
                </p> */}
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section: Weekly Hours + Announcements */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Weekly Hours Chart */}
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Weekly Hours Logged
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[250px] w-full p-4">
              <ChartContainer
                config={{
                  hours: { label: "Hours", color: "hsl(var(--primary))" },
                }}
                className="h-full w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="Days" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="hours" radius={[8, 8, 0, 0]} fill="#01339a">
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={getBarColor(entry.Days)}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Announcements */}
        <div className="flex-1">
          <Card className="min-h-[356px] flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-medium">
                  Announcements
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <ScrollArea className="w-full h-[250px]">
                <div className="p-4">
                  {isLoadingAnnouncements ? (
                    <p>Loading announcements...</p>
                  ) : announcementsList.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      No announcements yet.
                    </p>
                  ) : (
                    <Accordion type="single" collapsible className="space-y-2">
                      {announcementsList.map((announcement) => (
                        <AccordionItem
                          key={announcement.id}
                          value={announcement.id}
                          className="bg-gray-100 rounded-lg"
                        >
                          <AccordionTrigger className="px-4 py-3 text-left font-medium">
                            {announcement.title}
                          </AccordionTrigger>
                          <AccordionContent className="px-4 py-3 bg-gray-100 rounded-b-lg">
                            {announcement.description ||
                              "No description available."}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
