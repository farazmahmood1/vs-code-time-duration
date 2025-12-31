import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminLeaveStats } from "@/hooks/useLeaveData";
import { Users, CheckCircle, Clock, XCircle } from "lucide-react";

export const LeaveStatsCards = () => {
  const { data: stats, isLoading } = useAdminLeaveStats();

  const cards = [
    {
      label: "On Leave",
      value: stats?.onLeave ?? 0,
      icon: Users,
    },
    {
      label: "Approved",
      value: stats?.approved ?? 0,
      icon: CheckCircle,
    },
    {
      label: "Pending",
      value: stats?.pending ?? 0,
      icon: Clock,
    },
    {
      label: "Rejected",
      value: stats?.rejected ?? 0,
      icon: XCircle,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.label}>
            <CardContent className="px-6">
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-10 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-5xl font-medium text-brand">
                      {card.value}
                    </p>
                    <p className="text-base font-medium text-muted-foreground">
                      {card.label}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full bg-blue-100 tex`}>
                    <Icon className={`h-5 w-5 text-blue-600`} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
