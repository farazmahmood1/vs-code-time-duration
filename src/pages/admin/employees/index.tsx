import { EmployeeCard } from "@/components/employees/EmployeeCard";
import { EmployeeFilters } from "@/components/employees/EmployeeFilters";
import { EmployeeTable } from "@/components/employees/EmployeeTable";
import { AddEmployeeModal } from "@/components/employees/AddEmployeeModal";
import { AssignDepartmentDialog } from "@/components/employees/AssignDepartmentDialog";
import { SalaryEditDialog } from "@/components/employeeInfo/SalaryEditDialog";
import { CustomPagination } from "@/components/CustomPagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import ResponsiveDialog from "@/components/ResponsiveDialog";
import { useEmployees } from "@/hooks/useEmployees";
import { useRemoveEmployeeFromDepartment } from "@/hooks/useDepartments";
import type { Employee } from "@/hooks/useEmployees";
import { Grid3x3, List, Plus, Search, Users } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "use-debounce";

const Employees = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch] = useDebounce(searchInput, 750);
  const [department, setDepartment] = useState("all");
  const [role, setRole] = useState("all");
  const [addEmployeeModalOpen, setAddEmployeeModalOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [unassignDialogOpen, setUnassignDialogOpen] = useState(false);
  const [salaryDialogOpen, setSalaryDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const removeMutation = useRemoveEmployeeFromDepartment();

  const { data, isLoading } = useEmployees(
    page,
    debouncedSearch,
    department === "all" ? "" : department,
    role === "all" ? "" : role,
    "",
    ""
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Employees Details
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and oversee employee information
          </p>
        </div>
        <Button
          className="w-full sm:w-auto"
          onClick={() => setAddEmployeeModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              className="pl-9"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <EmployeeFilters
            department={department}
            setDepartment={(val) => {
              setDepartment(val);
              setPage(1);
            }}
            role={role}
            setRole={(val) => {
              setRole(val);
              setPage(1);
            }}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-[400px]" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 flex-1 max-w-xs" />
                <Skeleton className="h-4 flex-1 max-w-xs" />
                <Skeleton className="h-4 flex-1 max-w-xs" />
                <Skeleton className="h-4 w-20" />
              </div>
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 border rounded-lg"
                >
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 flex-1 max-w-xs" />
                  <Skeleton className="h-4 flex-1 max-w-xs" />
                  <Skeleton className="h-4 flex-1 max-w-xs" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {viewMode === "grid" ? (
            <>
              {data?.employees && data.employees.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {data.employees.map((employee) => (
                    <EmployeeCard key={employee.id} employee={employee} />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border bg-card p-12">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Users className="h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">
                      No employees found
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {debouncedSearch || department !== "all" || role !== "all"
                        ? "Try adjusting your filters or search criteria"
                        : "Start by adding your first employee"}
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {data?.employees && data.employees.length > 0 ? (
                <EmployeeTable
                  employees={data.employees || []}
                  onAssignClick={(employee) => {
                    setSelectedEmployee(employee);
                    setAssignDialogOpen(true);
                  }}
                  onUnassignClick={(employee) => {
                    setSelectedEmployee(employee);
                    setUnassignDialogOpen(true);
                  }}
                  onSalaryClick={(employee) => {
                    setSelectedEmployee(employee);
                    setSalaryDialogOpen(true);
                  }}
                />
              ) : (
                <div className="rounded-lg border bg-card p-12">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Users className="h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">
                      No employees found
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {debouncedSearch || department !== "all" || role !== "all"
                        ? "Try adjusting your filters or search criteria"
                        : "Start by adding your first employee"}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {data && data.totalPages > 1 && (
        <CustomPagination
          page={page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}

      <AddEmployeeModal
        open={addEmployeeModalOpen}
        onOpenChange={setAddEmployeeModalOpen}
      />

      {selectedEmployee && (
        <>
          <AssignDepartmentDialog
            open={assignDialogOpen}
            onOpenChange={setAssignDialogOpen}
            employeeId={selectedEmployee.id}
            employeeName={selectedEmployee.name}
            currentDepartmentId={selectedEmployee.departmentId}
          />

          <ResponsiveDialog
            open={unassignDialogOpen}
            onOpenChange={setUnassignDialogOpen}
            title="Remove from Department"
            description={`Remove ${selectedEmployee.name} from ${selectedEmployee.department}?`}
          >
            <div className="flex gap-2 justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => setUnassignDialogOpen(false)}
                disabled={removeMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  removeMutation.mutate(selectedEmployee.id, {
                    onSuccess: () => {
                      setUnassignDialogOpen(false);
                    },
                  });
                }}
                disabled={removeMutation.isPending}
              >
                {removeMutation.isPending ? "Removing..." : "Remove"}
              </Button>
            </div>
          </ResponsiveDialog>
        </>
      )}

      {selectedEmployee && (
        <SalaryEditDialog
          open={salaryDialogOpen}
          onOpenChange={setSalaryDialogOpen}
          employee={selectedEmployee}
          onSalaryUpdate={async () => {
            setSalaryDialogOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Employees;
