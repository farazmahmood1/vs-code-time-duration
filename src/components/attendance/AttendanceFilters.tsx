import { Calendar } from "@/components/ui/calendar";
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
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  LayoutGrid,
  List,
  Search,
} from "lucide-react";

interface AttendanceFiltersProps {
  date: Date;
  onDateChange: (date: Date | undefined) => void;
  department: string;
  onDepartmentChange: (department: string) => void;
  search: string;
  onSearchChange: (search: string) => void;
  showActiveOnly: boolean;
  onShowActiveOnlyChange: (show: boolean) => void;
  departments: string[];
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export const AttendanceFilters = ({
  date,
  onDateChange,
  department,
  onDepartmentChange,
  search,
  onSearchChange,
  showActiveOnly,
  onShowActiveOnlyChange,
  departments,
  viewMode,
  onViewModeChange,
}: AttendanceFiltersProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <div className="hidden sm:flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => onViewModeChange("grid")}
                className="rounded-r-none border-r-0"
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

            <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-input bg-primary">
              <Switch
                id="active-only"
                checked={showActiveOnly}
                onCheckedChange={onShowActiveOnlyChange}
              />
              <label
                htmlFor="active-only"
                className="text-sm font-medium text-primary-foreground cursor-pointer whitespace-nowrap"
              >
                Active Only
              </label>
            </div>
            <Select value={department} onValueChange={onDepartmentChange}>
              <SelectTrigger className="w-full md:w-[164px] bg-primary text-primary-foreground">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className={cn(
                    "w-full md:w-[200px] font-normal inline-flex text-sm",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={onDateChange}
                  initialFocus
                  disabled={(date) => date > new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
};
