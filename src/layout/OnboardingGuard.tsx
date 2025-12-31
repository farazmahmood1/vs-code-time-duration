import { OnboardingPage } from "@/pages/onboarding";
import { useSession } from "@/lib/auth-client";
import { Navigate, useLocation } from "react-router-dom";

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export function OnboardingGuard({ children }: OnboardingGuardProps) {
  const { data: session } = useSession();
  const location = useLocation();

  const user = session?.user as Record<string, unknown>;
  const isProfileCompleted = (user?.isProfileCompleted as boolean) ?? true;

  if (
    session?.user &&
    !isProfileCompleted &&
    location.pathname !== "/profile"
  ) {
    document.documentElement.style.overflow = "hidden";
    return (
      <>
        <Navigate to="/profile" replace />
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <OnboardingPage
            onCompleted={() => {
              console.log("Onboarding completed, reloading...");
              window.location.reload();
            }}
          />
        </div>
      </>
    );
  }

  if (
    session?.user &&
    !isProfileCompleted &&
    location.pathname === "/profile"
  ) {
    document.documentElement.style.overflow = "hidden";
    return (
      <>
        {children}
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <OnboardingPage
            onCompleted={() => {
              console.log("Onboarding completed, reloading...");
              window.location.reload();
            }}
          />
        </div>
      </>
    );
  }

  document.documentElement.style.overflow = "auto";
  return <>{children}</>;
}
