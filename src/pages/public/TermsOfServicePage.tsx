
import React from 'react';

const TermsOfServicePage: React.FC = () => {
    return (
        <div className="bg-white font-inter">
            <section className="py-24 bg-slate-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-5xl font-black text-[#1e293b] uppercase tracking-tighter mb-12 reveal">Terms of Service</h1>
                    <div className="prose prose-slate max-w-none text-slate-600 space-y-8 reveal" style={{ animationDelay: '0.1s' }}>
                        <p className="text-lg font-medium text-slate-900">Last Updated: October 24, 2024</p>

                        <section>
                            <h2 className="text-2xl font-black text-[#1e293b] uppercase tracking-tight mb-4">1. Agreement to Terms</h2>
                            <p>By accessing Forrof Tracker, you agree to be bound by these enterprise terms. Our services are intended for professional use within verified organizations.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-[#1e293b] uppercase tracking-tight mb-4">2. Service License</h2>
                            <p>We grant a limited, non-exclusive license to use our platform and desktop tracking software. Use for reverse engineering or unauthorized surveillance is strictly prohibited.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-[#1e293b] uppercase tracking-tight mb-4">3. Service Levels (SLA)</h2>
                            <p>Enterprise Pro and Global Master tiers are subject to specific SLA guarantees regarding uptime (99.9%) and support response times. Standard tier is provided on a best-effort basis.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-[#1e293b] uppercase tracking-tight mb-4">4. Termination</h2>
                            <p>Either party may terminate the agreement with 30 days written notice. Access to the dashboard and tracking terminal will cease immediately upon termination date.</p>
                        </section>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TermsOfServicePage;
