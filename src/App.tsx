import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useRole } from "./hooks/useRole";
import AppLayout from "./layout/app-layout";
import ProtectedRoute from "./layout/app-layout/ProtectedRoute";
import AuthLayout from "./layout/auth-layout";
import { OnboardingGuard } from "./layout/OnboardingGuard";
import { PasswordChangeGuard } from "./layout/PasswordChangeGuard";
import Announcements from "./pages/admin/announcements";
import Attendance from "./pages/admin/attendance";
import Dashboard from "./pages/admin/dashboard";
import DepartmentsPage from "./pages/admin/departments";
import Employees from "./pages/admin/employees";
import EmployeeDetail from "./pages/admin/employees/[id]";
import Leaves from "./pages/admin/leaves";
import ProjectsPage from "./pages/admin/projects";
import Settings from "./pages/admin/settings";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifySuccess from "./pages/auth/Verify-success";
import EmployeeAnnouncements from "./pages/employee/announcements";
import EmployeeDashboard from "./pages/employee/dashboard";
import EmployeeLeaves from "./pages/employee/leaves";
import NotFound from "./pages/NotFound";
import OnboardingPage from "./pages/onboarding";
import Profile from "./pages/profile";
import Loading from "./pages/Loading";

const queryClient = new QueryClient();

const App = () => {
  const { isAdmin, isEmployee, isLoading } = useRole();

  // Show loading page while determining user role
  if (isLoading) {
    return <Loading />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Route>
            <Route path="/verify-success" element={<VerifySuccess />} />
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <OnboardingPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <PasswordChangeGuard>
                    {isEmployee ? (
                      <OnboardingGuard>
                        <AppLayout />
                      </OnboardingGuard>
                    ) : (
                      <AppLayout />
                    )}
                  </PasswordChangeGuard>
                </ProtectedRoute>
              }
            >
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              {isAdmin && (
                <>
                  <Route index element={<Dashboard />} />
                  <Route path="/employees" element={<Employees />} />
                  <Route path="/employees/:id" element={<EmployeeDetail />} />
                  <Route path="/departments" element={<DepartmentsPage />} />
                  <Route path="/attendance" element={<Attendance />} />
                  <Route path="/leaves" element={<Leaves />} />
                  <Route path="/announcements" element={<Announcements />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/settings" element={<Settings />} />
                </>
              )}
              {isEmployee && (
                <>
                  <Route index element={<EmployeeDashboard />} />
                  <Route path="/leaves" element={<EmployeeLeaves />} />
                  <Route
                    path="/announcements"
                    element={<EmployeeAnnouncements />}
                  />
                </>
              )}
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
