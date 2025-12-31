import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ProjectHeaderProps {
  onCreateClick: () => void;
}

export default function ProjectHeader({ onCreateClick }: ProjectHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="text-muted-foreground mt-1">
          Manage projects and track hours by department
        </p>
      </div>
      <Button onClick={onCreateClick} className="gap-2">
        <Plus className="h-4 w-4" />
        Create Project
      </Button>
    </div>
  );
}
