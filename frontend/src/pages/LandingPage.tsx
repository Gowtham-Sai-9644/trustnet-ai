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

// Spherical Network zooming overlay
const SphericalNetworkOverlay = ({ progress, isMobile }: { progress: any; isMobile: boolean }) => {
  // Use SVG viewBox for infinite-resolution zoom on desktop, CSS scale on mobile for performance
  const maxScale = isMobile ? 4.5 : 15;
  const scale = useTransform(progress, [0, 1], [0.8, maxScale]);
  
  const viewBox = useTransform(progress, (p: number) => {
    if (isMobile) return "0 0 800 800"; // Fixed viewBox, animate via scale on mobile
    const currentScale = 0.8 + (p * 14.2);
    const size = 800 / currentScale;
    const offset = (800 - size) / 2;
    return `${offset} ${offset} ${size} ${size}`;
  });
  
  const rotate = useTransform(progress, [0, 1], [0, 180]);
  const opacity = useTransform(progress, [0, 0.1, 0.5, 0.9, 1], [0.1, 0.3, 0.3, 0.3, 0.1]);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
      style={{ 
        scale: isMobile ? scale : undefined, 
        rotate, 
        opacity, 
        willChange: "transform" 
      }}
    >
      <motion.svg 
        viewBox={isMobile ? "0 0 800 800" : viewBox} 
        className="w-[100vw] h-[100vw] max-w-[800px] max-h-[800px] text-[#00E5FF] opacity-30"
        style={{ willChange: "auto" }}
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

const LandingPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Keyboard Navigation for Zoom Sections
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const targets = [0.075, 0.275, 0.475, 0.675, 0.825, 0.95];
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const currentProgress = window.scrollY / maxScroll;
        let targetProgress = currentProgress;
        if (e.key === 'ArrowDown') {
          const next = targets.find(t => t > currentProgress + 0.05);
          if (next !== undefined) targetProgress = next;
          else targetProgress = 1;
        } else if (e.key === 'ArrowUp') {
          const prev = [...targets].reverse().find(t => t < currentProgress - 0.05);
          if (prev !== undefined) targetProgress = prev;
          else targetProgress = 0;
        }
        window.scrollTo({ top: targetProgress * maxScroll, behavior: 'smooth' });
      }
    };
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Track scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Create a spring-dampened smoothed progress value to prevent mobile/desktop scrolling jumps or lags
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: isMobile ? 80 : 150,  // Fast, responsive movement to eliminate delay/lag
    damping: isMobile ? 35 : 40,    // High damping to keep it smooth and absorb wheel steps
    restDelta: 0.001
  });

  // 3D transition parameters calibrated for mobile vs desktop screens
  const entryRotate = isMobile ? -12 : -22;
  const exitRotate = isMobile ? 12 : 22;
  const entryY = isMobile ? 35 : 70;
  const exitY = isMobile ? -35 : -70;
  
  // Scaling bounds to prevent text clipping while showing full zoom transitions
  const entryScale = isMobile ? 0.96 : 0.95;
  const exitScale = isMobile ? 1.06 : 1.10;

  // --- Hero Animations (0 to 0.15) ---
  const heroOpacity = useTransform(smoothProgress, [0, 0.1, 0.15], [1, 1, 0]);
  const heroScale = useTransform(smoothProgress, [0, 0.15], [1, exitScale]); 
  const heroRotateX = useTransform(smoothProgress, [0, 0.15], [0, exitRotate]);
  const heroTranslateY = useTransform(smoothProgress, [0, 0.15], [0, exitY]);
  const heroDisplay = useTransform(smoothProgress, [0, 0.15, 0.16], ["flex", "flex", "none"]);

  // --- Bento Grid Animations (0.17 to 0.32) ---
  const bentoOpacity = useTransform(smoothProgress, [0.16, 0.19, 0.30, 0.33], [0, 1, 1, 0]);
  const bentoScale = useTransform(smoothProgress, [0.17, 0.20, 0.29, 0.32], [entryScale, 1, 1, exitScale]);
  const bentoRotateX = useTransform(smoothProgress, [0.17, 0.20, 0.29, 0.32], [entryRotate, 0, 0, exitRotate]);
  const bentoTranslateY = useTransform(smoothProgress, [0.17, 0.20, 0.29, 0.32], [entryY, 0, 0, exitY]);
  const bentoDisplay = useTransform(smoothProgress, [0.15, 0.16, 0.32, 0.33], ["none", "flex", "flex", "none"]);

  // --- How To Use Animations (0.34 to 0.49) ---
  const howToOpacity = useTransform(smoothProgress, [0.33, 0.36, 0.47, 0.50], [0, 1, 1, 0]);
  const howToScale = useTransform(smoothProgress, [0.34, 0.37, 0.46, 0.49], [entryScale, 1, 1, exitScale]);
  const howToRotateX = useTransform(smoothProgress, [0.34, 0.37, 0.46, 0.49], [entryRotate, 0, 0, exitRotate]);
  const howToTranslateY = useTransform(smoothProgress, [0.34, 0.37, 0.46, 0.49], [entryY, 0, 0, exitY]);
  const howToDisplay = useTransform(smoothProgress, [0.32, 0.33, 0.49, 0.50], ["none", "flex", "flex", "none"]);

  // --- Dashboard Animations (0.51 to 0.66) ---
  const dashOpacity = useTransform(smoothProgress, [0.50, 0.53, 0.64, 0.67], [0, 1, 1, 0]);
  const dashScale = useTransform(smoothProgress, [0.51, 0.54, 0.63, 0.66], [entryScale, 1, 1, exitScale]);
  const dashRotateX = useTransform(smoothProgress, [0.51, 0.54, 0.63, 0.66], [entryRotate, 0, 0, exitRotate]);
  const dashTranslateY = useTransform(smoothProgress, [0.51, 0.54, 0.63, 0.66], [entryY, 0, 0, exitY]);
  const dashDisplay = useTransform(smoothProgress, [0.49, 0.50, 0.66, 0.67], ["none", "flex", "flex", "none"]);

  // --- Team Animations (0.68 to 0.83) ---
  const teamOpacity = useTransform(smoothProgress, [0.67, 0.70, 0.81, 0.84], [0, 1, 1, 0]);
  const teamScale = useTransform(smoothProgress, [0.68, 0.71, 0.80, 0.83], [entryScale, 1, 1, exitScale]);
  const teamRotateX = useTransform(smoothProgress, [0.68, 0.71, 0.80, 0.83], [entryRotate, 0, 0, exitRotate]);
  const teamTranslateY = useTransform(smoothProgress, [0.68, 0.71, 0.80, 0.83], [entryY, 0, 0, exitY]);
  const teamDisplay = useTransform(smoothProgress, [0.66, 0.67, 0.83, 0.84], ["none", "flex", "flex", "none"]);

  // --- Metrics & CTA Animations (0.85 to 1) ---
  const finalOpacity = useTransform(smoothProgress, [0.84, 0.87, 1], [0, 1, 1]);
  const finalScale = useTransform(smoothProgress, [0.85, 0.88, 1], [entryScale, 1, 1]);
  const finalRotateX = useTransform(smoothProgress, [0.85, 0.88, 1], [entryRotate, 0, 0]);
  const finalTranslateY = useTransform(smoothProgress, [0.85, 0.88, 1], [entryY, 0, 0]);
  const finalDisplay = useTransform(smoothProgress, [0.83, 0.84], ["none", "flex"]);

  return (
    <div ref={containerRef} className={`relative bg-landing-bg text-landing-text ${isMobile ? 'h-[1200vh]' : 'h-[2400vh]'}`}>
      {/* The Sticky Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center pt-16">
        <AnimatedBackground />
        
        {/* Spherical Network Zoom Overlay */}
        <SphericalNetworkOverlay progress={smoothProgress} isMobile={isMobile} />
        
        {/* Deep Space Margins */}
        <SpaceGutter />
        
        {/* Fixed Title Bar inside the sticky viewport */}
        <div className="absolute top-0 left-0 right-0 z-50">
          <Navbar />
        </div>

        <div className="relative w-full h-full max-w-7xl mx-auto flex items-center justify-center z-10 pointer-events-none">
          
          {/* HERO SECTION */}
          <motion.div 
            className="absolute inset-0 flex flex-col items-center md:justify-center justify-start overflow-y-auto overflow-x-hidden pointer-events-auto pt-24 pb-10 custom-scrollbar"
            style={{ display: heroDisplay, opacity: heroOpacity, scale: heroScale, rotateX: heroRotateX, translateY: heroTranslateY, perspective: "1500px" }}
          >
            <div className="w-full scale-90 md:scale-100 mt-[-10vh]">
              <Hero />
            </div>
          </motion.div>

          {/* BENTO GRID SECTION */}
          <motion.div 
            className="absolute inset-0 flex flex-col items-center md:justify-center justify-start overflow-y-auto overflow-x-hidden pointer-events-auto pt-24 pb-10 custom-scrollbar"
            style={{ display: bentoDisplay, opacity: bentoOpacity, scale: bentoScale, rotateX: bentoRotateX, translateY: bentoTranslateY, perspective: "1500px" }}
          >
            <div className="w-full pt-10 scale-90 md:scale-100">
              <BentoGrid />
            </div>
          </motion.div>

          {/* HOW TO USE SECTION */}
          <motion.div 
            className="absolute inset-0 flex flex-col items-center md:justify-center justify-start overflow-y-auto overflow-x-hidden pointer-events-auto pt-24 pb-10 custom-scrollbar"
            style={{ display: howToDisplay, opacity: howToOpacity, scale: howToScale, rotateX: howToRotateX, translateY: howToTranslateY, perspective: "1500px" }}
          >
            <div className="w-full scale-90 md:scale-100">
              <HowToUse />
            </div>
          </motion.div>

          {/* DASHBOARD SECTION */}
          <motion.div 
            className="absolute inset-0 flex flex-col items-center md:justify-center justify-start overflow-y-auto overflow-x-hidden pointer-events-auto pt-24 pb-10 custom-scrollbar"
            style={{ display: dashDisplay, opacity: dashOpacity, scale: dashScale, rotateX: dashRotateX, translateY: dashTranslateY, perspective: "1500px" }}
          >
            <div className="w-full scale-[0.85] origin-center">
              <DashboardPreview />
            </div>
          </motion.div>

          {/* TEAM SECTION */}
          <motion.div 
            className="absolute inset-0 flex flex-col items-center md:justify-center justify-start overflow-y-auto overflow-x-hidden pointer-events-auto pt-24 pb-10 custom-scrollbar"
            style={{ display: teamDisplay, opacity: teamOpacity, scale: teamScale, rotateX: teamRotateX, translateY: teamTranslateY, perspective: "1500px" }}
          >
            <div className="w-full scale-90 md:scale-100">
              <Team />
            </div>
          </motion.div>

          {/* FINAL METRICS & CTA SECTION */}
          <motion.div 
            className="absolute inset-0 flex flex-col items-center md:justify-center justify-start overflow-y-auto overflow-x-hidden pointer-events-auto pt-24 pb-10 custom-scrollbar"
            style={{ display: finalDisplay, opacity: finalOpacity, scale: finalScale, rotateX: finalRotateX, translateY: finalTranslateY, perspective: "1500px" }}
          >
            <div className="w-full mt-20 pb-20 scale-90 md:scale-100">
              <Metrics />
              <CTA />
              <Footer />
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default LandingPage;
