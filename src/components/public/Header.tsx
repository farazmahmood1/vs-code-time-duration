import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const LogoIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
    <img src="/logo.png" alt="Forrof Tracker Logo" className={`${className} object-contain`} />
);

const Header: React.FC = () => {
    const location = useLocation();
    const currentPage = location.pathname.substring(1) || 'home';

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 font-inter">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link
                        to="/"
                        className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                    >
                        <div className="text-[#1e293b]">
                            <LogoIcon className="w-10 h-10" />
                        </div>
                        <span className="text-xl font-bold tracking-tighter text-[#1e293b] uppercase">FORROF TRACKER</span>
                    </Link>

                    <nav className="hidden md:flex space-x-8 text-xs font-black uppercase tracking-widest text-slate-500">
                        <Link
                            to="/features"
                            className={`hover:text-[#1e293b] transition-colors ${currentPage === 'features' ? 'text-[#1e293b]' : ''}`}
                        >
                            Features
                        </Link>
                        <Link
                            to="/solutions"
                            className={`hover:text-[#1e293b] transition-colors ${currentPage === 'solutions' ? 'text-[#1e293b]' : ''}`}
                        >
                            Solutions
                        </Link>
                        <Link
                            to="/pricing"
                            className={`hover:text-[#1e293b] transition-colors ${currentPage === 'pricing' ? 'text-[#1e293b]' : ''}`}
                        >
                            Pricing
                        </Link>
                        <Link
                            to="/about"
                            className={`hover:text-[#1e293b] transition-colors ${currentPage === 'about' ? 'text-[#1e293b]' : ''}`}
                        >
                            About Us
                        </Link>
                        <Link
                            to="/security"
                            className={`hover:text-[#1e293b] transition-colors ${currentPage === 'security' ? 'text-[#1e293b]' : ''}`}
                        >
                            Security
                        </Link>
                    </nav>

                    <div className="flex items-center space-x-4">
                        <Link
                            to="/login"
                            className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-[#1e293b] hover:opacity-70 transition-opacity"
                        >
                            Log In
                        </Link>
                        <Link
                            to="/login"
                            className="bg-[#1e293b] text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                        >
                            Book a Demo
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
