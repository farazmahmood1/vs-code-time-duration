
import React from 'react';
import { Shield, Lock, Eye, Server, Key, FileCheck } from 'lucide-react';
import ParticleBackground from '@/components/public/ParticleBackground';

const SecurityPage: React.FC = () => {
    return (
        <div className="bg-white font-inter">
            {/* Header Section */}
            <section className="py-24 bg-white relative overflow-hidden">
                <ParticleBackground className="absolute inset-0 opacity-40 z-0" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-block relative mb-6">
                        <h1 className="text-5xl font-black text-[#1e293b] uppercase tracking-tighter relative z-10 reveal">Enterprise Security</h1>
                    </div>
                    <p className="text-xl text-slate-500 max-w-3xl mx-auto font-medium reveal mt-4" style={{ animationDelay: '0.1s' }}>
                        Bank-grade encryption and zero-trust architecture at every node. Your workforce data is our fortress.
                    </p>
                </div>
            </section>

            {/* Grid Section */}
            <section className="pb-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: <Shield className="w-8 h-8" />,
                                title: "Zero Trust Core",
                                desc: "Every access request is fully authenticated, authorized, and encrypted before granting access."
                            },
                            {
                                icon: <Lock className="w-8 h-8" />,
                                title: "End-to-End Encryption",
                                desc: "Data is encrypted in transit and at rest using AES-256 and TLS 1.3 protocols."
                            },
                            {
                                icon: <Eye className="w-8 h-8" />,
                                title: "Audit Logging",
                                desc: "Immutable logs for all system activities, ensuring complete transparency and compliance."
                            },
                            {
                                icon: <Server className="w-8 h-8" />,
                                title: "Isolated Nodes",
                                desc: "Customer data is siloed in dedicated compute nodes to prevent cross-tenant leakage."
                            },
                            {
                                icon: <Key className="w-8 h-8" />,
                                title: "SSO & MFA",
                                desc: "Native integration with Okta, Azure AD, and Google Workspace with enforced multi-factor authentication."
                            },
                            {
                                icon: <FileCheck className="w-8 h-8" />,
                                title: "SOC 2 Type II",
                                desc: "We undergo annual third-party audits to verify our security controls and availability."
                            }
                        ].map((s, i) => (
                            <div key={i} className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-xl transition-all reveal" style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className="w-16 h-16 bg-[#1e293b] text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-slate-200">
                                    {s.icon}
                                </div>
                                <h3 className="text-xl font-black text-[#1e293b] uppercase tracking-widest mb-4">{s.title}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SecurityPage;
