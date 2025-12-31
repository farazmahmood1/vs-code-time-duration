import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface LeaveHeaderProps {
  onCreateClick: () => void;
}

export const LeaveHeader = ({ onCreateClick }: LeaveHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold">Leave Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage employee leave requests
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={onCreateClick}>
          <Plus className="h-4 w-4" />
          Apply Leave
        </Button>
      </div>
    </div>
  );
};
