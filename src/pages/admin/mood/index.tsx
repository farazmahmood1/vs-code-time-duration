import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamMoodOverview } from "@/components/mood/TeamMoodOverview";
import { useMoodAnalytics } from "@/hooks/useMood";
import { Loader2 } from "lucide-react";

const MOOD_EMOJIS = ["\u{1F622}", "\u{1F615}", "\u{1F610}", "\u{1F642}", "\u{1F604}"];

export default function MoodAnalyticsPage() {
  const { data: analytics, isLoading } = useMoodAnalytics();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mood Analytics</h1>
        <p className="text-muted-foreground">
          Track team sentiment and well-being trends.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TeamMoodOverview />
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Mood Distribution (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : analytics ? (
              <div className="space-y-3">
                {analytics.distribution.map((count, i) => {
                  const pct =
                    analytics.totalEntries > 0
                      ? Math.round((count / analytics.totalEntries) * 100)
                      : 0;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xl w-8">{MOOD_EMOJIS[i]}</span>
                      <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-12 text-right">
                        {pct}%
                      </span>
                    </div>
                  );
                })}
                <p className="text-xs text-muted-foreground text-center mt-2">
                  {analytics.totalEntries} total check-ins
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
