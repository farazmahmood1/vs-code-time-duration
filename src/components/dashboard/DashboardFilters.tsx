import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import DepartmentSelect from "../common/DepartmentSelect";
import ProjectSelect from "../common/ProjectSelect";

interface DashboardFiltersProps {
  department: string;
  project: string;
  startDate?: Date;
  endDate?: Date;
  onDepartmentChange: (value: string) => void;
  onProjectChange: (value: string) => void;
  onStartDateChange: (date?: Date) => void;
  onEndDateChange: (date?: Date) => void;
}

export const DashboardFilters = ({
  department,
  project,
  startDate,
  endDate,
  onDepartmentChange,
  onProjectChange,
  onStartDateChange,
  onEndDateChange,
}: DashboardFiltersProps) => {
  return (
    <div className="flex justify-end gap-2 flex-wrap">
      <div>
        <DepartmentSelect
          value={department === "all" ? "" : department}
          onValueChange={(val) => onDepartmentChange(val === "" ? "all" : val)}
          placeholder="Department"
          showAllOption={true}
        />
      </div>

      <ProjectSelect
        value={project === "all" ? "" : project}
        onValueChange={(val) => onProjectChange(val === "" ? "all" : val)}
        placeholder="Project"
        showAllOption={true}
      />

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="font-normal rounded-xl border-border/50 bg-card hover:bg-muted/60">
            <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            {startDate && endDate ? (
              <span>
                {format(startDate, "dd MMM")} -{" "}
                {format(endDate, "dd MMM, yyyy")}
              </span>
            ) : (
              <span className="text-muted-foreground">Date Range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 rounded-xl border-border/50 shadow-lg" align="end">
          <Calendar
            mode="range"
            selected={{ from: startDate, to: endDate }}
            onSelect={(range) => {
              const { from, to } = range || {};
              onStartDateChange(from || undefined);
              onEndDateChange(to || undefined);
            }}
            disabled={(date) => date > new Date()}
            numberOfMonths={2}
            className="rounded-xl"
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
