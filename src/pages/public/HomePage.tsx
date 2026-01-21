
import React from 'react';
import Hero from '@/components/public/Hero';
import DashboardPreview from '@/components/public/DashboardPreview';
import SocialProof from '@/components/public/SocialProof';
import FeatureGrid from '@/components/public/FeatureGrid';
import TimeTrackerSection from '@/components/public/TimeTrackerSection';
import SEOContent from '@/components/public/SEOContent';

const HomePage: React.FC = () => {
    return (
        <>
            <Hero />
            <DashboardPreview />
            <SocialProof />
            <FeatureGrid />
            <TimeTrackerSection />
            <SEOContent />
        </>
    );
};

export default HomePage;
