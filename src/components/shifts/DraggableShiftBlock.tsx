import { useDraggable } from "@dnd-kit/core";
import { AlertTriangle, Trash2 } from "lucide-react";
import type { ScheduleEntry } from "@/hooks/useShiftSchedule";
import { useDeleteScheduleEntry } from "@/hooks/useShiftSchedule";

interface DraggableShiftBlockProps {
  entry: ScheduleEntry;
  hasConflict: boolean;
}

export function DraggableShiftBlock({
  entry,
  hasConflict,
}: DraggableShiftBlockProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: entry.id,
  });
  const deleteMutation = useDeleteScheduleEntry();

  return (
    <div
      ref={setNodeRef}
      data-draggable
      {...listeners}
      {...attributes}
      className={`group relative rounded px-2 py-1 text-xs cursor-grab active:cursor-grabbing transition-all ${
        hasConflict
          ? "bg-destructive/20 border border-destructive"
          : "bg-primary/15 border border-primary/30"
      } ${isDragging ? "opacity-50" : ""}`}
    >
      <div className="font-medium truncate">{entry.shift.name}</div>
      <div className="text-muted-foreground">
        {entry.startTime}-{entry.endTime}
      </div>
      {hasConflict && (
        <AlertTriangle className="h-3 w-3 text-destructive absolute top-1 right-1" />
      )}
      <button
        className="absolute top-0.5 right-0.5 hidden group-hover:block p-0.5 rounded hover:bg-destructive/20"
        onClick={(e) => {
          e.stopPropagation();
          deleteMutation.mutate(entry.id);
        }}
      >
        <Trash2 className="h-3 w-3 text-destructive" />
      </button>
    </div>
  );
}
