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
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Shield,
  ScrollText,
  Settings,
  LogOut,
} from "lucide-react";

const MENU_ITEMS = [
  { url: "/super-admin", icon: LayoutDashboard, title: "Dashboard" },
  { url: "/super-admin/companies", icon: Building2, title: "Companies" },
  { url: "/super-admin/plans", icon: CreditCard, title: "Plans" },
  { url: "/super-admin/subscriptions", icon: Shield, title: "Subscriptions" },
  { url: "/super-admin/audit-logs", icon: ScrollText, title: "Audit Logs" },
  { url: "/super-admin/settings", icon: Settings, title: "Settings" },
];

export function SuperAdminSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();

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
            <div className="w-9 h-9 rounded-xl bg-indigo-600/10 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-indigo-600" />
            </div>
            {open && (
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-foreground leading-tight">
                  Forrof
                </span>
                <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-widest">
                  Super Admin
                </span>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup className="px-3 py-2">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {MENU_ITEMS.map((item) => {
                const isActive =
                  item.url === "/super-admin"
                    ? location.pathname === "/super-admin"
                    : location.pathname.startsWith(item.url);

                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      size="lg"
                      asChild
                      className={`rounded-xl transition-all duration-200 ${
                        isActive
                          ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:text-white shadow-sm shadow-indigo-600/25"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Link to={item.url}>
                        <item.icon className="h-[18px] w-[18px] mr-1 shrink-0" />
                        <span className="text-[13px] font-medium">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
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
