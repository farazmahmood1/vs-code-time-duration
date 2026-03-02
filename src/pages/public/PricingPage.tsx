import React, { useState } from "react";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import ParticleBackground from "@/components/public/ParticleBackground";
import { usePublicPlans } from "@/hooks/useBilling";
import type { Plan } from "@/hooks/useSuperAdmin";

const fallbackPlans = [
  {
    name: "Free",
    slug: "free",
    price: "Free",
    desc: "For small teams getting started. Up to 5 users.",
    features: [
      "Time Tracking",
      "Attendance & Leave",
      "Team Chat & Calendar",
      "Community Support",
    ],
  },
  {
    name: "Pro",
    slug: "pro",
    price: "$8",
    desc: "For growing teams. Up to 50 users.",
    features: [
      "Everything in Free",
      "Projects & Timesheets",
      "Shifts & Overtime",
      "Desktop & Mobile App",
      "Reports & Analytics",
    ],
  },
  {
    name: "Business",
    slug: "business",
    price: "$16",
    popular: true,
    desc: "Full platform for scaling organizations. Up to 500 users.",
    features: [
      "Everything in Pro",
      "Reviews & Assets",
      "Advanced Analytics",
      "API Access & Integrations",
      "Wellness & Gamification",
      "Priority Support",
    ],
  },
  {
    name: "Enterprise",
    slug: "enterprise",
    price: "Custom",
    desc: "Custom solutions for large enterprises.",
    features: [
      "Everything in Business",
      "Unlimited Users",
      "Dedicated Support & SLA",
      "Custom Onboarding",
      "SSO & Security",
    ],
  },
];

