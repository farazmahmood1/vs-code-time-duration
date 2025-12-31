import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LayoutGrid, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import DepartmentSelect from "@/components/common/DepartmentSelect";

interface AnnouncementFiltersProps {
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  departmentValue?: string;
  viewMode: "list" | "grid";
  onViewModeChange: (mode: "list" | "grid") => void;
}

const AnnouncementFilters = ({
  onSearchChange,
  onCategoryChange,
  onDepartmentChange,
  departmentValue = "",
  viewMode,
  onViewModeChange,
}: AnnouncementFiltersProps) => {
  return (
    <div className="flex flex-col sm:justify-between sm:flex-row mb-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search announcements..."
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

        <Select onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full sm:w-[180px] bg-primary text-primary-foreground!">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="holiday">Holiday</SelectItem>
            <SelectItem value="update">Update</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="birthday">Birthday</SelectItem>
            <SelectItem value="policy">Policy</SelectItem>
          </SelectContent>
        </Select>
        <div className="">
          <DepartmentSelect
            value={departmentValue}
            onValueChange={onDepartmentChange}
            placeholder="Department"
            showAllOption={true}
          />
        </div>
      </div>
    </div>
  );
};

export default AnnouncementFilters;
