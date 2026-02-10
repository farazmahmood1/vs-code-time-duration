import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { usePomodoroHistory } from "@/hooks/usePomodoro";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

export function PomodoroHistory() {
  const { data, isLoading } = usePomodoroHistory();
  const sessions = data?.data || [];

  if (isLoading)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );

  if (!sessions.length)
    return (
      <div className="text-center text-muted-foreground py-8">
        No sessions recorded yet. Start your first focus session!
      </div>
    );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Focus Duration</TableHead>
          <TableHead>Rounds</TableHead>
          <TableHead>Total Focus</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sessions.map((s) => (
          <TableRow key={s.id}>
            <TableCell>
              {format(new Date(s.createdAt), "MMM d, yyyy HH:mm")}
            </TableCell>
            <TableCell>{s.focusDuration} min</TableCell>
            <TableCell>
              {s.completedRounds}/{s.totalRounds}
            </TableCell>
            <TableCell>{s.totalFocusMinutes} min</TableCell>
            <TableCell>
              <Badge
                variant={s.status === "COMPLETED" ? "default" : "secondary"}
              >
                {s.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
