import { SidebarProvider } from "@/components/ui/sidebar";
import { Suspense } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import Header from "./Header";
import { useSession } from "@/lib/auth-client";
import { useSocketConnection } from "@/hooks/useSocket";

const AppLayout = () => {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();

  // Initialize socket connection when authenticated
  useSocketConnection();

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
        <AppSidebar />
        <main className="w-full flex flex-col min-h-screen">
          <Header />
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

export default AppLayout;
