import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useLeaderboard } from "@/hooks/useGamification";
import { Crown, Medal, Award, Loader2, Trophy } from "lucide-react";
import { useState } from "react";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-600">
        <Crown className="h-4 w-4" />
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-500">
        <Medal className="h-4 w-4" />
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600">
        <Award className="h-4 w-4" />
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center w-8 h-8 text-sm font-medium text-muted-foreground">
      {rank}
    </div>
  );
}

export function Leaderboard() {
  const [period, setPeriod] = useState("month");
  const { data: entries, isLoading } = useLeaderboard(period);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Leaderboard</h3>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : !entries || entries.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">
            No leaderboard data yet. Start earning points!
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Rank</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead className="text-right">Points</TableHead>
                <TableHead className="text-right">Badges</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.userId}>
                  <TableCell>
                    <RankBadge rank={entry.rank} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        {entry.userImage ? (
                          <AvatarImage
                            src={entry.userImage}
                            alt={entry.userName}
                          />
                        ) : null}
                        <AvatarFallback>
                          {getInitials(entry.userName)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{entry.userName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary" className="font-mono">
                      {entry.totalPoints.toLocaleString()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm text-muted-foreground">
                      {entry.badgeCount}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
