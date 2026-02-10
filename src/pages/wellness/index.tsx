import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRole } from "@/hooks/useRole";
import {
  useActiveWellnessChallenges,
  useMyChallenges,
  useWellnessChallenges,
  useJoinChallenge,
  type WellnessChallenge,
} from "@/hooks/useWellness";
import { ChallengeCard } from "@/components/wellness/ChallengeCard";
import { CreateChallengeDialog } from "@/components/wellness/CreateChallengeDialog";
import { LogProgressDialog } from "@/components/wellness/LogProgressDialog";
import { ChallengeLeaderboard } from "@/components/wellness/ChallengeLeaderboard";

export default function WellnessPage() {
  const { isAdmin } = useRole();

  const { data: activeChallenges, isLoading: loadingActive } =
    useActiveWellnessChallenges();
  const { data: myChallenges, isLoading: loadingMy } = useMyChallenges();
  const { data: completedChallenges, isLoading: loadingCompleted } =
    useWellnessChallenges("completed");

  const joinChallenge = useJoinChallenge();

  const [createOpen, setCreateOpen] = useState(false);
  const [logProgressChallenge, setLogProgressChallenge] =
    useState<WellnessChallenge | null>(null);
  const [leaderboardChallengeId, setLeaderboardChallengeId] = useState("");
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);

  const myJoinedIds = new Set(myChallenges?.map((c) => c.id) || []);

  const getMyProgress = (challengeId: string) => {
    const found = myChallenges?.find((c) => c.id === challengeId);
    return found?.myProgress ?? 0;
  };

  const getMyCompleted = (challengeId: string) => {
    const found = myChallenges?.find((c) => c.id === challengeId);
    return !!found?.myCompletedAt;
  };

  const handleJoin = (id: string) => {
    joinChallenge.mutate(id);
  };

  const handleLogProgress = (challenge: WellnessChallenge) => {
    setLogProgressChallenge(challenge);
  };

  const handleViewLeaderboard = (id: string) => {
    setLeaderboardChallengeId(id);
    setLeaderboardOpen(true);
  };

  const renderChallengeGrid = (
    challenges: WellnessChallenge[] | undefined,
    isLoading: boolean,
    emptyMessage: string
  ) => {
    if (isLoading) {
      return (
        <p className="text-sm text-muted-foreground text-center py-12">
          Loading challenges...
        </p>
      );
    }

    if (!challenges || challenges.length === 0) {
      return (
        <p className="text-sm text-muted-foreground text-center py-12">
          {emptyMessage}
        </p>
      );
    }

    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {challenges.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            isJoined={myJoinedIds.has(challenge.id)}
            userProgress={getMyProgress(challenge.id)}
            userCompleted={getMyCompleted(challenge.id)}
            onJoin={handleJoin}
            onLogProgress={handleLogProgress}
            onViewLeaderboard={handleViewLeaderboard}
            isJoining={joinChallenge.isPending}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Wellness Challenges
          </h1>
          <p className="text-muted-foreground">
            Join challenges and track your wellness goals with your team.
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Challenge
          </Button>
        )}
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active Challenges</TabsTrigger>
          <TabsTrigger value="my">My Challenges</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          {renderChallengeGrid(
            activeChallenges,
            loadingActive,
            "No active challenges right now. Check back later!"
          )}
        </TabsContent>

        <TabsContent value="my" className="mt-6">
          {renderChallengeGrid(
            myChallenges,
            loadingMy,
            "You haven't joined any challenges yet. Browse active challenges to get started!"
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {renderChallengeGrid(
            completedChallenges,
            loadingCompleted,
            "No completed challenges yet."
          )}
        </TabsContent>
      </Tabs>

      {isAdmin && (
        <CreateChallengeDialog open={createOpen} onOpenChange={setCreateOpen} />
      )}

      <LogProgressDialog
        open={!!logProgressChallenge}
        onOpenChange={(open) => {
          if (!open) setLogProgressChallenge(null);
        }}
        challenge={logProgressChallenge}
        currentProgress={
          logProgressChallenge
            ? getMyProgress(logProgressChallenge.id)
            : 0
        }
      />

      <ChallengeLeaderboard
        open={leaderboardOpen}
        onOpenChange={setLeaderboardOpen}
        challengeId={leaderboardChallengeId}
      />
    </div>
  );
}
