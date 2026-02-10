import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  useOffboardingProcess,
  useCancelOffboarding,
} from "@/hooks/useOffboarding";
import OffboardingChecklist from "@/components/offboarding/OffboardingChecklist";
import { format } from "date-fns";
import { ArrowLeft, Loader2, XCircle } from "lucide-react";

const STATUS_CLASS: Record<string, string> = {
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function OffboardingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: process, isLoading } = useOffboardingProcess(id || "");
  const cancelMutation = useCancelOffboarding();

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!process) {
    return (
      <div className="text-center p-12">
        <p className="text-muted-foreground">Offboarding process not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/app/offboarding")}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Offboarding Details
          </h1>
        </div>
        {process.status === "IN_PROGRESS" && (
          <Button
            variant="destructive"
            size="sm"
            className="gap-1"
            onClick={() => cancelMutation.mutate(process.id)}
            disabled={cancelMutation.isPending}
          >
            <XCircle className="h-4 w-4" />
            Cancel Process
          </Button>
        )}
      </div>

      {/* Employee Info Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Employee Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={process.employee.image} />
              <AvatarFallback className="text-lg">
                {process.employee.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">
                {process.employee.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {process.employee.email}
              </p>
              {process.employee.department && (
                <p className="text-sm text-muted-foreground">
                  {process.employee.department.name}
                </p>
              )}
            </div>
            <div className="text-right space-y-1">
              <Badge
                variant="outline"
                className={STATUS_CLASS[process.status]}
              >
                {process.status.replace(/_/g, " ")}
              </Badge>
              <p className="text-sm text-muted-foreground">
                Last day:{" "}
                {format(
                  new Date(process.lastWorkingDate),
                  "MMM dd, yyyy"
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                Initiated by {process.initiator.name}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Overall Progress
              </span>
              <span className="font-medium">
                {process.completedTasks}/{process.totalTasks} tasks (
                {process.completionPercent}%)
              </span>
            </div>
            <Progress value={process.completionPercent} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Tasks Checklist */}
      <OffboardingChecklist
        processId={process.id}
        tasks={process.tasks}
      />
    </div>
  );
}
