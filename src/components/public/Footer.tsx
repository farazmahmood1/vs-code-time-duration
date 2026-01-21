import React from 'react';
import { Link } from 'react-router-dom';
import { LogoIcon } from './Header';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white border-t border-slate-100 pt-16 pb-8 font-inter">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
                    <div className="col-span-2 lg:col-span-1">
                        <Link to="/" className="flex items-center space-x-2 mb-6 hover:opacity-80 transition-opacity text-left">
                            <div className="text-[#1e293b]">
                                <LogoIcon className="w-9 h-9" />
                            </div>
                            <span className="text-xl font-bold tracking-tighter text-[#1e293b] uppercase">FORROF TRACKER</span>
                        </Link>
                        <p className="text-slate-500 text-sm mb-6 font-medium">
                            Intelligent workforce management solutions for the enterprise of tomorrow.
                        </p>
                        <div className="flex space-x-4">
                            <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-[#1e293b] transition-colors cursor-pointer border border-slate-100">
                                <span className="text-[10px] font-bold">IN</span>
                            </div>
                            <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-[#1e293b] transition-colors cursor-pointer border border-slate-100">
                                <span className="text-[10px] font-bold">TW</span>
                            </div>
                            <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-[#1e293b] transition-colors cursor-pointer border border-slate-100">
                                <span className="text-[10px] font-bold">FB</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[#1e293b] font-black text-xs uppercase tracking-widest mb-6">Features</h4>
                        <ul className="space-y-4 text-slate-500 text-sm font-bold">
                            <li><Link to="/features" className="hover:text-[#1e293b] transition-colors text-left">Platform Overview</Link></li>
                            <li><Link to="/features" className="hover:text-[#1e293b] transition-colors text-left">Time Tracking</Link></li>
                            <li><Link to="/features" className="hover:text-[#1e293b] transition-colors text-left">Analytics</Link></li>
                            <li><Link to="/features" className="hover:text-[#1e293b] transition-colors text-left">Payroll Node</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[#1e293b] font-black text-xs uppercase tracking-widest mb-6">Verticals</h4>
                        <ul className="space-y-4 text-slate-500 text-sm font-bold">
                            <li><Link to="/solutions" className="hover:text-[#1e293b] transition-colors text-left">Technology</Link></li>
                            <li><Link to="/solutions" className="hover:text-[#1e293b] transition-colors text-left">Healthcare</Link></li>
                            <li><Link to="/solutions" className="hover:text-[#1e293b] transition-colors text-left">Retail</Link></li>
                            <li><Link to="/solutions" className="hover:text-[#1e293b] transition-colors text-left">Logistics</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[#1e293b] font-black text-xs uppercase tracking-widest mb-6">Company</h4>
                        <ul className="space-y-4 text-slate-500 text-sm font-bold">
                            <li><Link to="/about" className="hover:text-[#1e293b] transition-colors text-left">About Us</Link></li>
                            <li><a href="https://forrof.io" className="hover:text-[#1e293b] transition-colors text-left">forrof.io</a></li>
                            <li><Link to="/security" className="hover:text-[#1e293b] transition-colors text-left">Security</Link></li>
                            <li><Link to="/privacy" className="hover:text-[#1e293b] transition-colors text-left">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[#1e293b] font-black text-xs uppercase tracking-widest mb-6">Terminal</h4>
                        <ul className="space-y-4 text-slate-500 text-sm font-bold">
                            <li><Link to="/login" className="text-[#1e293b] font-black uppercase tracking-widest hover:underline">Log In</Link></li>
                            <li><Link to="/login" className="text-[#1e293b] font-black uppercase tracking-widest hover:underline">Book a Demo</Link></li>
                            <li><Link to="/pricing" className="hover:text-[#1e293b] transition-colors uppercase tracking-widest text-left">Pricing</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <p>&copy; {new Date().getFullYear()} FORROF TRACKER Inc. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link to="/terms" className="hover:text-[#1e293b]">Terms of Service</Link>
                        <Link to="/cookies" className="hover:text-[#1e293b]">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
