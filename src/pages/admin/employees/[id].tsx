import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, Loader2, AlertTriangle } from "lucide-react";
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
import { useEmployeeActions } from "@/hooks/useEmployees";
import ResponsiveDialog from "@/components/ResponsiveDialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const EmployeeDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { deleteUser, isLoading: isDeleting } = useEmployeeActions();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

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

  const handleDelete = async () => {
    if (!id) return;
    const result = await deleteUser(id);
    if (result.success) {
      toast({
        title: "Employee deleted",
        description: `${employee?.name} has been permanently deleted.`,
      });
      navigate("/app/employees");
    } else {
      toast({
        title: "Failed to delete",
        description:
          typeof result.error === "string"
            ? result.error
            : "Something went wrong.",
        variant: "destructive",
      });
    }
    setDeleteDialogOpen(false);
  };

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
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => navigate("/app/employees")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Employees
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Employee
            </Button>
          </div>
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

      {/* Delete Confirmation Dialog */}
      <ResponsiveDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Employee Permanently"
        description="This action cannot be undone."
      >
        <div className="space-y-4">
          <div className="flex gap-3 p-3 rounded-md bg-destructive/10 text-destructive">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">
                You are about to permanently delete {employee.name}.
              </p>
              <p className="mt-1">
                All associated data including attendance records, leave requests,
                and other information will be removed. This cannot be reversed.
              </p>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Permanently
            </Button>
          </div>
        </div>
      </ResponsiveDialog>
    </div>
  );
};

export default EmployeeDetail;
