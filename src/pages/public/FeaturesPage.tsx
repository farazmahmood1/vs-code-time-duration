
import React from 'react';
import { Cpu, Shield, Globe, Layers, BarChart, Users } from 'lucide-react';
import ParticleBackground from '@/components/public/ParticleBackground';
import { Link } from 'react-router-dom';

const FeaturesPage: React.FC = () => {
    return (
        <div className="bg-white font-inter">
            {/* Page Header */}
            <section className="py-24 bg-white relative overflow-hidden">
                <ParticleBackground className="absolute inset-0 opacity-40 z-0" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-block relative mb-6">
                        <h1 className="text-5xl font-black text-[#1e293b] uppercase tracking-tighter relative z-10 reveal">Platform Intelligence</h1>
                    </div>
                    <p className="text-xl text-slate-500 max-w-3xl mx-auto font-medium reveal mt-4" style={{ animationDelay: '0.1s' }}>
                        A modular enterprise core designed for sub-second precision in workforce governance and global resource allocation.
                    </p>
                </div>
            </section>

            {/* Feature Deep Dive */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            {
                                id: 'tracking',
                                icon: <Cpu className="w-8 h-8" />,
                                title: "Workforce OS",
                                desc: "Our native kernel for Windows and macOS provides real-time telemetry on application usage and focus velocity."
                            },
                            {
                                id: 'security-core',
                                icon: <Shield className="w-8 h-8" />,
                                title: "Biometric Governance",
                                desc: "High-security identity verification integrated with time logs to prevent buddy-punching and ensure compliance."
                            },
                            {
                                id: 'payroll',
                                icon: <Globe className="w-8 h-8" />,
                                title: "Global Payroll Node",
                                desc: "Multi-currency, tax-compliant payroll engine that automates disbursements based on verified logged hours."
                            },
                            {
                                id: 'integrations',
                                icon: <Layers className="w-8 h-8" />,
                                title: "Modular Integration",
                                desc: "Direct APIs for Jira, Salesforce, and SAP to sync project milestones with employee effort in real-time."
                            },
                            {
                                id: 'analytics',
                                icon: <BarChart className="w-8 h-8" />,
                                title: "Predictive Analytics",
                                desc: "AI-driven forecasting for project burn rates and workforce requirements based on historical performance."
                            },
                            {
                                id: 'directory',
                                icon: <Users className="w-8 h-8" />,
                                title: "Enterprise Directory",
                                desc: "Universal search and organizational mapping for companies with 10,000+ employees across diverse regions."
                            }
                        ].map((f, i) => (
                            <div key={i} id={f.id} className="p-10 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all reveal scroll-mt-24" style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className="w-16 h-16 bg-[#1e293b] text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-slate-200">
                                    {f.icon}
                                </div>
                                <h3 className="text-xl font-black text-[#1e293b] uppercase tracking-widest mb-4">{f.title}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-[#1e293b] text-white overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-8">Ready to Scale your Infrastructure?</h2>
                    <Link
                        to="/login"
                        className="inline-block px-12 py-5 bg-white text-[#1e293b] font-black uppercase tracking-[0.2em] rounded-full hover:bg-slate-50 transition-colors shadow-2xl"
                    >
                        Book a Demo
                    </Link>
                </div>
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="grid grid-cols-12 h-full w-full">
                        {[...Array(48)].map((_, i) => <div key={i} className="border border-white/20 aspect-square"></div>)}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FeaturesPage;
