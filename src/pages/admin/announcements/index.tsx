import AnnouncementCard from "@/components/announcements/AnnouncementCard";
import AnnouncementFilters from "@/components/announcements/AnnouncementFilters";
import { EditAnnouncementDialog } from "@/components/announcements/AnnouncementForm";
import AnnouncementHeader from "@/components/announcements/AnnouncementHeader";
import AnnouncementTable from "@/components/announcements/AnnouncementTable";
import { CreateAnnouncementDialog } from "@/components/announcements/AnnouncementForm";
import DeleteConfirmDialog from "@/components/announcements/DeleteAnnouncementDialog";
import ViewAnnouncementDialog from "@/components/announcements/ViewAnnouncementDialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAnnouncements,
  useDeleteAnnouncement,
  type Announcement,
} from "@/hooks/useAnnouncements";
import { useState } from "react";

const Announcements = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<
    string | null
  >(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { data, isLoading } = useAnnouncements({
    search: searchQuery,
    category: categoryFilter,
    department: departmentFilter,
    page: currentPage,
    pageSize: 10,
  });

  const deleteMutation = useDeleteAnnouncement();

  const announcements = data?.announcements || [];
  const totalPages = data?.totalPages || 0;

  const handleView = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setViewDialogOpen(true);
  };

  const handleEdit = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setAnnouncementToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (announcementToDelete) {
      deleteMutation.mutate(announcementToDelete, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setAnnouncementToDelete(null);
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnnouncementHeader onCreateClick={() => setCreateDialogOpen(true)} />

      <AnnouncementFilters
        onSearchChange={(value) => {
          setSearchQuery(value);
          setCurrentPage(1);
        }}
        onCategoryChange={(value) => {
          setCategoryFilter(value);
          setCurrentPage(1);
        }}
        onDepartmentChange={(value) => {
          setDepartmentFilter(value);
          setCurrentPage(1);
        }}
        departmentValue={departmentFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {announcements.length === 0 && !isLoading && (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground mb-2">No announcements found.</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters or create a new announcement!
          </p>
        </div>
      )}

      {viewMode === "list" && announcements.length > 0 && (
        <AnnouncementTable
          announcements={announcements}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {viewMode === "grid" && announcements.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <CreateAnnouncementDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      <ViewAnnouncementDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        announcement={selectedAnnouncement}
      />

      <EditAnnouncementDialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) setSelectedAnnouncement(null); // clear on close
        }}
        announcement={selectedAnnouncement}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        isLoading={deleteMutation.isPending}
        title="Delete Announcement"
        message="Are you sure you want to delete this announcement? This action cannot be undone."
      />
    </div>
  );
};

export default Announcements;
