import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import { SpaceBackground } from '../components/landing/SpaceBackground';
import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { ThreatTicker } from '../components/landing/ThreatTicker';
import { ThreatRadar } from '../components/landing/ThreatRadar';
import { ScanInterface } from '../components/landing/ScanInterface';
import { IntelligenceVisual } from '../components/landing/IntelligenceVisual';
import { HowItWorks } from '../components/landing/HowItWorks';
import { ThreatSurfaces } from '../components/landing/ThreatSurfaces';
import { QrSection } from '../components/landing/QrSection';
import { GraphIntelligence } from '../components/landing/GraphIntelligence';
import { RagSection } from '../components/landing/RagSection';
import { ExplainabilityPanel } from '../components/landing/ExplainabilityPanel';
import { RiskVisualization } from '../components/landing/RiskVisualization';
import { CommandCenterPreview } from '../components/landing/CommandCenterPreview';
import { SecurityTrust } from '../components/landing/SecurityTrust';
import { FinalCTA } from '../components/landing/FinalCTA';
import { Footer } from '../components/landing/Footer';

const ParallaxReveal = ({ children, offset = 50 }: { children: React.ReactNode, offset?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: offset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="w-full relative z-10"
    >
      {children}
    </motion.div>
  );
};

const LandingPage: React.FC = () => {
  return (
    <div className="relative bg-transparent text-white min-h-screen overflow-x-hidden selection:bg-teal-500/30 font-sans">
      
      {/* Global Space Background */}
      <SpaceBackground />
      
      {/* Glow layers that move on scroll */}
      <motion.div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center">
        <div className="absolute top-[10%] left-[10%] w-[50vw] h-[50vw] bg-teal-900/10 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-[20%] right-[10%] w-[40vw] h-[40vw] bg-blue-900/10 rounded-full blur-[150px] mix-blend-screen" />
      </motion.div>
      
      <Navbar />

      <main className="relative z-10 w-full flex flex-col items-center">
        <Hero />
        
        <ThreatTicker />

        <div className="w-full max-w-7xl mx-auto px-6 space-y-32 md:space-y-48 pb-32">
          
          <ParallaxReveal offset={100}>
            <ThreatSurfaces />
          </ParallaxReveal>

          <ParallaxReveal>
            <ScanInterface />
          </ParallaxReveal>

          <ParallaxReveal>
            <IntelligenceVisual />
          </ParallaxReveal>

          <ParallaxReveal>
            <HowItWorks />
          </ParallaxReveal>

          <ParallaxReveal>
            <RiskVisualization />
          </ParallaxReveal>

          <ParallaxReveal>
            <RagSection />
          </ParallaxReveal>

          <ParallaxReveal>
            <ExplainabilityPanel />
          </ParallaxReveal>

          <ParallaxReveal>
            <GraphIntelligence />
          </ParallaxReveal>
          
          <ParallaxReveal>
            <CommandCenterPreview />
          </ParallaxReveal>

          <ParallaxReveal>
            <QrSection />
          </ParallaxReveal>

          <ParallaxReveal>
            <ThreatRadar />
          </ParallaxReveal>

        </div>
        
        <SecurityTrust />
        <FinalCTA />
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage;
