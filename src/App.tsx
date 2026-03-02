
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useRole } from "./hooks/useRole";
import AppLayout from "./layout/app-layout";
import ProtectedRoute from "./layout/app-layout/ProtectedRoute";
import AuthLayout from "./layout/auth-layout";
import PublicLayout from "./layout/public-layout";
import SuperAdminLayout from "./layout/super-admin-layout";
import { OnboardingGuard } from "./layout/OnboardingGuard";
import { OwnerOnboardingGuard } from "./layout/OwnerOnboardingGuard";
import { PasswordChangeGuard } from "./layout/PasswordChangeGuard";
import { CompanySetupGuard } from "./layout/CompanySetupGuard";
import { ErrorBoundary } from "./components/ErrorBoundary";

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

// Super Admin Pages
import SuperAdminDashboard from "./pages/super-admin/dashboard";
import SuperAdminCompanies from "./pages/super-admin/companies";
import CompanyDetail from "./pages/super-admin/companies/CompanyDetail";
import SuperAdminPlans from "./pages/super-admin/plans";
import SuperAdminSubscriptions from "./pages/super-admin/subscriptions";
import SuperAdminAuditLogs from "./pages/super-admin/audit-logs";
import SuperAdminSettings from "./pages/super-admin/settings";

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
import CompanySetupPage from "./pages/setup";
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
  const { isAdmin, isEmployee, isSuperAdmin, isLoading } = useRole();

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

            {/* Company Setup - Requires Auth but no layout */}
            <Route
              path="/setup"
              element={
                <ProtectedRoute>
                  <CompanySetupPage />
                </ProtectedRoute>
              }
            />

            {/* Dashboard Routes (Protected) */}
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  {isSuperAdmin ? (
                    <Navigate to="/super-admin" replace />
                  ) : (
                    <PasswordChangeGuard>
                      <CompanySetupGuard>
                        <OnboardingGuard>
                          <OwnerOnboardingGuard>
                            <AppLayout />
                          </OwnerOnboardingGuard>
                        </OnboardingGuard>
                      </CompanySetupGuard>
                    </PasswordChangeGuard>
                  )}
                </ProtectedRoute>
              }
            >
              <Route path="profile" element={<ErrorBoundary><Profile /></ErrorBoundary>} />
              <Route path="settings" element={<ErrorBoundary><Settings /></ErrorBoundary>} />
              <Route path="chat" element={<ErrorBoundary><ChatPage /></ErrorBoundary>} />
              <Route path="calendar" element={<ErrorBoundary><CalendarPage /></ErrorBoundary>} />
              <Route path="pomodoro" element={<ErrorBoundary><PomodoroPage /></ErrorBoundary>} />
              <Route path="leaderboard" element={<ErrorBoundary><GamificationPage /></ErrorBoundary>} />
              <Route path="wellness" element={<ErrorBoundary><WellnessPage /></ErrorBoundary>} />
              {isAdmin && (
                <>
                  <Route index element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
                  <Route path="employees" element={<ErrorBoundary><Employees /></ErrorBoundary>} />
                  <Route path="employees/:id" element={<ErrorBoundary><EmployeeDetail /></ErrorBoundary>} />
                  <Route path="departments" element={<ErrorBoundary><DepartmentsPage /></ErrorBoundary>} />
                  <Route path="attendance" element={<ErrorBoundary><Attendance /></ErrorBoundary>} />
                  <Route path="attendance/:id" element={<ErrorBoundary><SessionDetails /></ErrorBoundary>} />
                  <Route path="leaves" element={<ErrorBoundary><Leaves /></ErrorBoundary>} />
                  <Route path="announcements" element={<ErrorBoundary><Announcements /></ErrorBoundary>} />
                  <Route path="projects" element={<ErrorBoundary><ProjectsPage /></ErrorBoundary>} />
                  <Route path="shifts" element={<ErrorBoundary><ShiftsPage /></ErrorBoundary>} />
                  <Route path="overtime" element={<ErrorBoundary><OvertimePage /></ErrorBoundary>} />
                  <Route path="timesheets" element={<ErrorBoundary><AdminTimesheets /></ErrorBoundary>} />
                  <Route path="reports" element={<ErrorBoundary><AdminReports /></ErrorBoundary>} />
                  <Route path="reviews" element={<ErrorBoundary><AdminReviews /></ErrorBoundary>} />
                  <Route path="assets" element={<ErrorBoundary><AdminAssets /></ErrorBoundary>} />
                  <Route path="standups" element={<ErrorBoundary><AdminStandups /></ErrorBoundary>} />
                  <Route path="feedback" element={<ErrorBoundary><AdminFeedback /></ErrorBoundary>} />
                  <Route path="mood-analytics" element={<ErrorBoundary><MoodAnalyticsPage /></ErrorBoundary>} />
                  <Route path="org-chart" element={<ErrorBoundary><OrgChartPage /></ErrorBoundary>} />
                  <Route path="documents" element={<ErrorBoundary><AdminDocuments /></ErrorBoundary>} />
                  <Route path="compensation" element={<ErrorBoundary><AdminCompensation /></ErrorBoundary>} />
                  <Route path="expenses" element={<ErrorBoundary><AdminExpenses /></ErrorBoundary>} />
                  <Route path="offboarding" element={<ErrorBoundary><AdminOffboarding /></ErrorBoundary>} />
                  <Route path="offboarding/:id" element={<ErrorBoundary><OffboardingDetail /></ErrorBoundary>} />
                  <Route path="integrations" element={<ErrorBoundary><IntegrationsPage /></ErrorBoundary>} />
                </>
              )}
              {isEmployee && (
                <>
                  <Route index element={<ErrorBoundary><EmployeeDashboard /></ErrorBoundary>} />
                  <Route path="attendance" element={<ErrorBoundary><EmployeeAttendance /></ErrorBoundary>} />
                  <Route path="timesheets" element={<ErrorBoundary><EmployeeTimesheets /></ErrorBoundary>} />
                  <Route path="leaves" element={<ErrorBoundary><EmployeeLeaves /></ErrorBoundary>} />
                  <Route
                    path="announcements"
                    element={<ErrorBoundary><EmployeeAnnouncements /></ErrorBoundary>}
                  />
                  <Route path="feedback" element={<ErrorBoundary><EmployeeFeedback /></ErrorBoundary>} />
                  <Route path="shifts" element={<ErrorBoundary><EmployeeShifts /></ErrorBoundary>} />
                  <Route path="availability" element={<ErrorBoundary><AvailabilityPage /></ErrorBoundary>} />
                  <Route path="documents" element={<ErrorBoundary><EmployeeDocuments /></ErrorBoundary>} />
                  <Route path="compensation" element={<ErrorBoundary><EmployeeCompensation /></ErrorBoundary>} />
                  <Route path="expenses" element={<ErrorBoundary><EmployeeExpenses /></ErrorBoundary>} />
                </>
              )}
            </Route>

            {/* Super Admin Routes */}
            {isSuperAdmin && (
              <Route
                path="/super-admin"
                element={
                  <ProtectedRoute>
                    <SuperAdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<ErrorBoundary><SuperAdminDashboard /></ErrorBoundary>} />
                <Route path="companies" element={<ErrorBoundary><SuperAdminCompanies /></ErrorBoundary>} />
                <Route path="companies/:id" element={<ErrorBoundary><CompanyDetail /></ErrorBoundary>} />
                <Route path="plans" element={<ErrorBoundary><SuperAdminPlans /></ErrorBoundary>} />
                <Route path="subscriptions" element={<ErrorBoundary><SuperAdminSubscriptions /></ErrorBoundary>} />
                <Route path="audit-logs" element={<ErrorBoundary><SuperAdminAuditLogs /></ErrorBoundary>} />
                <Route path="settings" element={<ErrorBoundary><SuperAdminSettings /></ErrorBoundary>} />
              </Route>
            )}

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
