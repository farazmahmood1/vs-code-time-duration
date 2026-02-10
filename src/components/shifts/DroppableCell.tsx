import { useDroppable } from "@dnd-kit/core";
import type { ReactNode } from "react";

interface DroppableCellProps {
  id: string;
  children: ReactNode;
  onClick: () => void;
}

export function DroppableCell({ id, children, onClick }: DroppableCellProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <td
      ref={setNodeRef}
      className={`border p-1 align-top min-h-[60px] cursor-pointer transition-colors ${
        isOver ? "bg-primary/10" : "hover:bg-muted/50"
      }`}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("[data-draggable]")) return;
        onClick();
      }}
    >
      <div className="min-h-[50px] space-y-1">{children}</div>
    </td>
  );
}
