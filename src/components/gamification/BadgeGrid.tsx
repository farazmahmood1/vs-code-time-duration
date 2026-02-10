import { Card, CardContent } from "@/components/ui/card";
import { useAllBadges, useMyBadges } from "@/hooks/useGamification";
import {
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  Coins,
  Flame,
  GraduationCap,
  Heart,
  Loader2,
  Medal,
  Shield,
  Star,
  Sunrise,
  Trophy,
  Users,
} from "lucide-react";
import { format } from "date-fns";

const ICON_MAP: Record<string, React.ElementType> = {
  sunrise: Sunrise,
  clock: Clock,
  flame: Flame,
  star: Star,
  trophy: Trophy,
  users: Users,
  award: Award,
  "book-open": BookOpen,
  "graduation-cap": GraduationCap,
  heart: Heart,
  medal: Medal,
  coins: Coins,
  shield: Shield,
};

function BadgeIcon({ icon, className }: { icon: string; className?: string }) {
  const IconComponent = ICON_MAP[icon] || Award;
  return <IconComponent className={className} />;
}

export function BadgeGrid() {
  const { data: allBadges, isLoading: loadingAll } = useAllBadges();
  const { data: myBadges, isLoading: loadingMy } = useMyBadges();

  const isLoading = loadingAll || loadingMy;

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!allBadges || allBadges.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <Award className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <p className="text-muted-foreground">No badges available yet.</p>
      </div>
    );
  }

  const earnedBadgeIds = new Set(myBadges?.map((b) => b.id) || []);
  const earnedBadgeMap = new Map(myBadges?.map((b) => [b.id, b]) || []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Badges</h3>
        <p className="text-sm text-muted-foreground">
          {earnedBadgeIds.size} / {allBadges.length} earned
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allBadges.map((badge) => {
          const isEarned = earnedBadgeIds.has(badge.id);
          const earnedBadge = earnedBadgeMap.get(badge.id);

          return (
            <Card
              key={badge.id}
              className={`relative transition-all ${
                isEarned
                  ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20"
                  : "opacity-60 grayscale"
              }`}
            >
              {isEarned && (
                <div className="absolute top-2 right-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              )}
              <CardContent className="flex flex-col items-center text-center pt-6 pb-4 px-4">
                <div
                  className={`flex items-center justify-center w-14 h-14 rounded-full mb-3 ${
                    isEarned
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <BadgeIcon icon={badge.icon} className="h-7 w-7" />
                </div>
                <h4 className="text-sm font-semibold mb-1">{badge.name}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {badge.description}
                </p>
                {isEarned && earnedBadge?.earnedAt && (
                  <p className="text-xs text-green-600 mt-2">
                    Earned {format(new Date(earnedBadge.earnedAt), "MMM dd, yyyy")}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
