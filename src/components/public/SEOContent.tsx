
import React from 'react';

const SEOContent: React.FC = () => {
    return (
        <section className="py-24 reveal font-inter">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-extrabold text-[#1e293b] mb-6 leading-tight">
                            Why Choose Forrof Tracker for Enterprise HR & Time Tracking?
                        </h2>
                        <p className="text-slate-600 mb-8 text-lg">
                            Forrof Tracker is more than an HRMS; it is a complete productivity ecosystem. By combining traditional HR
                            management with intelligent, automated time tracking, we give admins a holistic view of company performance.
                        </p>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-[#1e293b] mb-2">Automated Employee Productivity Monitoring</h3>
                                <p className="text-slate-500 text-sm">
                                    Track how much time is spent on productive tools versus distracting apps. Our high-end dashboard
                                    visualizes these metrics in real-time, allowing for better resource allocation.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#1e293b] mb-2">Scalable Time Tracking for Remote Teams</h3>
                                <p className="text-slate-500 text-sm">
                                    Our native desktop application for macOS and Windows ensures that every minute worked is captured
                                    precisely, with auto-pause functionality that respects non-working hours.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#1e293b] mb-2">Unified HR and Task Management</h3>
                                <p className="text-slate-500 text-sm">
                                    See which employees are working on which projects, and for how long. Integrate project analytics
                                    directly with leave balances and payroll for a seamless administrative experience.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="aspect-square bg-slate-100 rounded-[3rem] overflow-hidden border border-slate-200 shadow-inner">
                            <img
                                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800&h=800"
                                alt="Forrof-Tracker-HR-Attendance-Dashboard.png"
                                className="w-full h-full object-cover mix-blend-multiply opacity-80"
                            />
                        </div>
                        <div className="absolute -bottom-8 -left-8 bg-[#1e293b] text-white p-8 rounded-3xl shadow-2xl hidden md:block">
                            <p className="text-4xl font-bold mb-1">100%</p>
                            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Stable & Scalable Infrastructure</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SEOContent;
