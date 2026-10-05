import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'framer-motion';

import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import { Hero } from '../components/landing/Hero';
import { BentoGrid } from '../components/landing/BentoGrid';
import { HowToUse } from '../components/landing/HowToUse';
import { DashboardPreview } from '../components/landing/DashboardPreview';
import { Team } from '../components/landing/Team';
import { Metrics } from '../components/landing/Metrics';
import { CTA } from '../components/landing/CTA';

// Mobile detection hook
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
};

// A completely scroll-driven Animated Background
const bgImages = [
  '/dark_bg_1.jpg',
  '/dark_bg_2.jpg',
  '/dark_bg_3.jpg',
  '/dark_bg_4.jpg'
];

// A completely scroll-driven Animated Background (Image Slideshow)
const AnimatedBackground = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % bgImages.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 z-0 bg-black overflow-hidden">
      {/* Background images only in the center — gutters stay pure black space */}
      <div className="absolute inset-y-0 left-[25vw] right-[25vw] md:left-[15vw] md:right-[15vw] overflow-hidden">
        <AnimatePresence>
          <motion.img
            key={index}
            src={bgImages[index]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover blur-[8px] scale-[1.05]"
            loading="eager"
          />
        </AnimatePresence>
        
        {/* Solid dark overlay for smooth 60fps scroll */}
        <div className="absolute inset-0 bg-black/75 pointer-events-none" />
      </div>
    </div>
  );
};

// Deep Space Asteroid effect constrained to left and right margins
const SpaceGutter = () => {
  const isMobile = useIsMobile();
  const starCount = isMobile ? 12 : 40;
  const asteroidCount = isMobile ? 2 : 5;

  // Generate random particles (stars and asteroids)
  const generateParticles = (count: number, type: 'star' | 'asteroid', side: 'left' | 'right') => {
    return Array.from({ length: count }).map((_, i) => {
      const size = type === 'star' ? Math.random() * 3 + 1 : Math.random() * 20 + 10;
      const left = Math.random() * 100;
      const duration = type === 'star' ? Math.random() * 10 + 10 : Math.random() * 15 + 15;
      const delay = Math.random() * -25;
      const rot = Math.random() * 360 + 180;
      
      return (
        <div
          key={`${side}-${type}-${i}`}
          className={type === 'star' ? 'star-particle' : 'asteroid-particle'}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${left}%`,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
            ...(type === 'asteroid' ? { '--rot': `${rot}deg` } as any : {})
          }}
        />
      );
    });
  };

  return (
    <>
      {/* Left Space Gutter */}
      <div className="absolute top-0 bottom-0 left-0 w-[25vw] md:w-[15vw] z-0 overflow-hidden pointer-events-none opacity-40 md:opacity-60">
        {generateParticles(starCount, 'star', 'left')}
        {generateParticles(asteroidCount, 'asteroid', 'left')}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/90"></div>
      </div>
      
      {/* Right Space Gutter */}
      <div className="absolute top-0 bottom-0 right-0 w-[25vw] md:w-[15vw] z-0 overflow-hidden pointer-events-none opacity-40 md:opacity-60">
        {generateParticles(starCount, 'star', 'right')}
        {generateParticles(asteroidCount, 'asteroid', 'right')}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/90"></div>
      </div>
    </>
  );
};

// Spherical Network infinitely rotating background overlay
const SphericalNetworkOverlay = ({ isMobile }: { progress?: any; isMobile: boolean }) => {
  const maxScale = isMobile ? 4.5 : 8;
  
  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
      animate={{ rotate: 360 }}
      transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
    >
      <motion.svg 
        viewBox="0 0 800 800" 
        className="w-[100vw] h-[100vw] max-w-[800px] max-h-[800px] text-[#00E5FF] opacity-30"
        style={{ scale: maxScale }}
      >
        <circle cx="400" cy="400" r="390" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="10 5" vectorEffect="non-scaling-stroke" />
        <ellipse cx="400" cy="400" rx="390" ry="120" fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <ellipse cx="400" cy="400" rx="120" ry="390" fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <ellipse cx="400" cy="400" rx="390" ry="250" fill="none" stroke="currentColor" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
        <ellipse cx="400" cy="400" rx="250" ry="390" fill="none" stroke="currentColor" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
        
        {/* Network Nodes */}
        {Array.from({ length: 30 }).map((_, i) => {
          // Generate somewhat spherical distribution
          const angle = (i * Math.PI * 2) / 15 + (i * 0.5);
          const r = 380 * Math.pow(Math.random(), 0.5); 
          const cx = 400 + Math.cos(angle) * r;
          const cy = 400 + Math.sin(angle) * r;
          const cx_inner = 400 + Math.cos(angle + 1) * (r * 0.5);
          const cy_inner = 400 + Math.sin(angle + 1) * (r * 0.5);
          
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r="3" fill="currentColor" />
              <line x1={cx_inner} y1={cy_inner} x2={cx} y2={cy} stroke="currentColor" strokeWidth="0.5" opacity="0.6" vectorEffect="non-scaling-stroke" />
            </g>
          )
        })}
      </motion.svg>
    </motion.div>
  );
};

// Mobile 3D reveal wrapper
const Mobile3DSection = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 12, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

// Simple fade-up animation for sections as they scroll into view
const FadeUpSection = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full flex flex-col items-center justify-center"
    >
      {children}
    </motion.div>
  );
};

const LandingPage: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className="relative bg-landing-bg text-landing-text min-h-screen overflow-x-hidden selection:bg-[#00E5FF]/30">
      
      {/* --- ANIMATED BACKGROUND LAYER --- */}
      <div className="fixed inset-0 z-0 bg-black pointer-events-none">
        <AnimatedBackground />
        <SpaceGutter />
        <SphericalNetworkOverlay progress={0.5} isMobile={isMobile} />
        
        {/* Deep ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[1200px] max-h-[1200px] bg-[#00E5FF] opacity-[0.03] blur-[120px] rounded-full"></div>
      </div>
      
      {/* --- FIXED NAVBAR --- */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* --- NATIVE SCROLLING CONTENT LAYER --- */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pt-32 pb-24 space-y-32 md:space-y-48 flex flex-col items-center">
        
        <FadeUpSection>
          <div className="w-full mt-10 md:mt-20">
            <Hero />
          </div>
        </FadeUpSection>

        <FadeUpSection>
          <div className="w-full">
            <BentoGrid />
          </div>
        </FadeUpSection>

        <FadeUpSection>
          <div className="w-full">
            <HowToUse />
          </div>
        </FadeUpSection>

        <FadeUpSection>
          <div className="w-full flex justify-center scale-95 md:scale-100">
            <DashboardPreview />
          </div>
        </FadeUpSection>

        <FadeUpSection>
          <div className="w-full">
            <Team />
          </div>
        </FadeUpSection>

        <FadeUpSection>
          <div className="w-full space-y-24 md:space-y-32 mt-10">
            <Metrics />
            <CTA />
            <Footer />
          </div>
        </FadeUpSection>

      </div>
    </div>
  );
};

export default LandingPage;
