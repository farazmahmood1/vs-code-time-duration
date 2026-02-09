import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAssets, useAssetSummary, useCreateAsset, useDeleteAsset, useReturnAsset } from "@/hooks/useAssets";
import { Loader2, Package, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";

const ASSET_TYPES = ["LAPTOP", "MONITOR", "KEYBOARD", "MOUSE", "HEADSET", "PHONE", "TABLET", "FURNITURE", "SOFTWARE_LICENSE", "OTHER"];
const CONDITION_COLORS: Record<string, string> = { NEW: "text-green-600", GOOD: "text-blue-600", FAIR: "text-yellow-600", POOR: "text-orange-600", DAMAGED: "text-red-600", RETIRED: "text-gray-500" };

export default function AdminAssets() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAssets({ page });
  const { data: summary } = useAssetSummary();
  const createAsset = useCreateAsset();
  const deleteAsset = useDeleteAsset();
  const returnAsset = useReturnAsset();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", type: "", serialNumber: "", condition: "NEW" });

  const handleCreate = () => {
    createAsset.mutate({ name: form.name, type: form.type as any, serialNumber: form.serialNumber || undefined, condition: form.condition as any }, {
      onSuccess: () => { setOpen(false); setForm({ name: "", type: "", serialNumber: "", condition: "NEW" }); }
    });
  };

  const assets = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold tracking-tight">Asset Tracking</h1><p className="text-muted-foreground">Manage company assets and assignments</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />Add Asset</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Asset</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Name</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="MacBook Pro 16" /></div>
              <div><Label>Type</Label><Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))}><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger><SelectContent>{ASSET_TYPES.map(t => <SelectItem key={t} value={t}>{t.replace(/_/g, " ")}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Serial Number</Label><Input value={form.serialNumber} onChange={e => setForm(p => ({ ...p, serialNumber: e.target.value }))} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={!form.name || !form.type || createAsset.isPending}>{createAsset.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Add</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary */}
      {summary && (
        <div className="grid grid-cols-3 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{summary.total}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Available</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">{summary.available}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Assigned</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-blue-600">{summary.assigned}</div></CardContent></Card>
        </div>
      )}

      {isLoading ? (<div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>) : !assets.length ? (
        <Card className="p-8 text-center"><Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" /><p className="text-muted-foreground">No assets found.</p></Card>
      ) : (
        <div className="rounded-md border"><Table>
          <TableHeader><TableRow><TableHead>Asset</TableHead><TableHead>Type</TableHead><TableHead>Serial</TableHead><TableHead>Condition</TableHead><TableHead>Status</TableHead><TableHead>Assigned To</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>{assets.map(a => (
            <TableRow key={a.id}>
              <TableCell className="font-medium">{a.name}</TableCell>
              <TableCell><Badge variant="outline">{a.type.replace(/_/g, " ")}</Badge></TableCell>
              <TableCell className="text-sm text-muted-foreground">{a.serialNumber || "—"}</TableCell>
              <TableCell><span className={CONDITION_COLORS[a.condition] || ""}>{a.condition}</span></TableCell>
              <TableCell>{a.isAvailable ? <Badge variant="default">Available</Badge> : <Badge variant="secondary">Assigned</Badge>}</TableCell>
              <TableCell>{a.assignments?.[0]?.user?.name || "—"}</TableCell>
              <TableCell className="text-right space-x-1">
                {!a.isAvailable && <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => returnAsset.mutate(a.id)}><RotateCcw className="h-3.5 w-3.5" /></Button>}
                <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => deleteAsset.mutate(a.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </TableCell>
            </TableRow>
          ))}</TableBody>
        </Table></div>
      )}
    </div>
  );
}
