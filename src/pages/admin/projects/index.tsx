import ProjectCard from "@/components/projects/ProjectCard";
import ProjectFilters from "@/components/projects/ProjectFilters";
import { ProjectForm } from "@/components/projects/ProjectForm";
import ProjectHeader from "@/components/projects/ProjectHeader";
import ProjectTable from "@/components/projects/ProjectTable";
import ResponsiveDialog from "@/components/ResponsiveDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDeleteProject,
  useProjects,
  type Project,
} from "@/hooks/useProject";
import { useState } from "react";
import { useDebounce } from "use-debounce";

export default function ProjectsPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch] = useDebounce(searchInput, 750);
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const { data, isLoading } = useProjects({
    page,
    limit: 10,
    status: statusFilter === "all" ? undefined : statusFilter,
    departmentId: departmentFilter === "all" ? undefined : departmentFilter,
    search: debouncedSearch || undefined,
  });

  const deleteProjectMutation = useDeleteProject();

  const handleCreateClick = () => {
    setEditingProject(null);
    setCreateDialogOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setCreateDialogOpen(true);
  };

  const handleDelete = (project: Project) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (projectToDelete) {
      deleteProjectMutation.mutate(projectToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setProjectToDelete(null);
        },
      });
    }
  };

  const projects = data?.data || [];
  const totalPages = data?.meta.totalPages || 1;

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
      <ProjectHeader onCreateClick={handleCreateClick} />

      <ProjectFilters
        onSearchChange={(value) => {
          setSearchInput(value);
          setPage(1);
        }}
        onDepartmentChange={(value) => {
          setDepartmentFilter(value);
          setPage(1);
        }}
        onStatusChange={(value) => {
          setStatusFilter(value);
          setPage(1);
        }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {viewMode === "list" ? (
        projects.length > 0 ? (
          <ProjectTable
            projects={projects}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">
              No projects found matching your criteria
            </p>
          </Card>
        )
      ) : (
        <>
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                No projects found matching your criteria
              </p>
            </Card>
          )}
        </>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded ${
                page === p
                  ? "bg-primary text-primary-foreground"
                  : "border hover:bg-muted"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <ProjectForm
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        project={editingProject}
      />

      <ResponsiveDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Project"
        description="This action cannot be undone"
      >
        <div className="flex gap-2 justify-end ">
          <Button
            variant="outline"
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleteProjectMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmDelete}
            disabled={deleteProjectMutation.isPending}
          >
            {deleteProjectMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </ResponsiveDialog>
    </div>
  );
}
