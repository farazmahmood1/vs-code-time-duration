import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useMyFeedback, useSubmitFeedback } from "@/hooks/useFeedback";
import { format } from "date-fns";
import { Loader2, MessageCircle, Plus } from "lucide-react";
import { useState } from "react";

const CATEGORIES = ["SUGGESTION", "COMPLAINT", "APPRECIATION", "BUG_REPORT", "OTHER"];
const STATUS_COLORS: Record<string, "default" | "secondary" | "destructive" | "outline"> = { NEW: "secondary", REVIEWED: "default", IN_PROGRESS: "default", RESOLVED: "outline", CLOSED: "outline" };

export default function EmployeeFeedback() {
  const { data, isLoading } = useMyFeedback({});
  const submitMutation = useSubmitFeedback();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ category: "", title: "", message: "", isAnonymous: false });

  const handleSubmit = () => {
    submitMutation.mutate({ ...form }, { onSuccess: () => { setOpen(false); setForm({ category: "", title: "", message: "", isAnonymous: false }); } });
  };

  const records = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold tracking-tight">Feedback</h1><p className="text-muted-foreground">Share your suggestions, feedback, or report issues</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />Submit Feedback</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Submit Feedback</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Category</Label><Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger><SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c.replace(/_/g, " ")}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Title</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
              <div><Label>Message</Label><Textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={3} /></div>
              <div className="flex items-center gap-2"><Switch checked={form.isAnonymous} onCheckedChange={v => setForm(p => ({ ...p, isAnonymous: v }))} /><Label>Submit anonymously</Label></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={!form.category || !form.title || !form.message || submitMutation.isPending}>
                {submitMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (<div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>) : !records.length ? (
        <Card className="p-8 text-center"><MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-3" /><p className="text-muted-foreground">You haven't submitted any feedback yet.</p></Card>
      ) : (
        <div className="grid gap-4">{records.map(f => (
          <Card key={f.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{f.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{f.category}</Badge>
                  <Badge variant={STATUS_COLORS[f.status]}>{f.status}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>{f.message}</p>
              {f.adminReply && <div className="bg-muted p-3 rounded-md"><span className="font-medium">Admin Reply:</span> {f.adminReply}</div>}
              <p className="text-xs text-muted-foreground">{format(new Date(f.createdAt), "MMM dd, yyyy")}</p>
            </CardContent>
          </Card>
        ))}</div>
      )}
    </div>
  );
}
