import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import { Hero } from '../components/landing/Hero';
import { BentoGrid } from '../components/landing/BentoGrid';
import { HowToUse } from '../components/landing/HowToUse';
import { DashboardPreview } from '../components/landing/DashboardPreview';
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

  // --- Metrics & CTA Animations (0.80 to 1) ---
  const finalOpacity = useTransform(scrollYProgress, [0.80, 0.85, 1], [0, 1, 1]);
  const finalScale = useTransform(scrollYProgress, [0.80, 0.85, 1], [0.8, 1, 1]);
  const finalDisplay = useTransform(scrollYProgress, [0.79, 0.80], ["none", "flex"]);

  return (
    <div ref={containerRef} className="relative h-[1000vh] bg-landing-bg text-landing-text">
      {/* The Sticky Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center pt-16">
        <AnimatedBackground />
        
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
