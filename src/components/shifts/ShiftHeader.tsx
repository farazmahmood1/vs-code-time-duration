import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ShiftHeaderProps {
  onCreateClick: () => void;
}

const ShiftHeader = ({ onCreateClick }: ShiftHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold">Shifts</h1>
        <p className="text-muted-foreground mt-1">
          Manage work shifts and assign employees
        </p>
      </div>

      <Button onClick={onCreateClick} className="w-full sm:w-auto">
        <Plus className="mr-2 h-4 w-4" />
        Create Shift
      </Button>
    </div>
  );
};

export default ShiftHeader;
