
import React from 'react';
import { ArrowRight, Briefcase, Zap, Globe } from 'lucide-react';

const CareersPage: React.FC = () => {
    const jobs = [
        { title: "Senior Infrastructure Engineer", location: "Remote / North America", team: "Engineering" },
        { title: "Enterprise Product Designer", location: "New York / Hybrid", team: "Product" },
        { title: "Head of Workforce Strategy", location: "London / Hybrid", team: "Solutions" },
        { title: "DevOps Architect (Master Link)", location: "Remote", team: "Engineering" },
    ];

    return (
        <div className="bg-white font-inter">
            <section className="py-24 bg-slate-50 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl font-black text-[#1e293b] uppercase tracking-tighter mb-6 reveal">Join the Core.</h1>
                    <p className="text-xl text-slate-500 max-w-3xl mx-auto font-medium reveal" style={{ animationDelay: '0.1s' }}>
                        We are building the operating system for the global enterprise. Help us redefine how the world works.
                    </p>
                </div>
            </section>

            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
                        <div className="p-8 bg-white border border-slate-100 rounded-[2rem] reveal">
                            <Globe className="text-blue-600 mb-6" size={32} />
                            <h3 className="text-lg font-black uppercase tracking-widest text-[#1e293b] mb-2">Remote First</h3>
                            <p className="text-slate-500 text-sm">Work from anywhere in the world. We practice what we build.</p>
                        </div>
                        <div className="p-8 bg-white border border-slate-100 rounded-[2rem] reveal" style={{ animationDelay: '0.1s' }}>
                            <Zap className="text-yellow-500 mb-6" size={32} />
                            <h3 className="text-lg font-black uppercase tracking-widest text-[#1e293b] mb-2">Velocity Driven</h3>
                            <p className="text-slate-500 text-sm">We value speed, autonomy, and high-impact contributions.</p>
                        </div>
                        <div className="p-8 bg-white border border-slate-100 rounded-[2rem] reveal" style={{ animationDelay: '0.2s' }}>
                            <Briefcase className="text-[#ef4444] mb-6" size={32} />
                            <h3 className="text-lg font-black uppercase tracking-widest text-[#1e293b] mb-2">Top Tier Perks</h3>
                            <p className="text-slate-500 text-sm">Equity, unlimited PTO, and premium hardware for every team member.</p>
                        </div>
                    </div>

                    <h2 className="text-3xl font-black text-[#1e293b] uppercase tracking-tight mb-12 reveal">Open Positions</h2>
                    <div className="space-y-4">
                        {jobs.map((job, i) => (
                            <div key={i} className="group p-8 bg-white border border-slate-100 rounded-3xl flex flex-col md:flex-row justify-between items-center hover:shadow-xl transition-all reveal" style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className="text-center md:text-left mb-6 md:mb-0">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ef4444] mb-2">{job.team}</p>
                                    <h4 className="text-xl font-bold text-[#1e293b]">{job.title}</h4>
                                    <p className="text-slate-400 text-sm">{job.location}</p>
                                </div>
                                <button className="flex items-center gap-2 px-8 py-4 bg-[#1e293b] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] group-hover:bg-blue-600 transition-colors">
                                    Apply Now <ArrowRight size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CareersPage;
