
import React from 'react';
import { Target } from 'lucide-react';
import ParticleBackground from '@/components/public/ParticleBackground';

const AboutUsPage: React.FC = () => {
    return (
        <div className="bg-white font-inter">
            {/* Header Section */}
            <section className="py-24 bg-white relative overflow-hidden">
                <ParticleBackground className="absolute inset-0 opacity-40 z-0" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-block relative mb-6">
                        <h1 className="text-5xl font-black text-[#1e293b] uppercase tracking-tighter relative z-10 reveal">
                            The Future of <br className="hidden md:block" /> Workforce Velocity.
                        </h1>
                    </div>
                    <p className="text-xl text-slate-500 max-w-3xl mx-auto font-medium reveal mt-4" style={{ animationDelay: '0.1s' }}>
                        Forrof Tracker was born from a simple thesis: The enterprise of 2025 cannot be managed with tools from 2010.
                        We build infrastructure for the global, remote, and highly-productive workforce.
                    </p>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-24 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divider-x">
                        {[
                            { val: "14 Regions", label: "Global Reach", sub: "Serving enterprises across every continent." },
                            { val: "25k+ Users", label: "Total Nodes", sub: "Active daily management in real-time." },
                            { val: "99.9% Uptime", label: "Infrastructure", sub: "Built on redundant master link nodes." }
                        ].map((s, i) => (
                            <div key={i} className="reveal relative" style={{ animationDelay: `${i * 0.1}s` }}>
                                <h2 className="text-5xl md:text-6xl font-black text-[#1e293b] tracking-tighter mb-4">{s.val}</h2>
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ef4444] mb-4">{s.label}</p>
                                <p className="text-slate-500 font-medium">{s.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="reveal">
                            <h2 className="text-4xl font-black text-[#1e293b] uppercase tracking-tighter mb-8">Our Mission</h2>
                            <p className="text-xl text-slate-600 font-medium leading-relaxed mb-8">
                                We believe that data-driven transparency is the ultimate foundation for employee trust.
                                By providing clear, sub-second visibility into time, projects, and goals, we empower both the
                                administrator and the contributor.
                            </p>
                            <p className="text-lg text-slate-500 leading-relaxed">
                                Headquartered in the North America East node, we are a globally distributed team of 200+ engineers
                                and HR specialists dedicated to the mission of Workforce Velocity.
                            </p>
                        </div>
                        <div className="reveal" style={{ animationDelay: '0.2s' }}>
                            <div className="aspect-video bg-[#1e293b] rounded-[2rem] overflow-hidden shadow-2xl relative">
                                <div className="absolute inset-0 bg-blue-500/10 animate-pulse"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-20 h-20 rounded-full border-2 border-white/20 flex items-center justify-center mx-auto mb-6 transition-transform hover:scale-110 cursor-pointer">
                                            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#1e293b]">
                                                <Target size={24} />
                                            </div>
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Watch Brand Film</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUsPage;
