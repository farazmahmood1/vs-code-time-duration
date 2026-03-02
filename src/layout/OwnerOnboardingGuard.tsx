import { OwnerOnboardingPage } from "@/pages/owner-onboarding";
import { useSession, authClient } from "@/lib/auth-client";
import { Navigate, useLocation } from "react-router-dom";

interface OwnerOnboardingGuardProps {
  children: React.ReactNode;
}

const handleOnboardingComplete = async () => {
  document.documentElement.style.overflow = "auto";
  // Force-refresh the session so guards see updated isProfileCompleted
  await authClient.getSession({ fetchOptions: { cache: "no-store" } });
};

export function OwnerOnboardingGuard({ children }: OwnerOnboardingGuardProps) {
  const { data: session } = useSession();
  const location = useLocation();

  const user = session?.user as Record<string, unknown>;
  const isProfileCompleted = (user?.isProfileCompleted as boolean) ?? true;
  const role = user?.role as string;

  // Only apply to admin users
  if (role !== "admin") {
    return <>{children}</>;
  }

  if (
    session?.user &&
    !isProfileCompleted &&
    location.pathname !== "/app/profile"
  ) {
    document.documentElement.style.overflow = "hidden";
    return (
      <>
        <Navigate to="/app/profile" replace />
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <OwnerOnboardingPage onCompleted={handleOnboardingComplete} />
        </div>
      </>
    );
  }

  if (
    session?.user &&
    !isProfileCompleted &&
    location.pathname === "/app/profile"
  ) {
    document.documentElement.style.overflow = "hidden";
    return (
      <>
        {children}
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <OwnerOnboardingPage onCompleted={handleOnboardingComplete} />
        </div>
      </>
    );
  }

  document.documentElement.style.overflow = "auto";
  return <>{children}</>;
}
