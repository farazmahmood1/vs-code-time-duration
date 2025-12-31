import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ReportIssueForm } from "@/components/profile/ReportIssueForm";
import { UserSettingsForm } from "@/components/profile/UserSettingsForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "@/lib/auth-client";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Settings, Lock, AlertCircle } from "lucide-react";

const Profile = () => {
  const { data: session } = useSession();

  const deptId = session?.user
    ? ((session.user as unknown as Record<string, unknown>).departmentId as
        | string
        | undefined)
    : undefined;

  // Fetch all departments and create a lookup map (same approach as useEmployees)
  const { data: department = "Not Assigned" } = useQuery({
    queryKey: ["departments-for-profile"],
    queryFn: async () => {
      if (!deptId) {
        return "Not Assigned";
      }

      try {
        const response = await api.get("/departments?limit=1000");
        const departmentMap = new Map<string, string>();

        response.data.data?.forEach((dept: { id: string; name: string }) => {
          departmentMap.set(dept.id, dept.name);
        });

        return departmentMap.get(deptId) || "Not Assigned";
      } catch (error) {
        console.error("Failed to fetch departments", error);
        return "Not Assigned";
      }
    },
    enabled: !!deptId,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground">
          Manage your profile and account settings
        </p>
      </div>

      <ProfileHeader
        name={session?.user?.name || "Not Specified"}
        email={session?.user?.email || "Not Specified"}
        department={department}
        avatarUrl={session?.user?.image || undefined}
      />

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4 sm:hidden" />
            <span>Settings</span>
          </TabsTrigger>
          <TabsTrigger value="password" className="gap-2">
            <Lock className="h-4 w-4 sm:hidden" />
            <span>Password</span>
          </TabsTrigger>
          <TabsTrigger value="report" className="gap-2">
            <AlertCircle className="h-4 w-4 sm:hidden" />
            <span>Report</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="mt-6">
          <UserSettingsForm
            initialData={
              session?.user
                ? {
                    name: session.user.name,
                    email: session.user.email,
                    phone:
                      ((session.user as unknown as Record<string, unknown>)
                        .phone as string | null) || null,
                    department: department,
                    role:
                      ((session.user as unknown as Record<string, unknown>)
                        .role as string | null) || null,
                    salary:
                      ((session.user as unknown as Record<string, unknown>)
                        .salary as number | null) || null,
                    address:
                      ((session.user as unknown as Record<string, unknown>)
                        .address as string | null) || null,
                    githubUrl:
                      ((session.user as unknown as Record<string, unknown>)
                        .githubUrl as string | null) || null,
                    linkedinUrl:
                      ((session.user as unknown as Record<string, unknown>)
                        .linkedinUrl as string | null) || null,
                  }
                : undefined
            }
          />
        </TabsContent>

        <TabsContent value="password" className="mt-6">
          <ChangePasswordForm />
        </TabsContent>

        <TabsContent value="report" className="mt-6">
          <ReportIssueForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
