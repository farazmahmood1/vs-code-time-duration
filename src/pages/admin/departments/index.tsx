import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import ResponsiveDialog from "@/components/ResponsiveDialog";
import DepartmentHeader from "@/components/departments/DepartmentHeader";
import DepartmentFilters from "@/components/departments/DepartmentFilters";
import DepartmentTable from "@/components/departments/DepartmentTable";
import DepartmentCard from "@/components/departments/DepartmentCard";
import { DepartmentForm } from "@/components/departments/DepartmentForm";
import {
  useDepartments,
  useCreateDepartment,
  useUpdateDepartment,
  useDeleteDepartment,
  type Department,
  type DepartmentFormData,
} from "@/hooks/useDepartments";

export default function DepartmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingDepartmentId, setDeletingDepartmentId] = useState<
    string | null
  >(null);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null
  );

  // API hooks
  const { data, isLoading } = useDepartments({ search: searchQuery });
  const createMutation = useCreateDepartment();
  const updateMutation = useUpdateDepartment();
  const deleteMutation = useDeleteDepartment();

  const departments = data?.data || [];

  const filteredDepartments = useMemo(() => {
    return departments.filter((dept) => {
      const matchesSearch =
        dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (dept.description?.toLowerCase().includes(searchQuery.toLowerCase()) ??
          false);
      return matchesSearch;
    });
  }, [departments, searchQuery]);

  const handleCreateClick = () => {
    setEditingDepartment(null);
    setCreateDialogOpen(true);
  };

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setCreateDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingDepartmentId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingDepartmentId) {
      deleteMutation.mutate(deletingDepartmentId);
      setDeleteDialogOpen(false);
      setDeletingDepartmentId(null);
    }
  };

  const handleSubmit = (formData: DepartmentFormData) => {
    if (editingDepartment) {
      updateMutation.mutate({
        id: editingDepartment.id,
        data: formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const deletingDepartment = departments.find(
    (d) => d.id === deletingDepartmentId
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DepartmentHeader onCreateClick={handleCreateClick} />

      <DepartmentFilters
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {viewMode === "list" ? (
        <DepartmentTable
          departments={filteredDepartments}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDepartments.map((department) => (
            <DepartmentCard
              key={department.id}
              department={department}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {filteredDepartments.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            No departments found matching your criteria
          </p>
        </Card>
      )}

      <DepartmentForm
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        department={editingDepartment}
        onSubmit={handleSubmit}
      />

      <ResponsiveDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Department"
        description={`Are you sure you want to delete "${deletingDepartment?.name}"? This action cannot be undone.`}
      >
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </ResponsiveDialog>
    </div>
  );
}
