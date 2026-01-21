
import React from 'react';
// Fix: Move charting components to 'recharts' as they are not part of 'lucide-react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
// Fix: Keep only icon components in 'lucide-react' import
import {
    LayoutDashboard,
    Users,
    Building2,
    Briefcase,
    Clock,
    CalendarDays,
    Megaphone,
    Settings,
    LogOut,
    ChevronDown,
    Calendar,
    ArrowRight
} from 'lucide-react';
import { LogoIcon } from './Header';

const weeklyData = [
    { name: 'Mon', hours: 40 },
    { name: 'Tue', hours: 25 },
    { name: 'Wed', hours: 42 },
    { name: 'Thu', hours: 75 },
    { name: 'Fri', hours: 45 },
    { name: 'Sat', hours: 10 },
];

const DashboardPreview: React.FC = () => {
    return (
        <section className="py-12 bg-white reveal font-inter">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative group">
                    <div className="relative bg-white rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden flex flex-col md:flex-row h-[700px]">

                        {/* Sidebar Mockup */}
                        <div className="hidden md:flex w-64 bg-[#f8fafc] border-r border-slate-100 flex-col py-6">
                            <div className="px-6 mb-8 flex items-center gap-2">
                                <div className="text-[#1e293b]">
                                    <LogoIcon className="w-8 h-8" />
                                </div>
                                <span className="font-bold text-slate-800">Forrof Tracker</span>
                            </div>

                            <nav className="flex-1 space-y-1 px-3">
                                {[
                                    { icon: <LayoutDashboard size={18} />, label: 'Dashboard', active: true },
                                    { icon: <Users size={18} />, label: 'Employees' },
                                    { icon: <Building2 size={18} />, label: 'Departments' },
                                    { icon: <Briefcase size={18} />, label: 'Projects' },
                                    { icon: <Clock size={18} />, label: 'Attendance Tracking' },
                                    { icon: <CalendarDays size={18} />, label: 'Leave Management' },
                                    { icon: <Megaphone size={18} />, label: 'Announcements' },
                                    { icon: <Settings size={18} />, label: 'Settings' },
                                ].map((item, idx) => (
                                    <div key={idx} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${item.active ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-100'}`}>
                                        {item.icon}
                                        {item.label}
                                    </div>
                                ))}
                            </nav>

                            <div className="px-7 pt-4 mt-auto border-t border-slate-100">
                                <div className="flex items-center gap-3 text-red-500 text-sm font-bold cursor-pointer">
                                    <LogOut size={18} />
                                    Logout
                                </div>
                            </div>
                        </div>

                        {/* Main Content Mockup */}
                        <div className="flex-1 bg-white overflow-y-auto">
                            {/* Header */}
                            <div className="h-16 border-b border-slate-50 flex items-center justify-end px-8 gap-4">
                                <div className="relative">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                        <BellIcon />
                                    </div>
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold border-2 border-white">2</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-right leading-tight">
                                        <p className="text-xs font-bold text-slate-800">Admin</p>
                                        <p className="text-[10px] text-slate-400">admin</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
                                        <Settings size={14} className="text-white" />
                                    </div>
                                </div>
                            </div>

                            {/* Dashboard Content */}
                            <div className="p-8 space-y-6">
                                <div className="flex justify-end gap-3">
                                    <button className="flex items-center gap-2 px-3 py-1.5 bg-[#1e293b] text-white text-xs font-medium rounded-md">Department <ChevronDown size={14} /></button>
                                    <button className="flex items-center gap-2 px-3 py-1.5 bg-[#1e293b] text-white text-xs font-medium rounded-md">Project <ChevronDown size={14} /></button>
                                    <button className="flex items-center gap-2 px-3 py-1.5 bg-[#1e293b] text-white text-xs font-medium rounded-md"><Calendar size={14} /> Date Range</button>
                                </div>

                                {/* Stat Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        { val: '290', label: 'Active Employees', color: 'text-green-500', bg: 'bg-green-50', icon: <Users size={16} /> },
                                        { val: '14', label: 'Inactive Employees', color: 'text-red-500', bg: 'bg-red-50', icon: <Users size={16} /> },
                                        { val: '98.74', label: 'Total Hours Logged', color: 'text-blue-600', bg: 'bg-blue-50', icon: <Clock size={16} /> },
                                        { val: '304', label: 'CheckIn Today', color: 'text-blue-500', bg: 'bg-blue-50', icon: <ArrowRight size={16} /> },
                                        { val: '14', label: 'CheckOut Today', color: 'text-orange-500', bg: 'bg-orange-50', icon: <ArrowRight size={16} className="rotate-180" /> },
                                        { val: '5', label: 'On Leave', color: 'text-purple-500', bg: 'bg-purple-50', icon: <Megaphone size={16} /> },
                                    ].map((stat, i) => (
                                        <div key={i} className="p-5 bg-white border border-slate-100 rounded-xl shadow-sm flex items-start justify-between">
                                            <div>
                                                <h4 className={`text-4xl font-bold ${stat.color} mb-1`}>{stat.val}</h4>
                                                <p className="text-xs font-medium text-slate-400">{stat.label}</p>
                                            </div>
                                            <div className={`${stat.bg} ${stat.color} p-2 rounded-full`}>
                                                {stat.icon}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Weekly Chart Card */}
                                <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
                                    <h5 className="text-sm font-bold text-slate-800 mb-8">Average Working Hours per week</h5>
                                    <div className="h-[250px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={weeklyData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                                                <YAxis fontSize={10} axisLine={false} tickLine={false} />
                                                <Tooltip cursor={{ fill: '#f8fafc' }} />
                                                <Bar dataKey="hours" fill="#003594" radius={[4, 4, 0, 0]} barSize={50} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute -inset-10 bg-blue-500/5 blur-[120px] -z-10"></div>
                </div>
            </div>
        </section>
    );
};

const BellIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
);

export default DashboardPreview;
