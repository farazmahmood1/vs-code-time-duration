import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, List, Search, UserPlus } from "lucide-react";
import ResponsiveDialog from "@/components/ResponsiveDialog";
import ShiftHeader from "@/components/shifts/ShiftHeader";
import ShiftTable from "@/components/shifts/ShiftTable";
import ShiftCard from "@/components/shifts/ShiftCard";
import { ShiftForm } from "@/components/shifts/ShiftForm";
import { AssignShiftDialog } from "@/components/shifts/AssignShiftDialog";
import { ShiftEmployeesDialog } from "@/components/shifts/ShiftEmployeesDialog";
import { ShiftScheduler } from "@/components/shifts/ShiftScheduler";
import { SwapRequestsTable } from "@/components/shifts/SwapRequestsTable";
import {
  useShifts,
  useCreateShift,
  useUpdateShift,
  useDeleteShift,
  type Shift,
  type ShiftFormData,
} from "@/hooks/useShifts";

export default function ShiftsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [employeesDialogOpen, setEmployeesDialogOpen] = useState(false);
  const [deletingShiftId, setDeletingShiftId] = useState<string | null>(null);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

  const { data: shifts, isLoading } = useShifts();
  const createMutation = useCreateShift();
  const updateMutation = useUpdateShift();
  const deleteMutation = useDeleteShift();

  const filteredShifts = (shifts || []).filter((shift) =>
    shift.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateClick = () => {
    setEditingShift(null);
    setCreateDialogOpen(true);
  };

  const handleEdit = (shift: Shift) => {
    setEditingShift(shift);
    setCreateDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingShiftId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingShiftId) {
      deleteMutation.mutate(deletingShiftId);
      setDeleteDialogOpen(false);
      setDeletingShiftId(null);
    }
  };

  const handleViewEmployees = (shift: Shift) => {
    setSelectedShift(shift);
    setEmployeesDialogOpen(true);
  };

  const handleSubmit = (formData: ShiftFormData) => {
    if (editingShift) {
      updateMutation.mutate({ id: editingShift.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const deletingShift = shifts?.find((s) => s.id === deletingShiftId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ShiftHeader onCreateClick={handleCreateClick} />

      <Tabs defaultValue="shifts">
        <TabsList>
          <TabsTrigger value="shifts">Shifts</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="swaps">Swap Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="shifts" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:justify-between sm:flex-row">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search shifts..."
                className="pl-10"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row max-sm:mt-2 gap-2 sm:ml-2">
              <Button
                variant="outline"
                onClick={() => setAssignDialogOpen(true)}
                className="gap-1"
              >
                <UserPlus className="h-4 w-4" />
                Assign Employee
              </Button>
              <div className="flex">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <LayoutGrid className="h-4 w-4" />
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
            </div>
          </div>

          {/* Content */}
          {viewMode === "list" ? (
            <ShiftTable
              shifts={filteredShifts}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onViewEmployees={handleViewEmployees}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredShifts.map((shift) => (
                <ShiftCard
                  key={shift.id}
                  shift={shift}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                  onViewEmployees={handleViewEmployees}
                />
              ))}
            </div>
          )}

          {filteredShifts.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                {searchQuery
                  ? "No shifts found matching your search"
                  : "No shifts created yet. Create your first shift to get started."}
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="schedule">
          <ShiftScheduler />
        </TabsContent>

        <TabsContent value="swaps">
          <SwapRequestsTable />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <ShiftForm
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        shift={editingShift}
        onSubmit={handleSubmit}
      />

      <AssignShiftDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
      />

      <ShiftEmployeesDialog
        open={employeesDialogOpen}
        onOpenChange={setEmployeesDialogOpen}
        shift={selectedShift}
      />

      <ResponsiveDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Shift"
        description={`Are you sure you want to delete "${deletingShift?.name}"? This action cannot be undone.`}
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
