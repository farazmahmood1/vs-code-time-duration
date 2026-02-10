import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { OffboardingTask } from "@/hooks/useOffboarding";
import { useToggleOffboardingTask } from "@/hooks/useOffboarding";
import { format } from "date-fns";
import { Edit2, Calendar, User } from "lucide-react";
import OffboardingTaskDialog from "./OffboardingTaskDialog";

const CATEGORY_LABELS: Record<string, string> = {
  IT_ACCESS: "IT Access",
  EQUIPMENT: "Equipment",
  KNOWLEDGE_TRANSFER: "Knowledge Transfer",
  EXIT_INTERVIEW: "Exit Interview",
  DOCUMENTATION: "Documentation",
  FINAL_PAY: "Final Pay",
};

const CATEGORY_ORDER = [
  "IT_ACCESS",
  "EQUIPMENT",
  "KNOWLEDGE_TRANSFER",
  "EXIT_INTERVIEW",
  "FINAL_PAY",
  "DOCUMENTATION",
];

interface Props {
  processId: string;
  tasks: OffboardingTask[];
}

export default function OffboardingChecklist({ processId, tasks }: Props) {
  const toggleMutation = useToggleOffboardingTask();
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    task?: OffboardingTask;
  }>({ open: false });

  // Group tasks by category
  const groupedTasks = CATEGORY_ORDER.reduce(
    (acc, category) => {
      const categoryTasks = tasks.filter((t) => t.category === category);
      if (categoryTasks.length > 0) {
        acc[category] = categoryTasks;
      }
      return acc;
    },
    {} as Record<string, OffboardingTask[]>
  );

  const getCategoryProgress = (categoryTasks: OffboardingTask[]) => {
    const completed = categoryTasks.filter(
      (t) => t.status === "COMPLETED"
    ).length;
    return `${completed}/${categoryTasks.length}`;
  };

  return (
    <>
      <Accordion
        type="multiple"
        defaultValue={CATEGORY_ORDER}
        className="space-y-2"
      >
        {Object.entries(groupedTasks).map(([category, categoryTasks]) => (
          <AccordionItem
            key={category}
            value={category}
            className="border rounded-lg px-4"
          >
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <span className="font-medium">
                  {CATEGORY_LABELS[category] || category}
                </span>
                <Badge variant="outline" className="text-xs">
                  {getCategoryProgress(categoryTasks)}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {categoryTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-start gap-3 p-3 rounded-md border ${
                      task.status === "COMPLETED"
                        ? "bg-green-50/50 border-green-200"
                        : "bg-background"
                    }`}
                  >
                    <Checkbox
                      checked={task.status === "COMPLETED"}
                      onCheckedChange={() =>
                        toggleMutation.mutate({
                          processId,
                          taskId: task.id,
                        })
                      }
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium ${
                          task.status === "COMPLETED"
                            ? "line-through text-muted-foreground"
                            : ""
                        }`}
                      >
                        {task.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        {task.assignee && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Avatar className="h-4 w-4">
                              <AvatarImage src={task.assignee.image} />
                              <AvatarFallback className="text-[8px]">
                                {task.assignee.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span>{task.assignee.name}</span>
                          </div>
                        )}
                        {!task.assignee && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>Unassigned</span>
                          </div>
                        )}
                        {task.dueDate && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {format(
                                new Date(task.dueDate),
                                "MMM dd, yyyy"
                              )}
                            </span>
                          </div>
                        )}
                        {task.completedAt && task.completer && (
                          <span className="text-xs text-green-600">
                            Completed by {task.completer.name}
                          </span>
                        )}
                      </div>
                      {task.notes && (
                        <p className="text-xs text-muted-foreground mt-1 italic">
                          {task.notes}
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 shrink-0"
                      onClick={() =>
                        setEditDialog({ open: true, task })
                      }
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <OffboardingTaskDialog
        open={editDialog.open}
        onOpenChange={(open) => setEditDialog((p) => ({ ...p, open }))}
        processId={processId}
        task={editDialog.task}
      />
    </>
  );
}
