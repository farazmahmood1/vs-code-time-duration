import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, X, Loader2, ArrowRightLeft } from "lucide-react";
import {
  useSwapRequests,
  useRespondToSwapRequest,
} from "@/hooks/useShiftSwap";
import { format } from "date-fns";

export function SwapRequestsTable() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const { data, isLoading } = useSwapRequests({
    status: statusFilter || undefined,
  });
  const respondMutation = useRespondToSwapRequest();

  const requests = data?.data || [];

  const handleRespond = (id: string, status: "APPROVED" | "REJECTED") => {
    respondMutation.mutate({ id, status });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <ArrowRightLeft className="h-8 w-8 mx-auto mb-2 opacity-50" />
          No swap requests found
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Requester</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((req) => (
              <TableRow key={req.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={req.requester.image} />
                      <AvatarFallback>
                        {req.requester.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{req.requester.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={req.targetEmployee.image} />
                      <AvatarFallback>
                        {req.targetEmployee.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{req.targetEmployee.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm max-w-[200px] truncate">
                  {req.reason || "-"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      req.status === "APPROVED"
                        ? "default"
                        : req.status === "REJECTED"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {req.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {format(new Date(req.createdAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  {req.status === "PENDING" && (
                    <div className="flex justify-end gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-green-600 hover:text-green-700"
                        onClick={() => handleRespond(req.id, "APPROVED")}
                        disabled={respondMutation.isPending}
                      >
                        <Check className="h-3 w-3 mr-1" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-destructive hover:text-destructive"
                        onClick={() => handleRespond(req.id, "REJECTED")}
                        disabled={respondMutation.isPending}
                      >
                        <X className="h-3 w-3 mr-1" /> Reject
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
