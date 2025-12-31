import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ResponsiveDialog from "@/components/ResponsiveDialog";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface SalaryEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: { id: string; salary?: number | null } | null;
  onSalaryUpdate: () => Promise<void>;
}

export const SalaryEditDialog = ({
  open,
  onOpenChange,
  employee,
  onSalaryUpdate,
}: SalaryEditDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [salary, setSalary] = useState<string>(
    employee?.salary ? employee.salary.toString() : ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!salary || parseFloat(salary) < 0) {
      setError("Please enter a valid salary amount");
      return;
    }

    try {
      setIsLoading(true);
      const salaryValue = parseFloat(salary);
      console.log(
        "Updating salary for user:",
        employee?.id,
        "with value:",
        salaryValue
      );

      // Use admin client to update a specific user's salary
      const response = await authClient.admin.updateUser({
        userId: employee!.id,
        data: {
          salary: salaryValue,
        },
      });

      console.log("Update response:", response);

      // Invalidate all relevant queries to trigger instant UI updates
      await queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["employee"],
      });

      toast({
        title: "Success",
        description: "Salary updated successfully",
      });
      await onSalaryUpdate();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update salary";
      console.error("Salary update error for user", employee?.id, ":", err);
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={employee?.salary ? "Edit Salary" : "Add Salary"}
      description={
        employee?.salary
          ? "Update the employee salary"
          : "Add a salary for this employee"
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="salary">Salary (PKR)</Label>
          <Input
            id="salary"
            type="number"
            placeholder="Enter salary amount"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            disabled={isLoading}
            min="0"
            step="0.01"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {employee?.salary ? "Update Salary" : "Add Salary"}
          </Button>
        </div>
      </form>
    </ResponsiveDialog>
  );
};
