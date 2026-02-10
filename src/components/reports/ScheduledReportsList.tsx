import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomPagination } from "@/components/CustomPagination";
import {
  Clock,
  Mail,
  FileBarChart,
  Trash2,
  Edit,
  Power,
  Plus,
} from "lucide-react";
import {
  useScheduledReports,
  useDeleteScheduledReport,
  useToggleScheduledReport,
  type ScheduledReport,
} from "@/hooks/useScheduledReports";
import { ScheduledReportForm } from "./ScheduledReportForm";
import { format } from "date-fns";

const reportTypeColors: Record<string, string> = {
  ATTENDANCE: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  OVERTIME: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  LEAVE: "bg-green-500/10 text-green-700 dark:text-green-400",
  PRODUCTIVITY: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  COST: "bg-red-500/10 text-red-700 dark:text-red-400",
};

const frequencyColors: Record<string, string> = {
  DAILY: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400",
  WEEKLY: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400",
  MONTHLY: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
};

export function ScheduledReportsList() {
  const [page, setPage] = React.useState(1);
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingReport, setEditingReport] = React.useState<ScheduledReport | null>(null);

  const { data: result, isLoading } = useScheduledReports(page);
  const deleteMutation = useDeleteScheduledReport();
  const toggleMutation = useToggleScheduledReport();

  const reports = result?.data ?? [];
  const meta = result?.meta;

  const handleEdit = (report: ScheduledReport) => {
    setEditingReport(report);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this scheduled report?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggle = (id: string) => {
    toggleMutation.mutate(id);
  };

  const handleCreate = () => {
    setEditingReport(null);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingReport(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileBarChart className="h-5 w-5" />
          Scheduled Reports
        </CardTitle>
        <Button onClick={handleCreate} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          New Schedule
        </Button>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto w-full">
            <Table className="min-w-[900px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Report Type</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Next Send</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <p className="text-muted-foreground">Loading...</p>
                    </TableCell>
                  </TableRow>
                ) : reports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Clock className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          No scheduled reports yet.
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Create your first report schedule to automate report delivery.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">
                        {report.name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={reportTypeColors[report.reportType] || ""}
                        >
                          {report.reportType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={frequencyColors[report.frequency] || ""}
                        >
                          {report.frequency}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm">
                            {report.recipients.length}{" "}
                            {report.recipients.length === 1
                              ? "recipient"
                              : "recipients"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {report.nextSendAt
                          ? format(new Date(report.nextSendAt), "MMM d, yyyy HH:mm")
                          : "---"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={report.isActive ? "default" : "secondary"}
                          className={
                            report.isActive
                              ? "bg-green-500/10 text-green-700 dark:text-green-400"
                              : "bg-gray-500/10 text-gray-500"
                          }
                        >
                          {report.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(report)}
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggle(report.id)}
                            title={report.isActive ? "Deactivate" : "Activate"}
                          >
                            <Power
                              className={`h-4 w-4 ${
                                report.isActive
                                  ? "text-green-600"
                                  : "text-muted-foreground"
                              }`}
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(report.id)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {meta && meta.totalPages > 1 && (
          <div className="mt-4">
            <CustomPagination
              page={page}
              totalPages={meta.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </CardContent>

      <ScheduledReportForm
        open={formOpen}
        onOpenChange={handleFormClose}
        report={editingReport}
      />
    </Card>
  );
}

export default ScheduledReportsList;
