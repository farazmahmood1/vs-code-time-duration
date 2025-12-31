import { Input } from "@/components/ui/input";
import { LayoutGrid, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DepartmentFiltersProps {
  onSearchChange: (value: string) => void;
  viewMode: "list" | "grid";
  onViewModeChange: (mode: "list" | "grid") => void;
}

const DepartmentFilters = ({
  onSearchChange,
  viewMode,
  onViewModeChange,
}: DepartmentFiltersProps) => {
  return (
    <div className="flex flex-col sm:justify-between sm:flex-row mb-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search departments..."
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
      </div>
    </div>
  );
};

export default DepartmentFilters;
