import { useSession } from "@/lib/auth-client";

export type UserRole = "admin" | "employee";

export const useRole = () => {
  const { data: session, isPending } = useSession();

  const role = session?.user?.role as UserRole | undefined;

  return {
    role: role || "employee",
    isAdmin: role === "admin",
    isEmployee: role === "employee" || !role,
    isLoading: isPending,
  };
};
