import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Leaderboard } from "@/components/gamification/Leaderboard";
import { BadgeGrid } from "@/components/gamification/BadgeGrid";
import { AwardPointsDialog } from "@/components/gamification/AwardPointsDialog";
import { useMyPoints } from "@/hooks/useGamification";
import { useRole } from "@/hooks/useRole";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { format } from "date-fns";
import { Loader2, Trophy, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const CATEGORY_COLORS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  ATTENDANCE: "default",
  PRODUCTIVITY: "secondary",
  RECOGNITION: "outline",
  TRAINING: "default",
  WELLNESS: "secondary",
};

function MyPointsTab() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyPoints(page);

  const points = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">My Points History</h3>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : points.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <Star className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">
            No points earned yet. Keep up the great work!
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {points.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(entry.earnedAt), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="font-medium">
                      {entry.reason}
                    </TableCell>
                    <TableCell>
                      <Badge variant={CATEGORY_COLORS[entry.category] || "default"}>
                        {entry.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium text-green-600">
                      +{entry.points}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {meta.page} of {meta.totalPages} ({meta.total} total)
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function GamificationPage() {
  const { isAdmin } = useRole();

  // Fetch employees for admin award dialog
  const { data: employeesData } = useQuery({
    queryKey: ["all-employees-for-gamification"],
    queryFn: async () => {
      const { data } = await authClient.admin.listUsers({
        query: { limit: 200, sortBy: "name", sortDirection: "asc" },
      });
      return (data?.users || []).map((u: { id: string; name: string }) => ({
        id: u.id,
        name: u.name,
      }));
    },
    enabled: isAdmin,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gamification</h1>
          <p className="text-muted-foreground">
            Earn points, climb the leaderboard, and collect badges.
          </p>
        </div>
        {isAdmin && (
          <AwardPointsDialog employees={employeesData || []} />
        )}
      </div>

      <Tabs defaultValue="leaderboard">
        <TabsList>
          <TabsTrigger value="leaderboard">
            <Trophy className="h-4 w-4 mr-1" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="my-points">
            <Star className="h-4 w-4 mr-1" />
            My Points
          </TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard" className="mt-4">
          <Leaderboard />
        </TabsContent>

        <TabsContent value="my-points" className="mt-4">
          <MyPointsTab />
        </TabsContent>

        <TabsContent value="badges" className="mt-4">
          <BadgeGrid />
        </TabsContent>
      </Tabs>
    </div>
  );
}
