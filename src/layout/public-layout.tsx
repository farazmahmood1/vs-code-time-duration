import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';

const PublicLayout: React.FC = () => {
    const location = useLocation();

    useEffect(() => {
        // Scroll to section if hash exists, else scroll to top
        if (location.hash) {
            const element = document.getElementById(location.hash.substring(1));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            window.scrollTo(0, 0);
        }
    }, [location]);

    // Re-run reveal animations on route change
    useEffect(() => {
        const reveals = document.querySelectorAll('.reveal');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }
                });
            },
            { threshold: 0.1 }
        );

        reveals.forEach((reveal) => observer.observe(reveal));

        return () => {
            reveals.forEach((reveal) => observer.unobserve(reveal));
        };
    }, [location.pathname]);

    return (
        <div className="min-h-screen flex flex-col font-inter bg-white text-slate-900">
            <Header />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default PublicLayout;
