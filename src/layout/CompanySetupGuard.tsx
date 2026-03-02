import { useSession } from "@/lib/auth-client";
import { Navigate } from "react-router-dom";

interface CompanySetupGuardProps {
  children: React.ReactNode;
}

export function CompanySetupGuard({ children }: CompanySetupGuardProps) {
  const { data: session } = useSession();

  const user = session?.user;
  const companyId = (user as Record<string, unknown>)?.companyId as
    | string
    | null
    | undefined;
  const role = user?.role as string | undefined;

  // Super admins don't belong to companies — skip guard
  if (role === "super_admin") {
    return <>{children}</>;
  }

  // User has no company — redirect to setup
  if (session?.user && !companyId) {
    return <Navigate to="/setup" replace />;
  }

  return <>{children}</>;
}
