import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { leaveStatuses, leaveTypes } from "@/lib/validations/leave";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  LayoutGrid,
  List,
  Search,
} from "lucide-react";

interface LeaveFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  leaveType: string;
  onLeaveTypeChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  startDate?: Date;
  onStartDateChange: (date?: Date) => void;
  endDate?: Date;
  onEndDateChange: (date?: Date) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export const LeaveFilters = ({
  search,
  onSearchChange,
  leaveType,
  onLeaveTypeChange,
  status,
  onStatusChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  viewMode,
  onViewModeChange,
}: LeaveFiltersProps) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="w-full flex justify-between ">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by employee or ID..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <div className="hidden sm:flex border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => onViewModeChange("grid")}
              className="rounded-r-none"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => onViewModeChange("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Select value={leaveType} onValueChange={onLeaveTypeChange}>
            <SelectTrigger className="bg-primary text-primary-foreground">
              <SelectValue placeholder="Leave Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              {leaveTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger className="bg-primary text-primary-foreground">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              {leaveStatuses.map((stat) => (
                <SelectItem key={stat} value={stat}>
                  {stat.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="default" className="font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate && endDate ? (
                  <span>
                    {format(startDate, "dd MMM")} -{" "}
                    {format(endDate, "dd MMM, yyyy")}
                  </span>
                ) : (
                  <span>Date Range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={{ from: startDate, to: endDate }}
                onSelect={(range) => {
                  const { from, to } = range || {};
                  onStartDateChange(from || undefined);
                  onEndDateChange(to || undefined);
                }}
                numberOfMonths={2}
                className="rounded-md border"
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};
