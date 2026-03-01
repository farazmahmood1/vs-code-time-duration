import { useSession } from "@/lib/auth-client";

export type UserRole = "super_admin" | "admin" | "employee";

export const useRole = () => {
  const { data: session, isPending } = useSession();

  const role = session?.user?.role as UserRole | undefined;

  return {
    role: role || "employee",
    isSuperAdmin: role === "super_admin",
    isAdmin: role === "admin" || role === "super_admin",
    isEmployee: role === "employee" || !role,
    isLoading: isPending,
  };
};
