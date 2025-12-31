import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { authClient } from "@/lib/auth-client";
import {
  useGetOnboardingData,
  useCompleteOnboarding,
} from "@/hooks/useOnboarding";
import AboutTab from "./tabs/AboutTab";
import PersonalTab from "./tabs/PersonalTab";
import ExperienceTab from "./tabs/ExperienceTab";
import SkillsTab from "./tabs/SkillsTab";
import EducationTab from "./tabs/EducationTab";
import {
  Loader2,
  User,
  Briefcase,
  Code,
  GraduationCap,
  LogOut,
  Home,
} from "lucide-react";

interface OnboardingPageProps {
  onCompleted?: () => void;
}

export function OnboardingPage({ onCompleted }: OnboardingPageProps) {
  const navigate = useNavigate();
  const { data: session } = useSession();
  const { data: onboardingData, isLoading } = useGetOnboardingData();
  const { mutate: completeOnboarding, isPending: isCompleting } =
    useCompleteOnboarding();
  const [activeTab, setActiveTab] = useState("personal");
  const [isCurrentTabValid, setIsCurrentTabValid] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const user = session?.user as Record<string, unknown>;
  const isProfileCompleted = (user?.isProfileCompleted as boolean) ?? false;

  const handleCompleteOnboarding = () => {
    completeOnboarding(undefined, {
      onSuccess: () => {
        setIsRedirecting(true);
        setTimeout(() => {
          onCompleted?.();
        }, 2000);
      },
    });
  };

  const handleGoToDashboard = () => {
    navigate("/");
  };

  const handleBackToLogin = async () => {
    await authClient.signOut();
    navigate("/login", { replace: true });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-brand" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-brand" />
          <p className="text-lg font-semibold text-gray-900 mb-2">
            Profile completed! 🎉
          </p>
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  // Tab configuration with icons
  const tabs = [
    { id: "personal", label: "Personal", icon: User },
    { id: "about", label: "About", icon: Briefcase },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "skills", label: "Skills", icon: Code },
    { id: "education", label: "Education", icon: GraduationCap },
  ];

  const currentTabIndex = tabs.findIndex((t) => t.id === activeTab);
  const progressPercentage = ((currentTabIndex + 1) / tabs.length) * 100;

  return (
    <div
      className="h-screen overflow-y-auto scroll-smooth 
    pb-5 pt-10 px-4 sm:px-6 lg:px-8 relative"
    >
      {/* bg-linear-to-br from-blue-50 via-white to-indigo-100  */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {isProfileCompleted ? "Update Your Profile" : "Welcome to Forrof"}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {isProfileCompleted
              ? "Keep your professional profile up to date. Make changes to your information whenever you need."
              : "Let's complete your professional profile. This helps us better connect you with opportunities and team members."}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-brand">
              Step {currentTabIndex + 1} of {tabs.length}
            </span>
            <span className="text-sm font-semibold text-brand">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-linear-to-r from-brand/60 to-brand/90 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            {/* Enhanced Tab List */}
            <div className="border-b bg-brand/5">
              <TabsList className="grid w-full grid-cols-5 gap-1 bg-transparent h-auto px-2 py-1.5">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className={`flex items-center rounded-sm gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium transition-all ${
                        isActive
                          ? "text-brand"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            {/* Tab Contents with padding */}
            <div className="p-4 md:p-8 ">
              <TabsContent value="personal" className="mt-0">
                <PersonalTab onValidationChange={setIsCurrentTabValid} />
              </TabsContent>

              <TabsContent value="about" className="mt-0">
                <AboutTab
                  data={onboardingData}
                  onValidationChange={setIsCurrentTabValid}
                />
              </TabsContent>

              <TabsContent value="experience" className="mt-0">
                <ExperienceTab
                  data={onboardingData}
                  onValidationChange={setIsCurrentTabValid}
                />
              </TabsContent>

              <TabsContent value="skills" className="mt-0">
                <SkillsTab
                  data={onboardingData}
                  onValidationChange={setIsCurrentTabValid}
                />
              </TabsContent>

              <TabsContent value="education" className="mt-0">
                <EducationTab
                  data={onboardingData}
                  onValidationChange={setIsCurrentTabValid}
                />
              </TabsContent>
            </div>
          </Tabs>

          {/* Enhanced Navigation Buttons - Inside Card */}
          {!isProfileCompleted && (
            <div className="flex items-center justify-between px-8 py-6 border-t bg-gray-50">
              <Button
                variant="outline"
                onClick={() => {
                  const prevIdx = currentTabIndex - 1;
                  if (prevIdx >= 0) {
                    setActiveTab(tabs[prevIdx].id);
                  }
                }}
                disabled={activeTab === "personal"}
                className="font-medium"
              >
                ← Previous
              </Button>

              <div className="text-center text-xs text-gray-500">
                {tabs.map((tab) => (
                  <span
                    key={tab.id}
                    className={`inline-block w-2 h-2 rounded-full mx-1 transition-colors ${
                      activeTab === tab.id ? "bg-brand" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                {activeTab !== "education" ? (
                  <Button
                    onClick={() => {
                      const nextIdx = currentTabIndex + 1;
                      if (nextIdx < tabs.length) {
                        setActiveTab(tabs[nextIdx].id);
                      }
                    }}
                    disabled={!isCurrentTabValid}
                  >
                    Next →
                  </Button>
                ) : (
                  <Button
                    onClick={handleCompleteOnboarding}
                    disabled={isCompleting}
                    className="bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 font-medium"
                  >
                    {isCompleting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Completing...
                      </>
                    ) : (
                      "✓ Complete Profile"
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between gap-4 mt-4">
          {!isProfileCompleted ? (
            <Button
              onClick={handleBackToLogin}
              className="font-medium flex-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          ) : (
            <Button
              className="font-medium flex-1"
              variant="outline"
              onClick={handleGoToDashboard}
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default OnboardingPage;
