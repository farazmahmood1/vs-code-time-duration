import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import type { OffboardingProcess } from "@/hooks/useOffboarding";
import { format } from "date-fns";
import { Loader2, UserMinus } from "lucide-react";
import { Link } from "react-router-dom";

const STATUS_CLASS: Record<string, string> = {
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

interface Props {
  records: OffboardingProcess[];
  isLoading?: boolean;
}

export default function OffboardingList({ records, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!records.length) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <UserMinus className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <p className="text-muted-foreground">
          No offboarding processes found.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {records.map((process) => (
        <Link
          key={process.id}
          to={`/app/offboarding/${process.id}`}
          className="block"
        >
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={process.employee.image} />
                    <AvatarFallback>
                      {process.employee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{process.employee.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {process.employee.email}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className={STATUS_CLASS[process.status]}>
                  {process.status.replace(/_/g, " ")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Last Working Day</span>
                <span className="font-medium">
                  {format(new Date(process.lastWorkingDate), "MMM dd, yyyy")}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">
                    {process.completedTasks}/{process.totalTasks} tasks
                  </span>
                </div>
                <Progress value={process.completionPercent} className="h-2" />
              </div>
              <p className="text-xs text-muted-foreground">
                Initiated{" "}
                {format(new Date(process.createdAt), "MMM dd, yyyy")}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
