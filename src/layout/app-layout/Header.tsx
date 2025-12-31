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
import { LogOut, SquareCheckBigIcon, User } from "lucide-react";
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
  const userRole = session?.user?.role || "role";
  const userAvatar = session?.user?.image;

  return (
    <header className="h-16 border-b flex items-center md:justify-end justify-between px-4 sticky top-0 bg-background z-10">
      <SidebarTrigger className="md:hidden" />
      <div className="flex items-center gap-4">
        {/* <Bell className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" /> */}
        <NotificationCenter />
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="text-right">
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-muted-foreground">{userRole}</p>
            </div>
            <UserAvatar
              src={userAvatar}
              alt={userName}
              initials={getInitials(userName)}
              size="md"
              className="border border-primary"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            {userRole === "employee" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/onboarding")}>
                  <SquareCheckBigIcon className="mr-2 h-4 w-4" />
                  <span>Onboarding</span>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="hover:bg-red-100!"
            >
              <LogOut className="mr-2 h-4 w-4 text-destructive" />
              <span className="text-destructive">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
