import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEmployeeAnnouncements } from "@/hooks/useEmployeeAnnouncements";
import EmployeeAnnouncementCard from "@/components/announcements/EmployeeAnnouncementCard";
import { Input } from "@/components/ui/input";
import { useSession } from "@/lib/auth-client";
import { Search } from "lucide-react";
import { useDebounce } from "use-debounce";

export default function EmployeeAnnouncements() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch] = useDebounce(searchInput, 750);
  const [currentPage, setCurrentPage] = useState(1);
  const { data: session } = useSession();

  const { data, isLoading, isError, error } = useEmployeeAnnouncements({
    page: currentPage,
    pageSize: 10,
    search: debouncedSearch,
  });

  console.log("Session:", session);
  console.log("Data:", data);
  console.log("Loading:", isLoading);
  console.log("Error:", error);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="p-12 text-center">
        <p className="text-red-500">
          Error loading announcements: {error?.message}
        </p>
      </Card>
    );
  }

  console.log(data);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Announcements</h1>
        <p className="text-muted-foreground mt-1">
          Stay updated with company-wide and department-specific announcements
        </p>
      </div>
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search announcements..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="max-w-md pl-10"
        />
      </div>

      <div className="space-y-4">
        {data?.announcements && data.announcements.length > 0 ? (
          data.announcements.map((announcement) => (
            <EmployeeAnnouncementCard
              key={announcement.id}
              announcement={announcement}
            />
          ))
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">
              No announcements available for your department
            </p>
          </Card>
        )}
      </div>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <span className="text-sm text-muted-foreground">
            Page {data.page} of {data.totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(data.totalPages, p + 1))
              }
              disabled={currentPage === data.totalPages}
              className="px-4 py-2 text-sm font-medium border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
