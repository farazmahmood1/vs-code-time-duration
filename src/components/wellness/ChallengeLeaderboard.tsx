import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import ResponsiveDialog from "@/components/ResponsiveDialog";
import {
  useWellnessLeaderboard,
  useWellnessChallenge,
} from "@/hooks/useWellness";

interface ChallengeLeaderboardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  challengeId: string;
}

const rankColors: Record<number, string> = {
  1: "text-yellow-500",
  2: "text-gray-400",
  3: "text-amber-600",
};

export function ChallengeLeaderboard({
  open,
  onOpenChange,
  challengeId,
}: ChallengeLeaderboardProps) {
  const { data: leaderboard, isLoading } = useWellnessLeaderboard(
    open ? challengeId : ""
  );
  const { data: challenge } = useWellnessChallenge(open ? challengeId : "");

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Leaderboard"
      description={challenge?.title}
    >
      <div className="space-y-3 pt-4">
        {isLoading && (
          <p className="text-sm text-muted-foreground text-center py-8">
            Loading leaderboard...
          </p>
        )}
        {!isLoading && (!leaderboard || leaderboard.length === 0) && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No participants yet.
          </p>
        )}
        {leaderboard?.map((participant, index) => {
          const rank = index + 1;
          const progressPercent = challenge
            ? Math.min((participant.progress / challenge.goal) * 100, 100)
            : 0;

          return (
            <div
              key={participant.id}
              className="flex items-center gap-3 p-3 rounded-lg border"
            >
              <div
                className={`w-8 text-center font-bold text-lg ${
                  rankColors[rank] || "text-muted-foreground"
                }`}
              >
                {rank <= 3 ? (
                  <Trophy className="h-5 w-5 mx-auto" />
                ) : (
                  <span>{rank}</span>
                )}
              </div>

              <Avatar className="h-8 w-8">
                <AvatarImage src={participant.user.image || undefined} />
                <AvatarFallback className="text-xs">
                  {getInitials(participant.user.name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {participant.user.name}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {participant.progress}
                    {challenge ? ` / ${challenge.goal}` : ""}
                  </span>
                </div>
              </div>

              {participant.completedAt && (
                <Badge variant="default" className="shrink-0 text-xs">
                  Done
                </Badge>
              )}
            </div>
          );
        })}
      </div>
    </ResponsiveDialog>
  );
}
