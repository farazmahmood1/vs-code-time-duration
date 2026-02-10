
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useRole } from "./hooks/useRole";
import AppLayout from "./layout/app-layout";
import ProtectedRoute from "./layout/app-layout/ProtectedRoute";
import AuthLayout from "./layout/auth-layout";
import PublicLayout from "./layout/public-layout";
import { OnboardingGuard } from "./layout/OnboardingGuard";
import { PasswordChangeGuard } from "./layout/PasswordChangeGuard";

// Admin Page

import Announcements from "./pages/admin/announcements";
import Attendance from "./pages/admin/attendance";
import SessionDetails from "./pages/admin/attendance/SessionDetails";
import Dashboard from "./pages/admin/dashboard";
import DepartmentsPage from "./pages/admin/departments";
import Employees from "./pages/admin/employees";
import EmployeeDetail from "./pages/admin/employees/[id]";
import Leaves from "./pages/admin/leaves";
import ProjectsPage from "./pages/admin/projects";
import Settings from "./pages/admin/settings";
import ShiftsPage from "./pages/admin/shifts";
import OvertimePage from "./pages/admin/overtime";
import AdminTimesheets from "./pages/admin/timesheets";
import AdminReports from "./pages/admin/reports";
import AdminReviews from "./pages/admin/reviews";
import AdminAssets from "./pages/admin/assets";
import AdminStandups from "./pages/admin/standups";
import AdminFeedback from "./pages/admin/feedback";
import OrgChartPage from "./pages/admin/org-chart";
import AdminDocuments from "./pages/admin/documents";
import AdminCompensation from "./pages/admin/compensation";
import AdminExpenses from "./pages/admin/expenses";
import AdminOffboarding from "./pages/admin/offboarding";
import OffboardingDetail from "./pages/admin/offboarding/[id]";

// Auth Pages
import ForgotPassword from "./pages/auth/ForgotPassword";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifySuccess from "./pages/auth/Verify-success";

// Employee Pages
import EmployeeAnnouncements from "./pages/employee/announcements";
import EmployeeDashboard from "./pages/employee/dashboard";
import EmployeeAttendance from "./pages/employee/attendance";
import EmployeeLeaves from "./pages/employee/leaves";
import EmployeeTimesheets from "./pages/employee/timesheets";
import EmployeeFeedback from "./pages/employee/feedback";
import EmployeeShifts from "./pages/employee/shifts";
import AvailabilityPage from "./pages/employee/availability";
import EmployeeDocuments from "./pages/employee/documents";
import EmployeeCompensation from "./pages/employee/compensation";
import EmployeeExpenses from "./pages/employee/expenses";

// Shared Pages
import ChatPage from "./pages/chat";
import CalendarPage from "./pages/calendar";
import PomodoroPage from "./pages/pomodoro";
import MoodAnalyticsPage from "./pages/admin/mood";
import GamificationPage from "./pages/gamification";
import WellnessPage from "./pages/wellness";
import IntegrationsPage from "./pages/integrations";

// Public Pages
import Loading from "./pages/Loading";
import NotFound from "./pages/NotFound";
import OnboardingPage from "./pages/onboarding";
import Profile from "./pages/profile";
import HomePage from "./pages/public/HomePage";
import FeaturesPage from "./pages/public/FeaturesPage";
import PricingPage from "./pages/public/PricingPage";
import AboutUsPage from "./pages/public/AboutUsPage";
import SolutionsPage from "./pages/public/SolutionsPage";
import CareersPage from "./pages/public/CareersPage";
import SecurityPage from "./pages/public/SecurityPage";
import PrivacyPolicyPage from "./pages/public/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/public/TermsOfServicePage";
import CookiePolicyPage from "./pages/public/CookiePolicyPage";

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
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/solutions" element={<SolutionsPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/security" element={<SecurityPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsOfServicePage />} />
              <Route path="/cookies" element={<CookiePolicyPage />} />
            </Route>

            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Route>
            <Route path="/verify-success" element={<VerifySuccess />} />

            {/* Onboarding - Requires Auth but maybe not full Dashboard wrapper? Keeping as is but updating path if needed? 
                Usually onboarding is separate. Leaving at /onboarding for now. 
            */}
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <OnboardingPage />
                </ProtectedRoute>
              }
            />

            {/* Dashboard Routes (Protected) */}
            <Route
              path="/app"
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
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="pomodoro" element={<PomodoroPage />} />
              <Route path="leaderboard" element={<GamificationPage />} />
              <Route path="wellness" element={<WellnessPage />} />
              {isAdmin && (
                <>
                  <Route index element={<Dashboard />} />
                  <Route path="employees" element={<Employees />} />
                  <Route path="employees/:id" element={<EmployeeDetail />} />
                  <Route path="departments" element={<DepartmentsPage />} />
                  <Route path="attendance" element={<Attendance />} />
                  <Route path="attendance/:id" element={<SessionDetails />} />
                  <Route path="leaves" element={<Leaves />} />
                  <Route path="announcements" element={<Announcements />} />
                  <Route path="projects" element={<ProjectsPage />} />
                  <Route path="shifts" element={<ShiftsPage />} />
                  <Route path="overtime" element={<OvertimePage />} />
                  <Route path="timesheets" element={<AdminTimesheets />} />
                  <Route path="reports" element={<AdminReports />} />
                  <Route path="reviews" element={<AdminReviews />} />
                  <Route path="assets" element={<AdminAssets />} />
                  <Route path="standups" element={<AdminStandups />} />
                  <Route path="feedback" element={<AdminFeedback />} />
                  <Route path="mood-analytics" element={<MoodAnalyticsPage />} />
                  <Route path="org-chart" element={<OrgChartPage />} />
                  <Route path="documents" element={<AdminDocuments />} />
                  <Route path="compensation" element={<AdminCompensation />} />
                  <Route path="expenses" element={<AdminExpenses />} />
                  <Route path="offboarding" element={<AdminOffboarding />} />
                  <Route path="offboarding/:id" element={<OffboardingDetail />} />
                  <Route path="integrations" element={<IntegrationsPage />} />
                  {/* Settings is already above */}
                </>
              )}
              {isEmployee && (
                <>
                  <Route index element={<EmployeeDashboard />} />
                  <Route path="attendance" element={<EmployeeAttendance />} />
                  <Route path="timesheets" element={<EmployeeTimesheets />} />
                  <Route path="leaves" element={<EmployeeLeaves />} />
                  <Route
                    path="announcements"
                    element={<EmployeeAnnouncements />}
                  />
                  <Route path="feedback" element={<EmployeeFeedback />} />
                  <Route path="shifts" element={<EmployeeShifts />} />
                  <Route path="availability" element={<AvailabilityPage />} />
                  <Route path="documents" element={<EmployeeDocuments />} />
                  <Route path="compensation" element={<EmployeeCompensation />} />
                  <Route path="expenses" element={<EmployeeExpenses />} />
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
