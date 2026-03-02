import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { signOut } from "@/lib/auth-client";
import { LogOut, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { useCompanyContext } from "@/contexts/CompanyContext";
import {
  LayoutDashboard,
  BarChart3,
  CalendarCheck,
  Briefcase,
  Calendar,
  Settings,
  FolderOpen,
  Building,
  Clock,
  Timer,
  FileSpreadsheet,
  Star,
  Package,
  MessageSquareText,
  MessageCircle,
  MessagesSquare,
  CalendarDays,
  Hourglass,
  SmilePlus,
  CalendarCheck2,
  Network,
  FileText,
  DollarSign,
  Receipt,
  UserMinus,
  Trophy,
  Heart,
} from "lucide-react";

type MenuItem = {
  url: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  adminTitle: string;
  employeeTitle: string;
  roles: string[];
};

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: session } = useSession();
  const { company } = useCompanyContext();

  const MENU_ITEMS: MenuItem[] = [
    {
      url: "/app",
      icon: LayoutDashboard,
      adminTitle: "Dashboard",
      employeeTitle: "Dashboard",
      roles: ["admin", "employee"],
    },
    {
      url: "/app/employees",
      icon: BarChart3,
      adminTitle: "Employees",
      employeeTitle: "Employees",
      roles: ["admin"],
    },
    {
      url: "/app/departments",
      icon: Building,
      adminTitle: "Departments",
      employeeTitle: "Departments",
      roles: ["admin"],
    },
    {
      url: "/app/projects",
      icon: FolderOpen,
      adminTitle: "Projects",
      employeeTitle: "Projects",
      roles: ["admin"],
    },
    {
      url: "/app/shifts",
      icon: Clock,
      adminTitle: "Shifts",
      employeeTitle: "My Shifts",
      roles: ["admin", "employee"],
    },
    {
      url: "/app/availability",
      icon: CalendarCheck2,
      adminTitle: "Availability",
      employeeTitle: "My Availability",
      roles: ["employee"],
    },
    {
      url: "/app/attendance",
      icon: CalendarCheck,
      adminTitle: "Attendance Tracking",
      employeeTitle: "My Attendance",
      roles: ["admin", "employee"],
    },
    {
      url: "/app/overtime",
      icon: Timer,
      adminTitle: "Overtime",
      employeeTitle: "Overtime",
      roles: ["admin"],
    },
    {
      url: "/app/timesheets",
      icon: FileSpreadsheet,
      adminTitle: "Timesheets",
      employeeTitle: "My Timesheets",
      roles: ["admin", "employee"],
    },
    {
      url: "/app/leaves",
      icon: Briefcase,
      adminTitle: "Leave Management",
      employeeTitle: "My Leaves",
      roles: ["admin", "employee"],
    },
    {
      url: "/app/announcements",
      icon: Calendar,
      adminTitle: "Announcements",
      employeeTitle: "Company Updates",
      roles: ["admin", "employee"],
    },
    {
      url: "/app/reports",
      icon: BarChart3,
      adminTitle: "Reports",
      employeeTitle: "Reports",
      roles: ["admin"],
    },
    {
      url: "/app/reviews",
      icon: Star,
      adminTitle: "Reviews",
      employeeTitle: "My Reviews",
      roles: ["admin"],
    },
    {
      url: "/app/assets",
      icon: Package,
      adminTitle: "Assets",
      employeeTitle: "My Assets",
      roles: ["admin"],
    },
    {
      url: "/app/standups",
      icon: MessageSquareText,
      adminTitle: "Standups",
      employeeTitle: "Standups",
      roles: ["admin"],
    },
    {
      url: "/app/chat",
      icon: MessagesSquare,
      adminTitle: "Chat",
      employeeTitle: "Chat",
      roles: ["admin", "employee"],
    },
    {
      url: "/app/calendar",
      icon: CalendarDays,
      adminTitle: "Calendar",
      employeeTitle: "Calendar",
      roles: ["admin", "employee"],
    },
    {
      url: "/app/feedback",
      icon: MessageCircle,
      adminTitle: "Feedback",
      employeeTitle: "Feedback",
      roles: ["admin", "employee"],
    },
    {
      url: "/app/pomodoro",
      icon: Hourglass,
      adminTitle: "Pomodoro",
      employeeTitle: "Pomodoro",
      roles: ["admin", "employee"],
    },
    {
      url: "/app/mood-analytics",
      icon: SmilePlus,
      adminTitle: "Mood Analytics",
      employeeTitle: "Mood Analytics",
      roles: ["admin"],
    },
    {
      url: "/app/org-chart",
      icon: Network,
      adminTitle: "Org Chart",
      employeeTitle: "Org Chart",
      roles: ["admin"],
    },
    {
      url: "/app/compensation",
      icon: DollarSign,
      adminTitle: "Compensation",
      employeeTitle: "My Compensation",
      roles: ["admin", "employee"],
    },
    {
      url: "/app/expenses",
      icon: Receipt,
      adminTitle: "Expenses",
      employeeTitle: "My Expenses",
      roles: ["admin", "employee"],
    },
    {
      url: "/app/offboarding",
      icon: UserMinus,
      adminTitle: "Offboarding",
      employeeTitle: "Offboarding",
      roles: ["admin"],
    },
    {
      url: "/app/leaderboard",
      icon: Trophy,
      adminTitle: "Leaderboard",
      employeeTitle: "Leaderboard",
      roles: ["admin", "employee"],
    },
    {
      url: "/app/wellness",
      icon: Heart,
      adminTitle: "Wellness",
      employeeTitle: "Wellness",
      roles: ["admin", "employee"],
    },
    {
      url: "/app/documents",
      icon: FileText,
      adminTitle: "Documents",
      employeeTitle: "Documents",
      roles: ["admin", "employee"],
    },
    {
      url: "/app/profile",
      icon: User,
      adminTitle: "Profile",
      employeeTitle: "Profile",
      roles: ["employee"],
    },
    {
      url: "/app/settings",
      icon: Settings,
      adminTitle: "Settings",
      employeeTitle: "Settings",
      roles: ["admin", "employee"],
    },
  ];

  const userRole = session?.user.role || "employee";

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-sidebar">
        {/* Logo */}
        <div className="px-4 py-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <img src={company?.logo || "/imgs/logo.png"} alt="Logo" className="w-6 h-6 rounded" />
            </div>
            {open && (
              <span className="font-bold text-xl tracking-tight text-foreground">
                {company?.name || "Forrof"}
              </span>
            )}
          </div>
        </div>

        <SidebarGroup className="px-3 py-2">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {MENU_ITEMS.filter((item) => item.roles.includes(userRole)).map(
                (item) => {
                  const isActive = item.url === "/app"
                    ? location.pathname === "/app"
                    : location.pathname.startsWith(item.url);
                  const displayTitle =
                    userRole === "admin" ? item.adminTitle : item.employeeTitle;

                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        size="lg"
                        asChild
                        className={`rounded-xl transition-all duration-200 ${
                          isActive
                            ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground shadow-sm shadow-primary/25"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <Link to={item.url}>
                          <item.icon className="h-[18px] w-[18px] mr-1 shrink-0" />
                          <span className="text-[13px] font-medium">{displayTitle}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 pb-4 bg-sidebar">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              onClick={handleLogout}
              className="rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive cursor-pointer transition-all duration-200"
            >
              <LogOut className="h-[18px] w-[18px] mr-1" />
              <span className="text-[13px] font-medium">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
