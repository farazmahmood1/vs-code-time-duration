import { authClient } from "@/lib/auth-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import api from "@/lib/api";
import { useState } from "react";

export interface Employee {
  id: string;
  uniqueId?: string;
  name: string;
  email: string;
  role: string;
  department: string;
  departmentId?: string;
  dateJoined: string;
  location?: string;
  salary?: number;
  status: "Online" | "Offline";
  avatar: string;
  githubUrl?: string;
  linkedinUrl?: string;
  banned?: boolean | null;
}

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .filter((word) => isNaN(Number(word)))
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
};

interface UserData {
  id: string;
  uniqueId?: string;
  name: string;
  email: string;
  image?: string | null;
  role?: string;
  department?: { id: string; name: string } | null;
  departmentId?: string;
  createdAt: Date | string;
  salary?: number;
  githubUrl?: string;
  linkedinUrl?: string;
  banned?: boolean | null;
}

export const useEmployees = (
  page: number,
  search: string,
  department: string,
  role: string,
  location: string,
  status: string
) => {
  return useQuery({
    queryKey: ["employees", page, search, department, role, location, status],
    queryFn: async () => {
      const itemsPerPage = 8;

      const params: Record<string, string | number> = {
        page,
        limit: itemsPerPage,
        sortBy: "createdAt",
        sortDirection: "desc",
      };

      if (search) params.search = search;
      if (department) params.departmentId = department;
      if (role) params.role = role;

      const res = await api.get("/employees", { params });
      const { users, total, totalPages } = res.data;

      if (!users || users.length === 0) {
        return { employees: [], totalPages: 0, total: 0 };
      }

      const employees: Employee[] = users.map((user: UserData & { department?: { id: string; name: string } | null }) => ({
        id: user.id,
        uniqueId: user.uniqueId,
        name: user.name || "Unknown",
        email: user.email,
        role: user.role || "employee",
        department: user.department?.name || "Unassigned",
        departmentId: user.departmentId,
        dateJoined: formatDistanceToNow(new Date(user.createdAt), { addSuffix: true }),
        salary: user.salary,
        status: "Offline" as const,
        avatar: user.image || getInitials(user.name || ""),
        githubUrl: user.githubUrl,
        linkedinUrl: user.linkedinUrl,
        banned: user.banned,
      }));

      return { employees, totalPages, total };
    },
  });
};

export const useEmployeeActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const banUser = async (
    userId: string,
    banReason: string = "Account deactivated"
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authClient.admin.banUser({
        userId,
        banReason,
      });

      if (result.error) {
        setError(result.error.message || "Failed to deactivate user");
        return { success: false, error: result.error };
      }

      // Invalidate employees queries
      queryClient.invalidateQueries({ queryKey: ["employees"] });

      return { success: true, data: result.data };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const unbanUser = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authClient.admin.unbanUser({
        userId,
      });

      if (result.error) {
        setError(result.error.message || "Failed to reactivate user");
        return { success: false, error: result.error };
      }

      // Invalidate employees queries
      queryClient.invalidateQueries({ queryKey: ["employees"] });

      return { success: true, data: result.data };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authClient.admin.removeUser({
        userId,
      });

      if (result.error) {
        setError(result.error.message || "Failed to delete user");
        return { success: false, error: result.error };
      }

      queryClient.invalidateQueries({ queryKey: ["employees"] });

      return { success: true, data: result.data };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    banUser,
    unbanUser,
    deleteUser,
    isLoading,
    error,
  };
};
