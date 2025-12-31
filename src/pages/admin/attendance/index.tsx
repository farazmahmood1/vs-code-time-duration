import { AttendanceCard } from "@/components/attendance/AttendanceCard";
import { AttendanceFilters } from "@/components/attendance/AttendanceFilters";
import { AttendanceTable } from "@/components/attendance/AttendanceTable";
import { CustomPagination } from "@/components/CustomPagination";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import {
  useAttendanceData,
  useExportAttendance,
} from "@/hooks/useAttendanceData";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { format } from "date-fns";
import { Download, Loader2 } from "lucide-react";

const Attendance = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [date, setDate] = useState<Date>(new Date());
  const [department, setDepartment] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch] = useDebounce(searchInput, 750);
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const { data, isLoading } = useAttendanceData({
    page,
    pageSize,
    date,
    department: department === "all" ? undefined : department,
    search: debouncedSearch || undefined,
    showActiveOnly,
  });

  // const { data: summary, isLoading: summaryLoading } =
  //   useAttendanceSummary(date);
  const exportAttendance = useExportAttendance();

  // Extract unique departments from data
  const departments = Array.from(
    new Set(
      data?.data.map((record) => record.department).filter(Boolean) as string[]
    )
  ).sort();

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const exportData = await exportAttendance({
        date,
        department: department === "all" ? undefined : department,
        search: debouncedSearch || undefined,
      });

      // Convert to CSV
      const headers = [
        "ID",
        "Employee",
        "Department",
        "Status",
        "Check-in",
        "Check-out",
        "Work Hours",
      ];
      const csvContent = [
        headers.join(","),
        ...exportData.map((record: (typeof exportData)[number]) =>
          [
            record.id,
            record.employeeName,
            record.department || "-",
            record.status,
            record.checkInTime || "-",
            record.checkOutTime || "-",
            record.workHours,
          ].join(",")
        ),
      ].join("\n");

      // Download
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `attendance-${date.toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Attendance data exported successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to export attendance data",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">
            Track employee attendance for {format(date, "MMMM d, yyyy")}
          </p>
        </div>
        <Button onClick={handleExport} disabled={isExporting} className="gap-2">
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Export to CSV
            </>
          )}
        </Button>
      </div>

      <AttendanceFilters
        date={date}
        onDateChange={(d) => setDate(d || new Date())}
        department={department}
        onDepartmentChange={setDepartment}
        search={searchInput}
        onSearchChange={setSearchInput}
        showActiveOnly={showActiveOnly}
        onShowActiveOnlyChange={setShowActiveOnly}
        departments={departments}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {isMobile || viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-lg border bg-card p-6">
                <div className="space-y-4">
                  <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-48 animate-pulse rounded bg-muted" />
                  <div className="h-8 w-20 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))
          ) : data?.data && data.data.length > 0 ? (
            data.data.map((record) => (
              <AttendanceCard key={record.id} record={record} />
            ))
          ) : (
            <div className="col-span-full rounded-lg border bg-card p-12">
              <div className="flex flex-col items-center justify-center text-center">
                <svg
                  className="h-12 w-12 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-semibold">
                  No attendance records found
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try adjusting your filters or date selection.
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <AttendanceTable data={data?.data || []} isLoading={isLoading} />
      )}

      <CustomPagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};

export default Attendance;
