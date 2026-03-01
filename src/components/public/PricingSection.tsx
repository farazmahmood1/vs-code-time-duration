import React, { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePublicPlans } from '@/hooks/useBilling';
import type { Plan } from '@/hooks/useSuperAdmin';

const fallbackPlans = [
    {
        name: 'Free',
        price: 0,
        yearlyPrice: 0,
        description: 'For small teams getting started',
        maxUsers: 5,
        isCustom: false,
        features: ['Time Tracking', 'Attendance', 'Leave Management', 'Chat', 'Calendar', 'Announcements'],
    },
    {
        name: 'Pro',
        price: 8,
        yearlyPrice: 78,
        popular: true,
        description: 'For growing teams that need more',
        maxUsers: 50,
        isCustom: false,
        features: ['Everything in Free', 'Projects & Tasks', 'Shifts & Overtime', 'Timesheets & Reports', 'Desktop & Mobile App', 'Standups & Documents'],
    },
    {
        name: 'Business',
        price: 16,
        yearlyPrice: 154,
        description: 'Full platform for scaling organizations',
        maxUsers: 500,
        isCustom: false,
        features: ['Everything in Pro', 'Reviews & Assets', 'Advanced Analytics', 'Integrations & API', 'Wellness & Gamification', 'Priority Support'],
    },
    {
        name: 'Enterprise',
        price: 0,
        yearlyPrice: 0,
        description: 'Custom solutions for large enterprises',
        maxUsers: -1,
        isCustom: true,
        features: ['Everything in Business', 'Unlimited Users', 'Dedicated Support', 'Custom Onboarding', 'SLA Guarantees', 'SSO & Security'],
    },
];

const PricingSection: React.FC = () => {
    const { data: apiPlans } = usePublicPlans();
    const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');

    const renderPlan = (plan: { name: string; price: number; yearlyPrice: number; description: string; maxUsers: number; isCustom: boolean; features: string[]; popular?: boolean }, index: number) => {
        const isPopular = plan.popular || plan.name === 'Pro';
        const displayPrice = plan.isCustom
            ? null
            : plan.price === 0
                ? 0
                : billingCycle === 'YEARLY' && plan.yearlyPrice > 0
                    ? Math.round(plan.yearlyPrice / 12)
                    : plan.price;

        return (
            <div
                key={index}
                className={`relative p-8 rounded-3xl border flex flex-col ${isPopular
                    ? 'bg-[#1e293b] text-white border-transparent shadow-[0_30px_60px_-15px_rgba(30,41,59,0.3)] scale-[1.02]'
                    : 'bg-white border-slate-200 text-[#1e293b] hover:shadow-lg'
                    } transition-all duration-300 reveal`}
                style={{ animationDelay: `${index * 0.1}s` }}
            >
                {isPopular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.25em] bg-[#ef4444] text-white px-4 py-1.5 rounded-full">
                        Most Popular
                    </span>
                )}

                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className={`text-sm mb-6 ${isPopular ? 'text-slate-400' : 'text-slate-500'}`}>
                    {plan.description}
                </p>

                <div className="mb-6">
                    {plan.isCustom ? (
                        <span className="text-4xl font-black tracking-tight">Custom</span>
                    ) : displayPrice === 0 ? (
                        <span className="text-4xl font-black tracking-tight">Free</span>
                    ) : (
                        <>
                            <span className="text-4xl font-black tracking-tight">${displayPrice}</span>
                            <span className={`text-sm font-medium ml-1 ${isPopular ? 'text-slate-400' : 'text-slate-500'}`}>
                                /user/mo
                            </span>
                        </>
                    )}
                    {!plan.isCustom && plan.maxUsers > 0 && (
                        <p className={`text-xs mt-1 ${isPopular ? 'text-slate-500' : 'text-slate-400'}`}>
                            Up to {plan.maxUsers} users
                        </p>
                    )}
                </div>

                <div className="space-y-3 mb-8 flex-grow">
                    {plan.features.map((feature, fi) => (
                        <div key={fi} className="flex items-start gap-2.5">
                            <Check
                                size={15}
                                className={`mt-0.5 shrink-0 ${isPopular ? 'text-green-400' : 'text-blue-600'}`}
                            />
                            <span className={`text-sm ${isPopular ? 'text-slate-300' : 'text-slate-600'}`}>
                                {feature}
                            </span>
                        </div>
                    ))}
                </div>

                <Link
                    to={plan.isCustom ? '/about' : '/register'}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all text-center flex items-center justify-center gap-2 ${isPopular
                        ? 'bg-white text-[#1e293b] hover:shadow-lg'
                        : 'bg-[#1e293b] text-white hover:opacity-90'
                        }`}
                >
                    {plan.isCustom ? 'Contact Sales' : plan.price === 0 ? 'Get Started Free' : 'Start Free Trial'}
                    <ArrowRight size={14} />
                </Link>
            </div>
        );
    };

    // Map API plans to display format
    const displayPlans = apiPlans && apiPlans.length > 0
        ? [...apiPlans]
            .sort((a: Plan, b: Plan) => a.sortOrder - b.sortOrder)
            .map((plan: Plan) => ({
                name: plan.name,
                price: plan.price,
                yearlyPrice: plan.yearlyPrice,
                description: plan.description || '',
                maxUsers: plan.maxUsers,
                isCustom: plan.isCustom,
                features: plan.features
                    .filter((f) => f.enabled)
                    .slice(0, 6)
                    .map((f) => f.featureName),
                popular: plan.slug === 'basic',
            }))
        : fallbackPlans;

    return (
        <section className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-[#1e293b] uppercase tracking-tight reveal">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto mt-4 font-medium reveal" style={{ animationDelay: '0.1s' }}>
                        Start free. Scale as you grow. No hidden fees.
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-3 mt-8 reveal" style={{ animationDelay: '0.15s' }}>
                        <button
                            onClick={() => setBillingCycle('MONTHLY')}
                            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${billingCycle === 'MONTHLY'
                                ? 'bg-[#1e293b] text-white'
                                : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle('YEARLY')}
                            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${billingCycle === 'YEARLY'
                                ? 'bg-[#1e293b] text-white'
                                : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
                                }`}
                        >
                            Yearly
                            <span className="ml-1.5 text-[10px] text-green-500 font-black">SAVE 20%</span>
                        </button>
                    </div>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayPlans.map((plan, i) => renderPlan(plan, i))}
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-12 reveal" style={{ animationDelay: '0.4s' }}>
                    <Link
                        to="/pricing"
                        className="text-sm font-bold text-[#1e293b] hover:text-blue-600 transition-colors inline-flex items-center gap-1"
                    >
                        Compare all features in detail
                        <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
