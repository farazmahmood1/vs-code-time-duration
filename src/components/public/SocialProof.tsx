
import React from 'react';

const logos = [
    'LogoOne', 'LogoTwo', 'LogoThree', 'LogoFour', 'LogoFive', 'LogoSix'
];

const SocialProof: React.FC = () => {
    return (
        <section className="py-12 lg:py-20 reveal font-inter">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-10">
                    Trusted by Industry Leaders Worldwide
                </p>
                <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    {logos.map((logo, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-slate-300 rounded-full"></div>
                            <span className="text-xl font-bold text-slate-600">{logo}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SocialProof;
