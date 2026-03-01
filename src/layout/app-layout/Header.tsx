import { NotificationCenter } from "@/components/NotificationCenter";
import { UserAvatar } from "@/components/common/UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuthState } from "@/hooks/useAuthState";
import { signOut, useSession } from "@/lib/auth-client";
import { GlobalSearch } from "@/components/GlobalSearch";
import { LogOut, Settings, SquareCheckBigIcon, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Header = () => {
  const { data: session } = useSession();
  const { loading, setLoading, setError, setSuccess, resetState } =
    useAuthState();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut({
        fetchOptions: {
          onRequest: () => {
            resetState();
            setLoading(true);
          },

          onResponse: () => {
            setLoading(false);
          },

          onSuccess: () => {
            setSuccess("Logged out successfully");
            toast.success("Logged out successfully!");
            navigate("/login", { replace: true });
          },

          onError: (ctx) => {
            toast.error(ctx.error.message || "Logout failed");
            setError(ctx.error.message);
          },
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Something went wrong while logging out");
      setError("Something went wrong");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const userName = session?.user?.name.split(" ")[0] || "User";
  const userFullName = session?.user?.name || "User";
  const userRole = session?.user?.role || "role";
  const userAvatar = session?.user?.image;

  return (
    <header className="h-[72px] flex items-center justify-between px-4 sm:px-8 sticky top-0 bg-card z-10 border-b border-border/50">
      {/* Left: Mobile trigger + Search */}
      <div className="flex items-center gap-4 flex-1">
        <SidebarTrigger className="md:hidden" />
        <GlobalSearch />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => navigate("/app/settings")}
          className="h-10 w-10 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors cursor-pointer"
        >
          <Settings className="h-[18px] w-[18px]" />
        </button>

        <NotificationCenter />

        <div className="w-px h-8 bg-border/60 mx-1 hidden sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity rounded-xl px-2 py-1.5 hover:bg-muted/60">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-foreground leading-tight">{userName}</p>
              <p className="text-[11px] text-muted-foreground capitalize">{userRole}</p>
            </div>
            <UserAvatar
              src={userAvatar}
              alt={userFullName}
              initials={getInitials(userFullName)}
              size="md"
              className="ring-2 ring-primary/20"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg border-border/50">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold">{userFullName}</p>
                <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/app/profile")} className="rounded-lg cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/app/settings")} className="rounded-lg cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            {userRole === "employee" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/onboarding")} className="rounded-lg cursor-pointer">
                  <SquareCheckBigIcon className="mr-2 h-4 w-4" />
                  <span>Onboarding</span>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="rounded-lg cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
