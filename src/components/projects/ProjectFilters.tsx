import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DepartmentSelect from "../common/DepartmentSelect";
import { Search, List, LayoutGrid } from "lucide-react";

interface ProjectFiltersProps {
  onSearchChange: (query: string) => void;
  onDepartmentChange: (department: string) => void;
  onStatusChange: (status: string) => void;
  viewMode: "list" | "grid";
  onViewModeChange: (mode: "list" | "grid") => void;
}

export default function ProjectFilters({
  onSearchChange,
  onDepartmentChange,
  onStatusChange,
  viewMode,
  onViewModeChange,
}: ProjectFiltersProps) {
  return (
    <div className="flex flex-col sm:justify-between sm:flex-row mb-6 gap-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          className="pl-10"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex flex-col sm:flex-row max-sm:mt-2 gap-2 sm:ml-2">
        <div className="flex">
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

        <DepartmentSelect
          value=""
          onValueChange={onDepartmentChange}
          placeholder="Department"
          showAllOption={true}
          width="w-[180px]"
        />

        <Select onValueChange={onStatusChange} defaultValue="all">
          <SelectTrigger className="w-full sm:w-[180px] bg-primary text-primary-foreground!">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
