import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTeamMoods } from "@/hooks/useMood";
import { Loader2 } from "lucide-react";

const MOOD_EMOJIS = ["", "\u{1F622}", "\u{1F615}", "\u{1F610}", "\u{1F642}", "\u{1F604}"];

export function TeamMoodOverview() {
  const { data, isLoading } = useTeamMoods();

  if (isLoading)
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Team Mood Today</CardTitle>
        {data && (
          <span className="text-2xl">
            {MOOD_EMOJIS[Math.round(data.avgMood)] || "\u{1F610}"} {data.avgMood}
            /5
          </span>
        )}
      </CardHeader>
      <CardContent>
        {!data?.entries.length ? (
          <p className="text-sm text-muted-foreground text-center py-2">
            No check-ins yet today
          </p>
        ) : (
          <div className="space-y-2">
            {data.entries.slice(0, 8).map((entry) => (
              <div key={entry.id} className="flex items-center gap-3">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={entry.user?.image || ""} />
                  <AvatarFallback className="text-xs">
                    {entry.user?.name
                      ?.split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm flex-1 truncate">
                  {entry.user?.name}
                </span>
                <span className="text-lg">{MOOD_EMOJIS[entry.mood]}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
