
import React from 'react';
import { Monitor, MousePointer2, Coffee, MessageSquare, Zap, ShieldCheck } from 'lucide-react';

const TimeTrackerSection: React.FC = () => {
    return (
        <section className="py-24 bg-white overflow-hidden reveal font-inter">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    <div className="order-2 lg:order-1 relative">
                        {/* Mock Desktop Tracker Window */}
                        <div className="relative z-10 bg-[#1e293b] rounded-2xl shadow-2xl overflow-hidden border border-slate-700 w-full max-w-md mx-auto transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                            <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Forrof Tracker Desktop v2.4</span>
                            </div>
                            <div className="p-8 text-center">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-[10px] font-bold mb-6">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                    TRACKING ACTIVE
                                </div>
                                <h4 className="text-5xl font-mono font-light text-white mb-2 tracking-tighter">04:22:18</h4>
                                <p className="text-slate-400 text-sm mb-8">Current Task: <span className="text-blue-400">Frontend Optimization</span></p>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Productivity</p>
                                        <p className="text-xl font-bold text-white">94%</p>
                                    </div>
                                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Idle Time</p>
                                        <p className="text-xl font-bold text-white">12m</p>
                                    </div>
                                </div>

                                <button className="w-full py-4 bg-[#ef4444] hover:bg-red-600 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                                    <Zap size={18} />
                                    Stop Tracking
                                </button>
                            </div>

                            <div className="bg-slate-800/30 p-4 border-t border-slate-700">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                        <MessageSquare size={14} className="text-blue-400" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-bold text-white">New message from HR</p>
                                        <p className="text-[10px] text-slate-400">Payroll reports are ready for review.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Background elements */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/10 blur-[100px] -z-10 rounded-full"></div>
                        <div className="absolute -top-10 -right-10 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-[200px] z-20 block">
                            <div className="flex items-center gap-2 mb-3">
                                <ShieldCheck className="text-blue-500" size={20} />
                                <p className="text-xs font-bold text-slate-800">Auto-Pause</p>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-relaxed">
                                Intelligent detection pauses tracking when 5 minutes of inactivity is detected.
                            </p>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold mb-6">
                            NATIVE DESKTOP EXPERIENCE
                        </div>
                        <h2 className="text-4xl font-extrabold text-[#1e293b] mb-6 leading-tight">
                            Intelligent Time Tracking <br />
                            <span className="text-blue-600">Built for Focus.</span>
                        </h2>
                        <p className="text-slate-600 mb-8 text-lg">
                            Forrof Tracker's desktop app goes beyond simple clocks. It provides deep visibility into work patterns while respecting employee focus and privacy.
                        </p>

                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-[#1e293b]">
                                    <Coffee size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#1e293b] mb-1">Activity-Based Auto-Pause</h4>
                                    <p className="text-slate-500 text-sm">Automatically detects when a user is away from their keyboard and pauses the timer to ensure precise billing and payroll.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-[#1e293b]">
                                    <Monitor size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#1e293b] mb-1">App & Tab Level Monitoring</h4>
                                    <p className="text-slate-500 text-sm">Admins can see detailed breakdown of time spent on specific applications (e.g., Slack vs. VS Code) and browser tabs.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-[#1e293b]">
                                    <MousePointer2 size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#1e293b] mb-1">Productivity Scoring</h4>
                                    <p className="text-slate-500 text-sm">AI-driven reports that categorize activities into "Productive," "Neutral," and "Distracting" based on your project goals.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TimeTrackerSection;
