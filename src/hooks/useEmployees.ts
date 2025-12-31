import { authClient } from "@/lib/auth-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import api from "@/lib/axios";
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

// Fetch all departments and create a lookup map
const fetchDepartmentMap = async (): Promise<Map<string, string>> => {
  try {
    const response = await api.get("/departments?limit=1000");
    const departmentMap = new Map<string, string>();

    response.data.data?.forEach((dept: { id: string; name: string }) => {
      departmentMap.set(dept.id, dept.name);
    });

    return departmentMap;
  } catch (error) {
    console.error("Failed to fetch departments", error);
    return new Map();
  }
};

interface UserData {
  id: string;
  uniqueId?: string;
  name: string;
  email: string;
  image?: string | null;
  role?: string;
  department?: string;
  departmentId?: string;
  createdAt: Date | string;
  salary?: number;
  githubUrl?: string;
  linkedinUrl?: string;
  banned?: boolean | null;
}

const mapUserToEmployee = (
  user: UserData,
  departmentMap: Map<string, string>
): Employee => {
  // Get department name from departmentId using the map, fallback to department field, then "Unassigned"
  let departmentName = "Unassigned";
  if (user.departmentId && departmentMap.has(user.departmentId)) {
    departmentName = departmentMap.get(user.departmentId)!;
  } else if (
    user.department &&
    user.department !== "-" &&
    user.department !== "Unassigned"
  ) {
    departmentName = user.department;
  }

  return {
    id: user.id,
    uniqueId: user.uniqueId,
    name: user.name || "Unknown",
    email: user.email,
    role: user.role || "employee",
    department: departmentName,
    departmentId: user.departmentId,
    dateJoined: formatDistanceToNow(new Date(user.createdAt), {
      addSuffix: true,
    }),
    salary: user.salary,
    status: Math.random() > 0.5 ? "Online" : "Offline",
    avatar: user.image || getInitials(user.name || ""),
    githubUrl: user.githubUrl,
    linkedinUrl: user.linkedinUrl,
    banned: user.banned,
  };
};

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

      const offset = (page - 1) * itemsPerPage;

      const queryObj: Record<string, string | number> = {
        limit: itemsPerPage,
        offset: offset,
        sortBy: "createdAt",
        sortDirection: "desc",
      };

      if (search) {
        queryObj.searchValue = search;
        queryObj.searchField = "name";
        queryObj.searchOperator = "contains";
      }

      if (department) {
        queryObj.filterField = "departmentId";
        queryObj.filterValue = department;
        queryObj.filterOperator = "eq";
      }

      if (role) {
        queryObj.filterField = "role";
        queryObj.filterValue = role;
        queryObj.filterOperator = "eq";
      }

      // Fetch departments first to build the lookup map
      const departmentMap = await fetchDepartmentMap();

      const { data: usersData, error } = await authClient.admin.listUsers({
        query: queryObj,
      });
      console.log("Users Data:", usersData, "Error:", error);

      if (error) {
        throw new Error("Failed to fetch employees");
      }

      if (!usersData || !usersData.users) {
        return {
          employees: [],
          totalPages: 0,
          total: 0,
        };
      }

      let employees = usersData.users.map((user: UserData) =>
        mapUserToEmployee(user, departmentMap)
      );

      if (search) {
        const searchLower = search.toLowerCase();
        employees = employees.filter(
          (emp) =>
            emp.name.toLowerCase().includes(searchLower) ||
            emp.email.toLowerCase().includes(searchLower)
        );
      }

      // Apply role filter on client-side if department filter was used server-side
      if (role && department) {
        employees = employees.filter((emp) => emp.role === role);
      }

      // Apply status filter on client-side (computed field based on random state)
      if (status) {
        employees = employees.filter((emp) => emp.status === status);
      }

      // Use the total count from server response for pagination
      const totalCount = usersData.total || 0;
      const totalPages = Math.ceil(totalCount / itemsPerPage);

      return {
        employees,
        totalPages,
        total: totalCount,
      };
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

  return {
    banUser,
    unbanUser,
    isLoading,
    error,
  };
};
