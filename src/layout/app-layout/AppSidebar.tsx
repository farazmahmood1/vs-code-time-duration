// components/AppSidebar.tsx
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
import {
  LayoutDashboard,
  BarChart3,
  CalendarCheck,
  Briefcase,
  Calendar,
  Settings,
  FolderOpen,
  Building,
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

  const MENU_ITEMS: MenuItem[] = [
    {
      url: "/",
      icon: LayoutDashboard,
      adminTitle: "Dashboard",
      employeeTitle: "Dashboard",
      roles: ["admin", "employee"],
    },
    {
      url: "/employees",
      icon: BarChart3,
      adminTitle: "Employees",
      employeeTitle: "Employees",
      roles: ["admin"],
    },
    {
      url: "/departments",
      icon: Building,
      adminTitle: "Departments",
      employeeTitle: "Departments",
      roles: ["admin"],
    },
    {
      url: "/projects",
      icon: FolderOpen,
      adminTitle: "Projects",
      employeeTitle: "Projects",
      roles: ["admin"],
    },
    {
      url: "/attendance",
      icon: CalendarCheck,
      adminTitle: "Attendance Tracking",
      employeeTitle: "My Attendance",
      roles: ["admin"],
    },
    {
      url: "/leaves",
      icon: Briefcase,
      adminTitle: "Leave Management",
      employeeTitle: "My Leaves",
      roles: ["admin", "employee"],
    },
    {
      url: "/announcements",
      icon: Calendar,
      adminTitle: "Announcements",
      employeeTitle: "Company Updates",
      roles: ["admin", "employee"],
    },

    {
      url: "/profile",
      icon: User,
      adminTitle: "Profile",
      employeeTitle: "Profile",
      roles: ["employee"],
    },
    {
      url: "/settings",
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
      <SidebarContent>
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <img src="/imgs/logo.png" alt="Logo" />
            </div>
            {open && <span className="font-semibold text-2xl">Forrof</span>}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {MENU_ITEMS.filter((item) => item.roles.includes(userRole)).map(
                (item) => {
                  const isActive = location.pathname === item.url;
                  const displayTitle =
                    userRole === "admin" ? item.adminTitle : item.employeeTitle;

                  return (
                    <SidebarMenuItem
                      key={item.url}
                      className={`my-1 border-l-4 border-transparent ${
                        isActive ? "border-l-4 border-brand" : ""
                      }`}
                    >
                      <SidebarMenuButton
                        size="lg"
                        asChild
                        className={`${
                          isActive
                            ? "bg-blue-50 rounded-none text-brand hover:bg-blue-50 hover:text-brand"
                            : ""
                        }`}
                      >
                        <Link to={item.url}>
                          <item.icon className="h-[18px] w-[18px] mr-1" />
                          <span className="text-[15px]">{displayTitle}</span>
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

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              onClick={handleLogout}
              className="text-destructive hover:bg-red-100 hover:text-destructive cursor-pointer"
            >
              <LogOut className="h-[18px] w-[18px] mr-1" />
              <span className="text-[15px]">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
