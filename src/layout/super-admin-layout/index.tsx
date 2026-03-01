import { SidebarProvider } from "@/components/ui/sidebar";
import { Suspense } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { SuperAdminSidebar } from "./SuperAdminSidebar";
import SuperAdminHeader from "./SuperAdminHeader";
import { useSession } from "@/lib/auth-client";

const SuperAdminLayout = () => {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();

  if (!session) {
    navigate("/login");
    return null;
  }

  if (isPending) {
    return <p className="text-md font-medium loading-text"></p>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <SuperAdminSidebar />
        <main className="w-full flex flex-col min-h-screen">
          <SuperAdminHeader />
          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            <Suspense
              fallback={<p className="text-md font-medium loading-text"></p>}
            >
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default SuperAdminLayout;
