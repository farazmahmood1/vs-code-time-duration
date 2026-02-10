import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ResponsiveDialog from "@/components/ResponsiveDialog";
import { X, Plus } from "lucide-react";
import {
  useCreateScheduledReport,
  useUpdateScheduledReport,
  type ScheduledReport,
  type CreateScheduledReportData,
} from "@/hooks/useScheduledReports";

const REPORT_TYPES = [
  { value: "ATTENDANCE", label: "Attendance" },
  { value: "OVERTIME", label: "Overtime" },
  { value: "LEAVE", label: "Leave" },
  { value: "PRODUCTIVITY", label: "Productivity" },
  { value: "COST", label: "Cost" },
] as const;

const FREQUENCIES = [
  { value: "DAILY", label: "Daily" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" },
] as const;

interface ScheduledReportFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report?: ScheduledReport | null;
}

export function ScheduledReportForm({
  open,
  onOpenChange,
  report,
}: ScheduledReportFormProps) {
  const [name, setName] = React.useState("");
  const [reportType, setReportType] = React.useState<CreateScheduledReportData["reportType"]>("ATTENDANCE");
  const [frequency, setFrequency] = React.useState<CreateScheduledReportData["frequency"]>("WEEKLY");
  const [recipients, setRecipients] = React.useState<string[]>([]);
  const [emailInput, setEmailInput] = React.useState("");
  const [filters, setFilters] = React.useState("");
  const [isActive, setIsActive] = React.useState(true);

  const createMutation = useCreateScheduledReport();
  const updateMutation = useUpdateScheduledReport();

  const isEditing = !!report;

  // Populate form when editing
  React.useEffect(() => {
    if (report) {
      setName(report.name);
      setReportType(report.reportType);
      setFrequency(report.frequency);
      setRecipients(report.recipients || []);
      setFilters(report.filters || "");
      setIsActive(report.isActive);
    } else {
      setName("");
      setReportType("ATTENDANCE");
      setFrequency("WEEKLY");
      setRecipients([]);
      setEmailInput("");
      setFilters("");
      setIsActive(true);
    }
  }, [report, open]);

  const addEmail = () => {
    const email = emailInput.trim().toLowerCase();
    if (!email) return;
    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    if (recipients.includes(email)) return;
    setRecipients([...recipients, email]);
    setEmailInput("");
  };

  const removeEmail = (emailToRemove: string) => {
    setRecipients(recipients.filter((e) => e !== emailToRemove));
  };

  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addEmail();
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    if (recipients.length === 0) return;

    const payload: CreateScheduledReportData = {
      name: name.trim(),
      reportType,
      frequency,
      recipients,
      filters: filters.trim() || undefined,
      isActive,
    };

    if (isEditing && report) {
      updateMutation.mutate(
        { id: report.id, data: payload },
        { onSuccess: () => onOpenChange(false) }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? "Edit Scheduled Report" : "Create Scheduled Report"}
      description={
        isEditing
          ? "Update the report schedule configuration"
          : "Set up a new automated report delivery schedule"
      }
    >
      <div className="space-y-4">
        {/* Name */}
        <div>
          <Label htmlFor="sr-name">Report Name</Label>
          <Input
            id="sr-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Weekly Attendance Summary"
            className="mt-1"
          />
        </div>

        {/* Report Type */}
        <div>
          <Label>Report Type</Label>
          <Select
            value={reportType}
            onValueChange={(val) =>
              setReportType(val as CreateScheduledReportData["reportType"])
            }
          >
            <SelectTrigger className="mt-1 w-full">
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              {REPORT_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Frequency */}
        <div>
          <Label>Frequency</Label>
          <Select
            value={frequency}
            onValueChange={(val) =>
              setFrequency(val as CreateScheduledReportData["frequency"])
            }
          >
            <SelectTrigger className="mt-1 w-full">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              {FREQUENCIES.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Recipients */}
        <div>
          <Label>Recipients</Label>
          <div className="mt-1 flex gap-2">
            <Input
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyDown={handleEmailKeyDown}
              placeholder="Enter email address"
              type="email"
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={addEmail}
              disabled={!emailInput.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {recipients.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {recipients.map((email) => (
                <Badge
                  key={email}
                  variant="secondary"
                  className="flex items-center gap-1 pl-2 pr-1 py-1"
                >
                  <span className="text-xs">{email}</span>
                  <button
                    type="button"
                    onClick={() => removeEmail(email)}
                    className="ml-0.5 rounded-full hover:bg-muted p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          {recipients.length === 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              Add at least one recipient email address
            </p>
          )}
        </div>

        {/* Filters (optional JSON) */}
        <div>
          <Label htmlFor="sr-filters">Filters (optional JSON)</Label>
          <Textarea
            id="sr-filters"
            value={filters}
            onChange={(e) => setFilters(e.target.value)}
            placeholder='e.g., {"departmentId": "abc123", "dateRange": "last7days"}'
            className="mt-1 font-mono text-xs"
            rows={3}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Optional: JSON string for filtering report data
          </p>
        </div>

        {/* Active Toggle */}
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div>
            <Label htmlFor="sr-active" className="font-medium">
              Active
            </Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enable or disable this report schedule
            </p>
          </div>
          <Switch
            id="sr-active"
            checked={isActive}
            onCheckedChange={setIsActive}
          />
        </div>
      </div>

      <div className="flex gap-2 pt-6 justify-end">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isPending || !name.trim() || recipients.length === 0}
        >
          {isPending
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
            ? "Update"
            : "Create"}
        </Button>
      </div>
    </ResponsiveDialog>
  );
}

export default ScheduledReportForm;
