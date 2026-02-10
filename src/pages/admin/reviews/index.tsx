import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useReviewCycles, useCreateCycle, useActivateCycle, useCompleteCycle } from "@/hooks/useReviews";
import { format } from "date-fns";
import { Loader2, Plus, Play, CheckCircle } from "lucide-react";
import { useState } from "react";

const STATUS_COLORS: Record<string, "default" | "secondary" | "outline"> = { DRAFT: "secondary", ACTIVE: "default", COMPLETED: "outline" };

export default function AdminReviews() {
  const { data: cycles, isLoading } = useReviewCycles();
  const createCycle = useCreateCycle();
  const activateCycle = useActivateCycle();
  const completeCycle = useCompleteCycle();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(""); const [startDate, setStartDate] = useState(""); const [endDate, setEndDate] = useState("");

  const handleCreate = () => {
    createCycle.mutate({ name, startDate, endDate }, { onSuccess: () => { setOpen(false); setName(""); setStartDate(""); setEndDate(""); } });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold tracking-tight">Performance Reviews</h1><p className="text-muted-foreground">Manage review cycles and performance evaluations</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />New Cycle</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Review Cycle</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Name</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="Q1 2026 Review" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Start Date</Label><Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} /></div>
                <div><Label>End Date</Label><Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} /></div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={!name || !startDate || !endDate || createCycle.isPending}>
                {createCycle.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (<div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>) : !cycles?.length ? (
        <Card className="p-8 text-center text-muted-foreground">No review cycles yet. Create one to get started.</Card>
      ) : (
        <div className="rounded-md border"><Table>
          <TableHeader><TableRow><TableHead>Cycle</TableHead><TableHead>Period</TableHead><TableHead>Status</TableHead><TableHead>Reviews</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>{cycles.map(c => (
            <TableRow key={c.id}>
              <TableCell className="font-medium">{c.name}</TableCell>
              <TableCell>{format(new Date(c.startDate), "MMM dd")} – {format(new Date(c.endDate), "MMM dd, yyyy")}</TableCell>
              <TableCell><Badge variant={STATUS_COLORS[c.status]}>{c.status}</Badge></TableCell>
              <TableCell>{c.reviews.length} total, {c.reviews.filter(r => r.status === "SUBMITTED").length} submitted</TableCell>
              <TableCell className="text-right space-x-1">
                {c.status === "DRAFT" && <Button size="sm" variant="outline" onClick={() => activateCycle.mutate(c.id)} className="gap-1"><Play className="h-3 w-3" />Activate</Button>}
                {c.status === "ACTIVE" && <Button size="sm" variant="outline" onClick={() => completeCycle.mutate(c.id)} className="gap-1"><CheckCircle className="h-3 w-3" />Complete</Button>}
              </TableCell>
            </TableRow>
          ))}</TableBody>
        </Table></div>
      )}
    </div>
  );
}
