import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import {
  useGetOwnerOnboardingData,
  useCompleteOwnerOnboarding,
} from "@/hooks/useOwnerOnboarding";
import OwnerProfileTab from "./tabs/OwnerProfileTab";
import CompanyDetailsTab from "./tabs/CompanyDetailsTab";
import WorkSetupTab from "./tabs/WorkSetupTab";
import { Loader2, User, Building2, Clock, LogOut, Check, Lock } from "lucide-react";

interface OwnerOnboardingPageProps {
  onCompleted?: () => void;
}

export function OwnerOnboardingPage({ onCompleted }: OwnerOnboardingPageProps) {
  const navigate = useNavigate();
  const { isLoading } = useGetOwnerOnboardingData();
  const { mutate: completeOnboarding, isPending: isCompleting } =
    useCompleteOwnerOnboarding();
  const [activeTab, setActiveTab] = useState("profile");
  const [, setIsCurrentTabValid] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

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

  const handleBackToLogin = async () => {
    await authClient.signOut();
    navigate("/login", { replace: true });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-brand" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-brand" />
          <p className="text-lg font-semibold text-gray-900 mb-2">
            Setup complete!
          </p>
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "company", label: "Company", icon: Building2 },
    { id: "work-setup", label: "Work Setup", icon: Clock },
  ];

  const currentTabIndex = tabs.findIndex((t) => t.id === activeTab);
  const progressPercentage = ((currentTabIndex + 1) / tabs.length) * 100;

  const handleTabSaved = (tabId: string) => {
    setCompletedSteps((prev) => new Set(prev).add(tabId));
    // Auto-advance to next tab
    const tabIdx = tabs.findIndex((t) => t.id === tabId);
    if (tabIdx < tabs.length - 1) {
      setActiveTab(tabs[tabIdx + 1].id);
    }
  };

  const handleTabChange = (tabId: string) => {
    const targetIdx = tabs.findIndex((t) => t.id === tabId);
    // Allow going back, staying on current, or going to next only if current step is completed
    if (targetIdx <= currentTabIndex) {
      setActiveTab(tabId);
    } else if (targetIdx === currentTabIndex + 1 && completedSteps.has(activeTab)) {
      setActiveTab(tabId);
    }
    // Otherwise: do nothing (prevent skipping)
  };

  return (
    <div className="h-screen overflow-y-auto scroll-smooth pb-5 pt-10 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Welcome! Let's set up your workspace
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete these steps to personalize your company's workspace and get
            started with your team.
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
            onValueChange={handleTabChange}
            className="w-full"
          >
            <div className="border-b bg-brand/5">
              <TabsList className="grid w-full grid-cols-3 gap-1 bg-transparent h-auto px-2 py-1.5">
                {tabs.map((tab, idx) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  const isCompleted = completedSteps.has(tab.id);
                  const isLocked = idx > currentTabIndex && !completedSteps.has(tabs[idx - 1]?.id);
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      disabled={isLocked}
                      className={`flex items-center rounded-sm gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium transition-all ${
                        isActive
                          ? "text-brand"
                          : isLocked
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : isLocked ? (
                        <Lock className="w-3.5 h-3.5" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                      <span className="hidden sm:inline">{tab.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            <div className="p-4 md:p-8">
              <TabsContent value="profile" className="mt-0">
                <OwnerProfileTab onValidationChange={setIsCurrentTabValid} onSaved={() => handleTabSaved("profile")} />
              </TabsContent>

              <TabsContent value="company" className="mt-0">
                <CompanyDetailsTab onValidationChange={setIsCurrentTabValid} onSaved={() => handleTabSaved("company")} />
              </TabsContent>

              <TabsContent value="work-setup" className="mt-0">
                <WorkSetupTab onValidationChange={setIsCurrentTabValid} onSaved={() => handleTabSaved("work-setup")} />
              </TabsContent>
            </div>
          </Tabs>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between px-8 py-6 border-t bg-gray-50">
            <Button
              variant="outline"
              onClick={() => {
                const prevIdx = currentTabIndex - 1;
                if (prevIdx >= 0) {
                  setActiveTab(tabs[prevIdx].id);
                }
              }}
              disabled={activeTab === "profile"}
              className="font-medium"
            >
              &larr; Previous
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
              {activeTab !== "work-setup" ? (
                <Button
                  onClick={() => {
                    const nextIdx = currentTabIndex + 1;
                    if (nextIdx < tabs.length) {
                      setActiveTab(tabs[nextIdx].id);
                    }
                  }}
                  disabled={!completedSteps.has(activeTab)}
                >
                  Next &rarr;
                </Button>
              ) : (
                <Button
                  onClick={handleCompleteOnboarding}
                  disabled={isCompleting || !completedSteps.has("work-setup")}
                  className="bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 font-medium"
                >
                  {isCompleting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Completing...
                    </>
                  ) : (
                    "Complete Setup"
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-4 mt-4">
          <Button
            onClick={handleBackToLogin}
            className="font-medium flex-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-300"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
}

export default OwnerOnboardingPage;
