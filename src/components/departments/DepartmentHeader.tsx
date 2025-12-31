import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface DepartmentHeaderProps {
  onCreateClick: () => void;
}

const DepartmentHeader = ({ onCreateClick }: DepartmentHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold">Departments</h1>
        <p className="text-muted-foreground mt-1">
          Manage your organization departments
        </p>
      </div>

      <Button onClick={onCreateClick} className="w-full sm:w-auto">
        <Plus className="mr-2 h-4 w-4" />
        Create Department
      </Button>
    </div>
  );
};

export default DepartmentHeader;
