import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { TrustedBy } from '../components/landing/TrustedBy';
import { ProblemSection } from '../components/landing/ProblemSection';
import { SolutionWorkflow } from '../components/landing/SolutionWorkflow';
import { BentoGrid } from '../components/landing/BentoGrid';
import { InteractiveDemo } from '../components/landing/InteractiveDemo';
import { TechStack } from '../components/landing/TechStack';
import { Architecture } from '../components/landing/Architecture';
import { ExplainableAI } from '../components/landing/ExplainableAI';
import { DashboardPreview } from '../components/landing/DashboardPreview';
import { Metrics } from '../components/landing/Metrics';
import { FutureScope } from '../components/landing/FutureScope';
import { CTA } from '../components/landing/CTA';
import { Footer } from '../components/landing/Footer';

const LandingPage: React.FC = () => {
  // Smooth scroll behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <Navbar />
      
      <main>
        <Hero />
        <TrustedBy />
        <ProblemSection />
        <SolutionWorkflow />
        <BentoGrid />
        <InteractiveDemo />
        <TechStack />
        <Architecture />
        <ExplainableAI />
        <DashboardPreview />
        <Metrics />
        <FutureScope />
        <CTA />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
