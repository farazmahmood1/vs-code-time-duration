
import React from 'react';
import { Terminal, Stethoscope, ShoppingBag, Truck } from 'lucide-react';
import ParticleBackground from '@/components/public/ParticleBackground';

const SolutionsPage: React.FC = () => {
    return (
        <div className="bg-white font-inter">
            <section className="py-24 bg-white relative overflow-hidden">
                <ParticleBackground className="absolute inset-0 opacity-40 z-0" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-block relative mb-6">
                        <h1 className="text-5xl font-black text-[#1e293b] uppercase tracking-tighter relative z-10 reveal">Vertical Solutions</h1>
                    </div>
                    <p className="text-xl text-slate-500 max-w-3xl mx-auto font-medium reveal mt-4" style={{ animationDelay: '0.1s' }}>
                        Enterprise software is not one-size-fits-all. Forrof Tracker adapts its core engine for specific industry demands.
                    </p>
                </div>
            </section>

            <section className="pb-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {[
                            {
                                id: 'tech',
                                icon: <Terminal className="w-10 h-10" />,
                                title: "Technology & Software",
                                desc: "Integrated with CI/CD pipelines to track engineering velocity versus development hours. Perfect for remote dev teams.",
                                points: ["Sub-second logging", "Native VS Code plugin", "GitHub integration"]
                            },
                            {
                                id: 'healthcare',
                                icon: <Stethoscope className="w-10 h-10" />,
                                title: "Healthcare Systems",
                                desc: "HIPAA-compliant data governance for large hospital networks. Manage shift transitions and fatigue monitoring.",
                                points: ["Compliance Vault", "Shift Handover AI", "Certification Tracking"]
                            },
                            {
                                id: 'retail',
                                icon: <ShoppingBag className="w-10 h-10" />,
                                title: "Global Retail",
                                desc: "Scalable for 100k+ users. Sync mobile check-ins with POS data for workforce optimization on the store floor.",
                                points: ["Geofenced check-ins", "Inventory sync", "Regional labor law automation"]
                            },
                            {
                                id: 'logistics',
                                icon: <Truck className="w-10 h-10" />,
                                title: "Logistics & Supply",
                                desc: "Monitor mobile workforces across regions. Forrof Tracker tracks movement and activity in low-connectivity environments.",
                                points: ["Offline sync", "Route optimization", "Fleet workforce management"]
                            }
                        ].map((s, i) => (
                            <div key={i} id={s.id} className="flex gap-8 p-12 bg-slate-50 rounded-[3rem] border border-slate-100 hover:bg-white hover:shadow-2xl transition-all reveal scroll-mt-24" style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className="w-20 h-20 bg-white shadow-xl rounded-[1.5rem] flex items-center justify-center text-[#1e293b] flex-shrink-0">
                                    {s.icon}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-[#1e293b] uppercase tracking-tight mb-4">{s.title}</h3>
                                    <p className="text-slate-500 font-medium mb-6 leading-relaxed">{s.desc}</p>
                                    <ul className="space-y-2">
                                        {s.points.map((p, pi) => (
                                            <li key={pi} className="text-xs font-black text-[#1e293b] uppercase tracking-widest flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444]"></div>
                                                {p}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SolutionsPage;
