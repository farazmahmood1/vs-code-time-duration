import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUpcomingMilestones } from "@/hooks/useMilestones";
import { Cake, Trophy, Loader2, PartyPopper } from "lucide-react";
import { format } from "date-fns";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
}

export function UpcomingMilestones({ days = 30 }: { days?: number }) {
  const { data: milestones, isLoading } = useUpcomingMilestones(days);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PartyPopper className="h-5 w-5 text-primary" />
          Upcoming Milestones
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-6">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !milestones || milestones.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No upcoming milestones in the next {days} days.
          </p>
        ) : (
          <div className="space-y-3">
            {milestones.map((m, idx) => (
              <div
                key={`${m.userId}-${m.type}-${idx}`}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <Avatar className="h-10 w-10">
                  {m.userImage ? (
                    <AvatarImage src={m.userImage} alt={m.userName} />
                  ) : null}
                  <AvatarFallback>{getInitials(m.userName)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{m.userName}</p>
                  <p className="text-xs text-muted-foreground">{m.detail}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      m.type === "BIRTHDAY" ? "default" : "secondary"
                    }
                    className="flex items-center gap-1"
                  >
                    {m.type === "BIRTHDAY" ? (
                      <Cake className="h-3 w-3" />
                    ) : (
                      <Trophy className="h-3 w-3" />
                    )}
                    {m.type === "BIRTHDAY" ? "Birthday" : "Anniversary"}
                  </Badge>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-xs font-medium">
                    {format(new Date(m.eventDate), "MMM dd")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {m.daysUntil === 0
                      ? "Today!"
                      : m.daysUntil === 1
                        ? "Tomorrow"
                        : `${m.daysUntil} days`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
