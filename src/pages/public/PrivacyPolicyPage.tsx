
import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
    return (
        <div className="bg-white font-inter">
            <section className="py-24 bg-slate-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-5xl font-black text-[#1e293b] uppercase tracking-tighter mb-12 reveal">Privacy Policy</h1>
                    <div className="prose prose-slate max-w-none text-slate-600 space-y-8 reveal" style={{ animationDelay: '0.1s' }}>
                        <p className="text-lg font-medium text-slate-900">Effective Date: October 24, 2024</p>

                        <section>
                            <h2 className="text-2xl font-black text-[#1e293b] uppercase tracking-tight mb-4">1. Information We Collect</h2>
                            <p>We collect information to provide better services to all our users. This includes telemetry data from our desktop application, administrative data provided by HR, and biometric verification data if enabled.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-[#1e293b] uppercase tracking-tight mb-4">2. How We Use Data</h2>
                            <p>Forrof Tracker uses data specifically for workforce management. We do not sell data to third-party advertisers. All productivity scoring is used exclusively by the client organization that employs you.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-[#1e293b] uppercase tracking-tight mb-4">3. Data Retention</h2>
                            <p>User data is retained only for the duration of the service agreement. Upon termination of service, all identifiable data is purged within 30 days unless legal retention requirements apply.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-black text-[#1e293b] uppercase tracking-tight mb-4">4. Compliance</h2>
                            <p>We comply with global standards including GDPR (EU), CCPA (USA), and APPs (Australia). Users have the right to request data access or deletion through their organization's admin panel.</p>
                        </section>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PrivacyPolicyPage;
