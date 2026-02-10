import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAllStandups, useMissingStandups } from "@/hooks/useStandups";
import { format } from "date-fns";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";

export default function AdminStandups() {
  const [tab, setTab] = useState("today");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const { data, isLoading } = useAllStandups({ date });
  const { data: missing } = useMissingStandups();

  const standups = data?.data || [];

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold tracking-tight">Daily Standups</h1><p className="text-muted-foreground">Review daily standup reports from employees</p></div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="today">Today's Standups</TabsTrigger>
          <TabsTrigger value="missing">Missing {missing?.length ? `(${missing.length})` : ""}</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="mt-4 space-y-4">
          <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-auto" />
          {isLoading ? (<div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>) : !standups.length ? (
            <Card className="p-8 text-center text-muted-foreground">No standups submitted for {format(new Date(date + "T00:00:00"), "MMM dd, yyyy")}.</Card>
          ) : (
            <div className="grid gap-4">
              {standups.map(s => (
                <Card key={s.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{s.user?.name}</CardTitle>
                      <span className="text-xs text-muted-foreground">{format(new Date(s.date), "MMM dd, yyyy")}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div><span className="font-medium text-muted-foreground">Yesterday:</span> {s.yesterday}</div>
                    <div><span className="font-medium text-muted-foreground">Today:</span> {s.today}</div>
                    {s.blockers && <div><span className="font-medium text-red-600">Blockers:</span> {s.blockers}</div>}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="missing" className="mt-4">
          {!missing?.length ? (
            <Card className="p-8 text-center text-green-600">All employees have submitted their standups today!</Card>
          ) : (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-amber-500" />Missing Standups Today</CardTitle></CardHeader>
              <CardContent>
                <Table><TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Email</TableHead></TableRow></TableHeader>
                  <TableBody>{missing.map(u => (<TableRow key={u.id}><TableCell className="font-medium">{u.name}</TableCell><TableCell>{u.email}</TableCell></TableRow>))}</TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
