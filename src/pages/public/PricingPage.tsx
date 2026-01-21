
import React from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import ParticleBackground from '@/components/public/ParticleBackground';

const PricingPage: React.FC = () => {
    return (
        <div className="bg-white font-inter">
            {/* Header Section */}
            <section className="py-24 bg-white relative overflow-hidden">
                <ParticleBackground className="absolute inset-0 opacity-40 z-0" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-block relative mb-6">
                        <h1 className="text-5xl font-black text-[#1e293b] uppercase tracking-tighter relative z-10 reveal">Transparent Scale</h1>
                    </div>
                    <p className="text-xl text-slate-500 max-w-3xl mx-auto font-medium reveal mt-4" style={{ animationDelay: '0.1s' }}>
                        Predictable pricing for global workforce governance.
                    </p>
                </div>
            </section>

            {/* Grid Section */}
            <section className="pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Standard",
                                price: "$12",
                                desc: "For growing teams up to 500 users.",
                                features: ["Real-time dashboard", "Basic time tracking", "Desktop app v1", "Email support"]
                            },
                            {
                                name: "Enterprise Pro",
                                price: "$29",
                                popular: true,
                                desc: "The standard for mid-market scale.",
                                features: ["Advanced analytics", "Biometric verification", "Global payroll node", "Jira & Salesforce sync", "24/7 Priority support"]
                            },
                            {
                                name: "Global Master",
                                price: "Custom",
                                desc: "For companies with 5,000+ users.",
                                features: ["Full API access", "Dedicated node deployment", "SLA guarantees", "Custom security vault", "Dedicated account manager"]
                            }
                        ].map((tier, i) => (
                            <div key={i} className={`p-12 rounded-[3rem] border ${tier.popular ? 'bg-[#1e293b] text-white border-transparent shadow-[0_40px_80px_-20px_rgba(30,41,59,0.3)]' : 'bg-white border-slate-100 text-[#1e293b]'} flex flex-col reveal`} style={{ animationDelay: `${i * 0.1}s` }}>
                                {tier.popular && <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-[#ef4444] text-white px-4 py-1.5 rounded-full self-start mb-6">Most Selected</span>}
                                <h3 className="text-2xl font-black uppercase tracking-widest mb-2">{tier.name}</h3>
                                <p className={`text-sm mb-8 font-medium ${tier.popular ? 'text-slate-400' : 'text-slate-500'}`}>{tier.desc}</p>
                                <div className="mb-8">
                                    <span className="text-5xl font-black tracking-tighter">{tier.price}</span>
                                    {tier.price !== "Custom" && <span className="text-sm font-bold uppercase tracking-widest ml-2 opacity-50">/ seat</span>}
                                </div>
                                <div className="space-y-4 mb-12 flex-grow">
                                    {tier.features.map((f, fi) => (
                                        <div key={fi} className="flex items-center gap-3">
                                            <Check size={16} className={tier.popular ? 'text-green-400' : 'text-blue-600'} />
                                            <span className="text-xs font-bold uppercase tracking-widest opacity-80">{f}</span>
                                        </div>
                                    ))}
                                </div>
                                <Link
                                    to="/login"
                                    className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all text-center ${tier.popular ? 'bg-white text-[#1e293b] hover:shadow-xl' : 'bg-[#1e293b] text-white hover:opacity-90'}`}
                                >
                                    {tier.price === "Custom" ? "Contact Enterprise" : "Start Deployment"}
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