const PricingPage: React.FC = () => {
  const { data: plans } = usePublicPlans();
  const [billingCycle, setBillingCycle] = useState<"MONTHLY" | "YEARLY">(
    "MONTHLY"
  );

  const sortedPlans = plans
    ? [...plans]
        .filter((p) => p.isActive && !p.isCustom)
        .sort((a, b) => a.sortOrder - b.sortOrder)
    : null;

  const customPlan = plans?.find((p) => p.isCustom);

  const renderApiPlans = (apiPlans: Plan[]) => {
    const allPlans = customPlan ? [...apiPlans, customPlan] : apiPlans;

    return allPlans.map((plan, i) => {
      const isPopular = plan.slug === "enterprise";
      const price =
        plan.isCustom || plan.price === 0
          ? plan.isCustom
            ? "Custom"
            : "Free"
          : billingCycle === "YEARLY" && plan.yearlyPrice > 0
            ? `$${Math.round(plan.yearlyPrice / 12)}`
            : `$${plan.price}`;

      const enabledFeatures = plan.features
        .filter((f) => f.enabled)
        .slice(0, 6)
        .map((f) => f.featureName);

      return (
        <div
          key={plan.id}
          className={`p-12 rounded-[3rem] border ${
            isPopular
              ? "bg-[#1e293b] text-white border-transparent shadow-[0_40px_80px_-20px_rgba(30,41,59,0.3)]"
              : "bg-white border-slate-100 text-[#1e293b]"
          } flex flex-col reveal`}
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          {isPopular && (
            <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-[#ef4444] text-white px-4 py-1.5 rounded-full self-start mb-6">
              Most Selected
            </span>
          )}
          <h3 className="text-2xl font-black uppercase tracking-widest mb-2">
            {plan.name}
          </h3>
          <p
            className={`text-sm mb-8 font-medium ${
              isPopular ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {plan.description || `Up to ${plan.maxUsers === -1 ? "unlimited" : plan.maxUsers} users.`}
          </p>
          <div className="mb-8">
            <span className="text-5xl font-black tracking-tighter">
              {price}
            </span>
            {price !== "Custom" && price !== "Free" && (
              <span className="text-sm font-bold uppercase tracking-widest ml-2 opacity-50">
                / seat
              </span>
            )}
          </div>
          <div className="space-y-4 mb-12 flex-grow">
            {enabledFeatures.map((f, fi) => (
              <div key={fi} className="flex items-center gap-3">
                <Check
                  size={16}
                  className={isPopular ? "text-green-400" : "text-blue-600"}
                />
                <span className="text-xs font-bold uppercase tracking-widest opacity-80">
                  {f}
                </span>
              </div>
            ))}
          </div>
          <Link
            to={plan.isCustom ? "/about" : `/register?plan=${plan.slug}`}
            className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all text-center ${
              isPopular
                ? "bg-white text-[#1e293b] hover:shadow-xl"
                : "bg-[#1e293b] text-white hover:opacity-90"
            }`}
          >
            {plan.isCustom ? "Contact Enterprise" : price === "Free" ? "Get Started" : "Start Deployment"}
          </Link>
        </div>
      );
    });
  };

  return (
    <div className="bg-white font-inter">
      {/* Header Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <ParticleBackground className="absolute inset-0 opacity-40 z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-block relative mb-6">
            <h1 className="text-5xl font-black text-[#1e293b] uppercase tracking-tighter relative z-10 reveal">
              Transparent Scale
            </h1>
          </div>
          <p
            className="text-xl text-slate-500 max-w-3xl mx-auto font-medium reveal mt-4"
            style={{ animationDelay: "0.1s" }}
          >
            Predictable pricing for global workforce governance.
          </p>

          {/* Billing Toggle */}
          {(
            <div className="flex items-center justify-center gap-4 mt-8 reveal" style={{ animationDelay: "0.2s" }}>
              <button
                onClick={() => setBillingCycle("MONTHLY")}
                className={`px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-widest transition-all ${
                  billingCycle === "MONTHLY"
                    ? "bg-[#1e293b] text-white"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("YEARLY")}
                className={`px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-widest transition-all ${
                  billingCycle === "YEARLY"
                    ? "bg-[#1e293b] text-white"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                Yearly
                <span className="ml-2 text-[10px] text-green-500 font-black">
                  SAVE 20%
                </span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Grid Section */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sortedPlans && sortedPlans.length > 0
              ? renderApiPlans(sortedPlans)
              : fallbackPlans.map((tier, i) => (
                  <div
                    key={i}
                    className={`p-12 rounded-[3rem] border ${
                      tier.popular
                        ? "bg-[#1e293b] text-white border-transparent shadow-[0_40px_80px_-20px_rgba(30,41,59,0.3)]"
                        : "bg-white border-slate-100 text-[#1e293b]"
                    } flex flex-col reveal`}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    {tier.popular && (
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-[#ef4444] text-white px-4 py-1.5 rounded-full self-start mb-6">
                        Most Selected
                      </span>
                    )}
                    <h3 className="text-2xl font-black uppercase tracking-widest mb-2">
                      {tier.name}
                    </h3>
                    <p
                      className={`text-sm mb-8 font-medium ${
                        tier.popular ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {tier.desc}
                    </p>
                    <div className="mb-8">
                      <span className="text-5xl font-black tracking-tighter">
                        {tier.price}
                      </span>
                      {tier.price !== "Custom" && tier.price !== "Free" && (
                        <span className="text-sm font-bold uppercase tracking-widest ml-2 opacity-50">
                          / user / mo
                        </span>
                      )}
                    </div>
                    <div className="space-y-4 mb-12 flex-grow">
                      {tier.features.map((f, fi) => (
                        <div key={fi} className="flex items-center gap-3">
                          <Check
                            size={16}
                            className={
                              tier.popular
                                ? "text-green-400"
                                : "text-blue-600"
                            }
                          />
                          <span className="text-xs font-bold uppercase tracking-widest opacity-80">
                            {f}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Link
                      to={tier.price === "Custom" ? "/about" : `/register?plan=${tier.slug}`}
                      className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all text-center ${
                        tier.popular
                          ? "bg-white text-[#1e293b] hover:shadow-xl"
                          : "bg-[#1e293b] text-white hover:opacity-90"
                      }`}
                    >
                      {tier.price === "Custom"
                        ? "Contact Sales"
                        : tier.price === "Free"
                          ? "Get Started"
                          : "Start Free Trial"}
                    </Link>
                  </div>
                ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
