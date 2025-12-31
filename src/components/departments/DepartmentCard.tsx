import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";

interface Department {
  id: string;
  name: string;
  description?: string;
  userCount?: number;
  createdAt: string;
  updatedAt: string;
}

interface DepartmentCardProps {
  department: Department;
  onEdit: (department: Department) => void;
  onDelete: (id: string) => void;
}

const DepartmentCard = ({
  department,
  onEdit,
  onDelete,
}: DepartmentCardProps) => {
  return (
    <Card className="p-5 hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{department.name}</h3>
            <p className="text-sm text-muted-foreground">
              {department.description || "No description"}
            </p>
            <p className="text-sm font-medium text-foreground mt-2">
              {department.userCount || 0}{" "}
              {department.userCount === 1 ? "person" : "people"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(department)}
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(department.id)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DepartmentCard;
