import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import { Hero } from '../components/landing/Hero';
import { BentoGrid } from '../components/landing/BentoGrid';
import { HowToUse } from '../components/landing/HowToUse';
import { DashboardPreview } from '../components/landing/DashboardPreview';
import { Team } from '../components/landing/Team';
import { Metrics } from '../components/landing/Metrics';
import { CTA } from '../components/landing/CTA';

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
    <div className="absolute inset-0 z-0 bg-landing-bg overflow-hidden flex items-center justify-center">
      
      <AnimatePresence>
        <motion.img
          key={index}
          src={bgImages[index]}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
      
      {/* Universal Dark Frosted Glass to keep images highly visible but smooth */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[20px] pointer-events-none" />
    </div>
  );
};

// Deep Space Asteroid effect constrained to left and right margins
const SpaceGutter = () => {
  // Generate random particles (stars and asteroids)
  const generateParticles = (count: number, type: 'star' | 'asteroid', side: 'left' | 'right') => {
    return Array.from({ length: count }).map((_, i) => {
      const size = type === 'star' ? Math.random() * 3 + 1 : Math.random() * 20 + 10;
      const left = Math.random() * 100; // 0 to 100% of the gutter width
      const duration = type === 'star' ? Math.random() * 10 + 10 : Math.random() * 15 + 15;
      const delay = Math.random() * -25; // Negative delay so they start already on screen
      const rot = Math.random() * 360 + 180; // For asteroids
      
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
        {generateParticles(40, 'star', 'left')}
        {generateParticles(5, 'asteroid', 'left')}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/90"></div>
      </div>
      
      {/* Right Space Gutter */}
      <div className="absolute top-0 bottom-0 right-0 w-[25vw] md:w-[15vw] z-0 overflow-hidden pointer-events-none opacity-40 md:opacity-60">
        {generateParticles(40, 'star', 'right')}
        {generateParticles(5, 'asteroid', 'right')}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/90"></div>
      </div>
    </>
  );
};

// Spherical Network zooming overlay
const SphericalNetworkOverlay = ({ progress }: { progress: any }) => {
  // As the user scrolls through the 1200vh, we continuously zoom into the network
  const scale = useTransform(progress, [0, 1], [0.8, 15]);
  const rotate = useTransform(progress, [0, 1], [0, 180]);
  const opacity = useTransform(progress, [0, 0.1, 0.5, 0.9, 1], [0.1, 0.3, 0.3, 0.3, 0.1]);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
      style={{ scale, rotate, opacity, willChange: "transform" }}
    >
      <svg viewBox="0 0 800 800" className="w-[100vw] h-[100vw] max-w-[800px] max-h-[800px] text-[#00E5FF] opacity-30">
        <circle cx="400" cy="400" r="390" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="10 5" />
        <ellipse cx="400" cy="400" rx="390" ry="120" fill="none" stroke="currentColor" strokeWidth="1" />
        <ellipse cx="400" cy="400" rx="120" ry="390" fill="none" stroke="currentColor" strokeWidth="1" />
        <ellipse cx="400" cy="400" rx="390" ry="250" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <ellipse cx="400" cy="400" rx="250" ry="390" fill="none" stroke="currentColor" strokeWidth="0.5" />
        
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
              <line x1={cx_inner} y1={cy_inner} x2={cx} y2={cy} stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
            </g>
          )
        })}
      </svg>
    </motion.div>
  );
};

const LandingPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress through the massive 600vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // --- Hero Animations (0 to 0.15) ---
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 2.5]); 
  const heroDisplay = useTransform(scrollYProgress, [0, 0.15, 0.16], ["flex", "flex", "none"]);

  // --- Bento Grid Animations (0.20 to 0.35) ---
  const bentoOpacity = useTransform(scrollYProgress, [0.20, 0.25, 0.30, 0.35], [0, 1, 1, 0]);
  const bentoScale = useTransform(scrollYProgress, [0.20, 0.25, 0.30, 0.35], [0.8, 1, 1, 2]);
  const bentoDisplay = useTransform(scrollYProgress, [0.19, 0.20, 0.35, 0.36], ["none", "flex", "flex", "none"]);

  // --- How To Use Animations (0.40 to 0.55) ---
  const howToOpacity = useTransform(scrollYProgress, [0.40, 0.45, 0.50, 0.55], [0, 1, 1, 0]);
  const howToScale = useTransform(scrollYProgress, [0.40, 0.45, 0.50, 0.55], [0.8, 1, 1, 2]);
  const howToDisplay = useTransform(scrollYProgress, [0.39, 0.40, 0.55, 0.56], ["none", "flex", "flex", "none"]);

  // --- Dashboard Animations (0.60 to 0.75) ---
  const dashOpacity = useTransform(scrollYProgress, [0.60, 0.65, 0.70, 0.75], [0, 1, 1, 0]);
  const dashScale = useTransform(scrollYProgress, [0.60, 0.65, 0.70, 0.75], [0.8, 1, 1, 2.5]);
  const dashRotateX = useTransform(scrollYProgress, [0.60, 0.65], [45, 0]); 
  const dashDisplay = useTransform(scrollYProgress, [0.59, 0.60, 0.75, 0.76], ["none", "flex", "flex", "none"]);

  // --- Team Animations (0.75 to 0.90) ---
  const teamOpacity = useTransform(scrollYProgress, [0.75, 0.80, 0.85, 0.90], [0, 1, 1, 0]);
  const teamScale = useTransform(scrollYProgress, [0.75, 0.80, 0.85, 0.90], [0.8, 1, 1, 2]);
  const teamDisplay = useTransform(scrollYProgress, [0.74, 0.75, 0.90, 0.91], ["none", "flex", "flex", "none"]);

  // --- Metrics & CTA Animations (0.90 to 1) ---
  const finalOpacity = useTransform(scrollYProgress, [0.90, 0.95, 1], [0, 1, 1]);
  const finalScale = useTransform(scrollYProgress, [0.90, 0.95, 1], [0.8, 1, 1]);
  const finalDisplay = useTransform(scrollYProgress, [0.89, 0.90], ["none", "flex"]);

  return (
    <div ref={containerRef} className="relative h-[1200vh] bg-landing-bg text-landing-text">
      {/* The Sticky Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center pt-16">
        <AnimatedBackground />
        
        {/* Spherical Network Zoom Overlay */}
        <SphericalNetworkOverlay progress={scrollYProgress} />
        
        {/* Deep Space Margins */}
        <SpaceGutter />
        
        {/* Fixed Title Bar inside the sticky viewport */}
        <div className="absolute top-0 left-0 right-0 z-50">
          <Navbar />
        </div>

        <div className="relative w-full h-full max-w-7xl mx-auto flex items-center justify-center z-10 pointer-events-none">
          
          {/* HERO SECTION */}
          <motion.div 
            className="absolute inset-0 items-center justify-center pointer-events-auto"
            style={{ display: heroDisplay, opacity: heroOpacity, scale: heroScale }}
          >
            <div className="w-full scale-90 md:scale-100 mt-[-10vh]">
              <Hero />
            </div>
          </motion.div>

          {/* BENTO GRID SECTION */}
          <motion.div 
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto"
            style={{ display: bentoDisplay, opacity: bentoOpacity, scale: bentoScale }}
          >
            <div className="w-full pt-10 scale-90 md:scale-100">
              <BentoGrid />
            </div>
          </motion.div>

          {/* HOW TO USE SECTION */}
          <motion.div 
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto"
            style={{ display: howToDisplay, opacity: howToOpacity, scale: howToScale }}
          >
            <div className="w-full scale-90 md:scale-100">
              <HowToUse />
            </div>
          </motion.div>

          {/* DASHBOARD SECTION */}
          <motion.div 
            className="absolute inset-0 items-center justify-center pointer-events-auto"
            style={{ display: dashDisplay, opacity: dashOpacity, scale: dashScale, rotateX: dashRotateX, perspective: "1500px" }}
          >
            <div className="w-full scale-[0.85] origin-center">
              <DashboardPreview />
            </div>
          </motion.div>

          {/* TEAM SECTION */}
          <motion.div 
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto"
            style={{ display: teamDisplay, opacity: teamOpacity, scale: teamScale }}
          >
            <div className="w-full scale-90 md:scale-100">
              <Team />
            </div>
          </motion.div>

          {/* FINAL METRICS & CTA SECTION */}
          <motion.div 
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto"
            style={{ display: finalDisplay, opacity: finalOpacity, scale: finalScale }}
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
