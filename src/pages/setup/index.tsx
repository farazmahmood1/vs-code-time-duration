import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, authClient } from "@/lib/auth-client";
import { usePublicPlans, useSetupCompany } from "@/hooks/useBilling";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Loader2, LogOut, Building2 } from "lucide-react";
import { toast } from "sonner";
import type { Plan } from "@/hooks/useSuperAdmin";

export default function CompanySetupPage() {
  const navigate = useNavigate();
  const { data: session } = useSession();
  const { data: plans, isLoading: plansLoading } = usePublicPlans();
  const setupCompany = useSetupCompany();

  const [companyName, setCompanyName] = useState("");
  const [domain, setDomain] = useState("");
  const [billingCycle, setBillingCycle] = useState<"MONTHLY" | "YEARLY">(
    "MONTHLY"
  );
  const [selectedPlanSlug, setSelectedPlanSlug] = useState<string>(() => {
    return localStorage.getItem("forrof_selected_plan") || "free";
  });

  // If user already has a company, redirect to app
  useEffect(() => {
    const user = session?.user as Record<string, unknown>;
    if (user?.companyId) {
      navigate("/app", { replace: true });
    }
  }, [session, navigate]);

  const selectablePlans = plans
    ?.filter((p: Plan) => p.isActive && !p.isCustom)
    .sort((a: Plan, b: Plan) => a.sortOrder - b.sortOrder) || [];

  const selectedPlan = selectablePlans.find(
    (p: Plan) => p.slug === selectedPlanSlug
  );
  const isFree = selectedPlan ? selectedPlan.price === 0 : true;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyName.trim()) {
      toast.error("Company name is required");
      return;
    }

    setupCompany.mutate(
      {
        companyName: companyName.trim(),
        domain: domain.trim() || undefined,
        planSlug: selectedPlanSlug,
        billingCycle,
      },
      {
        onSuccess: async (data) => {
          localStorage.removeItem("forrof_selected_plan");

          if (data.checkoutUrl) {
            window.location.href = data.checkoutUrl;
          } else {
            toast.success("Company created successfully!");
            // Force-refresh the session so guards see the updated companyId
            await authClient.getSession({ fetchOptions: { cache: "no-store" } });
            navigate("/app", { replace: true });
          }
        },
      }
    );
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    navigate("/login", { replace: true });
  };

  const getDisplayPrice = (plan: Plan) => {
    if (plan.price === 0) return "Free";
    if (billingCycle === "YEARLY" && plan.yearlyPrice > 0) {
      return `$${Math.round(plan.yearlyPrice / 12)}/seat/mo`;
    }
    return `$${plan.price}/seat/mo`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="flex justify-end mb-4">
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-indigo-600/10 rounded-full flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6 text-indigo-600" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Set Up Your Company
            </CardTitle>
            <CardDescription>
              Welcome, {session?.user?.name}! Let's get your workspace ready.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Acme Inc."
                  required
                />
              </div>

              {/* Domain */}
              <div className="space-y-2">
                <Label htmlFor="domain">Company Domain (optional)</Label>
                <Input
                  id="domain"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="acme.com"
                />
              </div>

              {/* Plan Selection */}
              <div className="space-y-3">
                <Label>Select Plan</Label>

                {/* Billing toggle */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setBillingCycle("MONTHLY")}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                      billingCycle === "MONTHLY"
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle("YEARLY")}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                      billingCycle === "YEARLY"
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    Yearly
                    <span className="ml-1 text-xs text-green-500 font-bold">
                      Save 20%
                    </span>
                  </button>
                </div>

                {/* Plan cards */}
                {plansLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {selectablePlans.map((plan: Plan) => (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => setSelectedPlanSlug(plan.slug)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          selectedPlanSlug === plan.slug
                            ? "border-indigo-600 bg-indigo-600/5"
                            : "border-border hover:border-slate-300 dark:hover:border-slate-600"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-sm">{plan.name}</span>
                          {selectedPlanSlug === plan.slug && (
                            <Check className="w-4 h-4 text-indigo-600" />
                          )}
                        </div>
                        <div className="text-lg font-black">
                          {getDisplayPrice(plan)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Up to{" "}
                          {plan.maxUsers === -1 ? "unlimited" : plan.maxUsers}{" "}
                          users
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                size="lg"
                disabled={setupCompany.isPending || !companyName.trim()}
              >
                {setupCompany.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Setting up...
                  </>
                ) : isFree ? (
                  "Start Free"
                ) : (
                  "Continue to Payment"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
