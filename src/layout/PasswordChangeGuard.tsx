import { ForcePasswordChangeModal } from "@/components/ForcePasswordChangeModal";
import { useSession } from "@/lib/auth-client";
import { Navigate, useLocation } from "react-router-dom";

interface PasswordChangeGuardProps {
  children: React.ReactNode;
}

export function PasswordChangeGuard({ children }: PasswordChangeGuardProps) {
  const { data: session } = useSession();
  const location = useLocation();

  const user = session?.user as Record<string, unknown>;
  const isPasswordChanged = (user?.isPasswordChanged as boolean) ?? true;

  if (session?.user && !isPasswordChanged && location.pathname !== "/profile") {
    return (
      <>
        <Navigate to="/profile" replace />
        <ForcePasswordChangeModal
          open={true}
          onPasswordChanged={() => {
            console.log("Password changed, reloading...");
            window.location.reload();
          }}
        />
      </>
    );
  }

  if (session?.user && !isPasswordChanged && location.pathname === "/profile") {
    return (
      <>
        {children}
        <ForcePasswordChangeModal
          open={true}
          onPasswordChanged={() => {
            console.log("Password changed, reloading...");
            window.location.reload();
          }}
        />
      </>
    );
  }

  return <>{children}</>;
}
