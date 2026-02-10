import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Heart,
  Droplets,
  Brain,
  Dumbbell,
  Target,
  Users,
  Trophy,
  Calendar,
} from "lucide-react";
import type { WellnessChallenge, WellnessChallengeType } from "@/hooks/useWellness";
import { format } from "date-fns";

const typeConfig: Record<
  WellnessChallengeType,
  { icon: React.ElementType; color: string; label: string }
> = {
  STEPS: { icon: Target, color: "bg-green-100 text-green-700", label: "Steps" },
  MINDFULNESS: { icon: Brain, color: "bg-purple-100 text-purple-700", label: "Mindfulness" },
  HYDRATION: { icon: Droplets, color: "bg-blue-100 text-blue-700", label: "Hydration" },
  EXERCISE: { icon: Dumbbell, color: "bg-orange-100 text-orange-700", label: "Exercise" },
  CUSTOM: { icon: Heart, color: "bg-pink-100 text-pink-700", label: "Custom" },
};

interface ChallengeCardProps {
  challenge: WellnessChallenge;
  isJoined: boolean;
  userProgress?: number;
  userCompleted?: boolean;
  onJoin: (id: string) => void;
  onLogProgress: (challenge: WellnessChallenge) => void;
  onViewLeaderboard: (id: string) => void;
  isJoining?: boolean;
}

export function ChallengeCard({
  challenge,
  isJoined,
  userProgress = 0,
  userCompleted = false,
  onJoin,
  onLogProgress,
  onViewLeaderboard,
  isJoining,
}: ChallengeCardProps) {
  const config = typeConfig[challenge.type] || typeConfig.CUSTOM;
  const Icon = config.icon;
  const progressPercent = Math.min((userProgress / challenge.goal) * 100, 100);
  const now = new Date();
  const endDate = new Date(challenge.endDate);
  const startDate = new Date(challenge.startDate);
  const isExpired = endDate < now;
  const hasStarted = startDate <= now;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`p-2 rounded-lg ${config.color}`}>
              <Icon className="h-4 w-4" />
            </div>
            <CardTitle className="text-base line-clamp-1">
              {challenge.title}
            </CardTitle>
          </div>
          <Badge
            variant={isExpired ? "secondary" : userCompleted ? "default" : "outline"}
            className="shrink-0"
          >
            {isExpired ? "Ended" : userCompleted ? "Completed" : config.label}
          </Badge>
        </div>
        {challenge.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {challenge.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {format(new Date(challenge.startDate), "MMM d")} -{" "}
              {format(new Date(challenge.endDate), "MMM d, yyyy")}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            <span>{challenge._count?.participants ?? 0}</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Goal: {challenge.goal} {challenge.unit}
            </span>
            {isJoined && (
              <span className="font-medium">
                {userProgress} / {challenge.goal} {challenge.unit}
              </span>
            )}
          </div>
          {isJoined && (
            <Progress value={progressPercent} className="h-2" />
          )}
        </div>

        <div className="flex items-center gap-2 mt-auto pt-2">
          {!isJoined && !isExpired && hasStarted && (
            <Button
              size="sm"
              onClick={() => onJoin(challenge.id)}
              disabled={isJoining}
              className="flex-1"
            >
              Join Challenge
            </Button>
          )}
          {!isJoined && !hasStarted && (
            <Button size="sm" variant="outline" disabled className="flex-1">
              Starts {format(startDate, "MMM d")}
            </Button>
          )}
          {isJoined && !isExpired && !userCompleted && (
            <Button
              size="sm"
              onClick={() => onLogProgress(challenge)}
              className="flex-1"
            >
              Log Progress
            </Button>
          )}
          {isJoined && userCompleted && (
            <div className="flex items-center gap-1 text-sm font-medium text-green-600">
              <Trophy className="h-4 w-4" />
              Goal Reached!
            </div>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewLeaderboard(challenge.id)}
          >
            <Trophy className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
