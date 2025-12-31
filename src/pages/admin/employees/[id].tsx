import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import {
  transformUserData,
  EmployeeProfileCard,
  EmployeeTabsContent,
  SkeletonLoader,
  getDepartmentColor,
} from "@/components/employeeInfo";
import type { Employee } from "@/components/employeeInfo";

const EmployeeDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  // Fetch employee data with onboarding info
  const {
    data: employee,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["employee", id],
    queryFn: async (): Promise<Employee> => {
      try {
        if (!id) throw new Error("No employee ID provided");

        // Fetch employee profile with onboarding data from database
        const { data } = await api.get(`/onboarding/employee/${id}`);
        return transformUserData(data.data);
      } catch (err) {
        console.error("Failed to fetch employee profile:", err);
        throw err;
      }
    },
    enabled: !!id,
  });

  if (isLoading) return <SkeletonLoader />;
  if (error)
    return (
      <div className="container py-8 text-center text-lg text-red-600">
        Failed to load employee data. Please try again.
      </div>
    );
  if (!employee)
    return (
      <div className="container py-8 text-center text-lg text-muted-foreground">
        Employee data not available
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="">
        <div className="container">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate("/employees")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Employees
          </Button>
          <h1 className="text-3xl font-bold">{employee.name}</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <EmployeeProfileCard
              employee={employee}
              getDepartmentColor={getDepartmentColor}
              onSalaryUpdated={async () => {
                await queryClient.invalidateQueries({
                  queryKey: ["employee", id],
                });
              }}
            />
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2">
            <EmployeeTabsContent employee={employee} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
