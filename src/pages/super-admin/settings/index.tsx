import { useSession } from "@/lib/auth-client";
import { authClient } from "@/lib/auth-client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, Mail, User, Key, Pencil, Check, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const SuperAdminSettings = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "SA";

  const startEditing = () => {
    setName(user?.name || "");
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setName("");
  };

  const saveName = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await authClient.updateUser({ name: name.trim() });
      toast.success("Name updated successfully");
      setEditing(false);
    } catch {
      toast.error("Failed to update name");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Super Admin profile and platform settings.
        </p>
      </div>

      {/* Profile Card */}
      <Card className="p-6 rounded-2xl border border-border/50 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.image || ""} />
            <AvatarFallback className="bg-indigo-600 text-white text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold">{user?.name}</h2>
            <Badge className="bg-indigo-600/10 text-indigo-600 border-0 mt-1">
              <Shield className="h-3 w-3 mr-1" />
              Super Admin
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
            <User className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Name</p>
              {editing ? (
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-8 text-sm"
                    autoFocus
                  />
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={saveName} disabled={saving || !name.trim()}>
                    <Check className="h-4 w-4 text-green-600" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={cancelEditing}>
                    <X className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={startEditing}>
                    <Pencil className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
            <Key className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">User ID</p>
              <p className="text-sm font-medium font-mono text-xs">{user?.id}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Platform Info */}
      <Card className="p-6 rounded-2xl border border-border/50 shadow-sm">
        <h3 className="font-semibold mb-4">Platform Information</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Platform</span>
            <span className="font-medium">Forrof Tracker</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Version</span>
            <span className="font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Environment</span>
            <Badge variant="outline">
              {import.meta.env.MODE}
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SuperAdminSettings;
