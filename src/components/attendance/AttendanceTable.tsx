import { type AttendanceRecord } from "@/hooks/useAttendanceData";
import { StatusBadge } from "./StatusBadge";
import { format } from "date-fns";
import { formatWorkHours } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface AttendanceTableProps {
  data: AttendanceRecord[];
  isLoading: boolean;
}

export const AttendanceTable = ({ data, isLoading }: AttendanceTableProps) => {
  // Define status priority order
  const statusPriority = {
    ONLINE: 1,
    OFFLINE: 2,
    BREAK: 3,
    ABSENT: 4,
  };

  // Sort data by status priority
  const sortedData = [...data].sort((a, b) => {
    const priorityA =
      statusPriority[a.status as keyof typeof statusPriority] ?? 5;
    const priorityB =
      statusPriority[b.status as keyof typeof statusPriority] ?? 5;
    return priorityA - priorityB;
  });

  if (isLoading) {
    return (
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Check-out</TableHead>
              <TableHead>Work Hours</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-12">
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
    );
  }

  return (
    <div className="border rounded-lg overflow-x-auto w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Check-in</TableHead>
            <TableHead>Check-out</TableHead>
            <TableHead>Work Hours</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((record) => (
            <TableRow
              key={record.id}
              className="hover:bg-muted/50 transition-colors"
            >
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{record.employeeName}</span>
                  <span className="text-xs text-muted-foreground">
                    {record.uniqueId}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-sm">
                {record.department || "-"}
              </TableCell>
              <TableCell>
                <StatusBadge status={record.status} />
              </TableCell>
              <TableCell className="text-sm">
                {record.checkInTime
                  ? format(new Date(record.checkInTime), "hh:mm a")
                  : "-"}
              </TableCell>
              <TableCell className="text-sm">
                {record.checkOutTime
                  ? format(new Date(record.checkOutTime), "hh:mm a")
                  : "-"}
              </TableCell>
              <TableCell className="text-sm font-medium">
                {formatWorkHours(Number(record.workHours))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
