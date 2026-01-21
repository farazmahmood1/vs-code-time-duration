
import React from 'react';

const CookiePolicyPage: React.FC = () => {
    return (
        <div className="bg-white font-inter">
            <section className="py-24 bg-slate-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-5xl font-black text-[#1e293b] uppercase tracking-tighter mb-12 reveal">Cookie Policy</h1>
                    <div className="prose prose-slate max-w-none text-slate-600 space-y-8 reveal" style={{ animationDelay: '0.1s' }}>
                        <p className="text-lg font-medium text-slate-900">Effective Date: October 24, 2024</p>

                        <section>
                            <h2 className="text-2xl font-black text-[#1e293b] uppercase tracking-tight mb-4">Essential Cookies</h2>
                            <p>These are required for the fundamental operation of the Forrof Tracker terminal and administrative dashboard, including session authentication and security tokens.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-[#1e293b] uppercase tracking-tight mb-4">Performance Cookies</h2>
                            <p>We use anonymous cookies to monitor platform latency and load distribution across our global nodes to ensure 99.9% uptime for our users.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-[#1e293b] uppercase tracking-tight mb-4">User Preferences</h2>
                            <p>These cookies remember your dashboard configuration, theme settings, and preferred language to provide a seamless enterprise experience.</p>
                        </section>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CookiePolicyPage;
