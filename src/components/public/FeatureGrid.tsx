
import React from 'react';
import { Clock, Calendar, BarChart2, Bell, MessageSquare, Shield } from 'lucide-react';

const features = [
    {
        title: 'Attendance Tracking',
        description: 'Automated biometric and mobile check-ins with real-time sync to payroll modules.',
        icon: <Clock className="w-6 h-6" />,
        color: 'bg-blue-50 text-blue-600'
    },
    {
        title: 'Leave Management',
        description: 'One-click leave requests and approvals with automated balance calculations.',
        icon: <Calendar className="w-6 h-6" />,
        color: 'bg-green-50 text-green-600'
    },
    {
        title: 'Internal Team Chat',
        description: 'Secure, enterprise-grade messaging built directly into the dashboard and desktop app.',
        icon: <MessageSquare className="w-6 h-6" />,
        color: 'bg-purple-50 text-purple-600'
    },
    {
        title: 'Productivity Reports',
        description: 'Advanced analytics on time allocation across apps, tasks, and browser activity.',
        icon: <BarChart2 className="w-6 h-6" />,
        color: 'bg-slate-100 text-[#1e293b]'
    },
    {
        title: 'Smart Announcements',
        description: 'Broadcast company-wide news instantly with read-receipts and tracking.',
        icon: <Bell className="w-6 h-6" />,
        color: 'bg-red-50 text-[#ef4444]'
    },
    {
        title: 'Security & Privacy',
        description: 'World-class encryption for employee data and customizable monitoring thresholds.',
        icon: <Shield className="w-6 h-6" />,
        color: 'bg-orange-50 text-orange-600'
    }
];

const FeatureGrid: React.FC = () => {
    return (
        <section id="features" className="py-24 bg-slate-50 reveal font-inter">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-[#1e293b] mb-4">World-Class Enterprise Capabilities</h2>
                    <p className="text-slate-500 max-w-xl mx-auto">Scalable, stable, and fully integrated HR software designed for modern high-performance teams.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-shadow group">
                            <div className={`${feature.color} w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-[#1e293b] mb-3">{feature.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeatureGrid;
