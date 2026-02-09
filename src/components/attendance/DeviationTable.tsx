import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ResponsiveDialog from "@/components/ResponsiveDialog";
import {
  useDeviations,
  useDeviationSummary,
  useExcuseDeviation,
} from "@/hooks/useDeviations";
import { AlertTriangle, ArrowDown, ArrowUp, Check } from "lucide-react";
import { format } from "date-fns";

const DeviationTable = () => {
  const [page] = useState(1);
  const { data: result, isLoading } = useDeviations({ page });
  const { data: summary } = useDeviationSummary();
  const excuseMutation = useExcuseDeviation();

  const [excuseDialogOpen, setExcuseDialogOpen] = useState(false);
  const [excusingId, setExcusingId] = useState<string | null>(null);
  const [excuseReason, setExcuseReason] = useState("");

  const handleExcuse = (id: string) => {
    setExcusingId(id);
    setExcuseReason("");
    setExcuseDialogOpen(true);
  };

  const handleSubmitExcuse = () => {
    if (excusingId) {
      excuseMutation.mutate(
        { id: excusingId, excuseReason },
        { onSuccess: () => setExcuseDialogOpen(false) }
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <ArrowDown className="h-4 w-4 text-red-500" />
                Late Arrivals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{summary.totalLate}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <ArrowUp className="h-4 w-4 text-orange-500" />
                Early Departures
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{summary.totalEarly}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Excused
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{summary.totalExcused}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading deviations...</p>
      ) : !result?.data || result.data.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            No attendance deviations recorded
          </p>
        </Card>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto w-full">
            <Table className="min-w-[900px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Late (min)</TableHead>
                  <TableHead>Early (min)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.data.map((dev) => (
                  <TableRow key={dev.id}>
                    <TableCell>
                      <p className="font-medium">{dev.user?.name || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground">
                        {dev.user?.email}
                      </p>
                    </TableCell>
                    <TableCell>
                      {format(new Date(dev.date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      {dev.lateMinutes > 0 ? (
                        <Badge variant="destructive">{dev.lateMinutes} min</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {dev.earlyMinutes > 0 ? (
                        <Badge variant="secondary">
                          {dev.earlyMinutes} min
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {dev.isExcused ? (
                        <Badge variant="outline" className="text-green-600 border-green-300">
                          Excused
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Unexcused
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {!dev.isExcused && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleExcuse(dev.id)}
                        >
                          Excuse
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Excuse Dialog */}
      <ResponsiveDialog
        open={excuseDialogOpen}
        onOpenChange={setExcuseDialogOpen}
        title="Excuse Deviation"
        description="Provide a reason for excusing this attendance deviation"
      >
        <div className="space-y-4">
          <div>
            <Label>Reason</Label>
            <Input
              value={excuseReason}
              onChange={(e) => setExcuseReason(e.target.value)}
              placeholder="e.g., Doctor appointment, traffic delay"
              className="mt-1"
            />
          </div>
        </div>
        <div className="flex gap-2 pt-6 justify-end">
          <Button variant="outline" onClick={() => setExcuseDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitExcuse}
            disabled={!excuseReason.trim() || excuseMutation.isPending}
          >
            {excuseMutation.isPending ? "Saving..." : "Excuse"}
          </Button>
        </div>
      </ResponsiveDialog>
    </div>
  );
};

export default DeviationTable;
