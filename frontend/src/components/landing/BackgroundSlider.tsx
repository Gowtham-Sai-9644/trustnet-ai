import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Use more abstract/network backgrounds
const backgrounds = [
  '/cyber_mesh_bg.png',
  '/scene1_threat_landscape.png',
  '/scam_nodes_bg.png',
  '/digital_world_telemetry.png',
  '/ai_investigation_center.png'
];

export const BackgroundSlider: React.FC<{ themeContext?: 'landing' | 'soc' | 'navy' | 'light' | 'blue' | 'radiant' | 'sapphire' | 'velvet' | 'dark' | 'emerald' }> = ({ themeContext = 'landing' }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // 30 second transitions for slow, subtle movement
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgrounds.length);
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#050B18]">
      <AnimatePresence mode="popLayout">
        {backgrounds.map((bg, idx) => {
          if (idx !== currentSlide) return null;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 1.05, y: 0 }}
              animate={{ opacity: 0.04, scale: 1.15, y: -20 }}
              exit={{ opacity: 0 }}
              transition={{ 
                opacity: { duration: 4, ease: "easeInOut" },
                scale: { duration: 40, ease: "linear" },
                y: { duration: 40, ease: "linear" }
              }}
              className="absolute inset-0"
            >
              <img src={bg} alt="Intelligence Background" className="w-full h-full object-cover mix-blend-screen" />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Navy Command Center Overlay to push opacity down to 0.04 - 0.12 visually */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'transparent'
        }}
      />

      {/* Subtle Data Grid overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="secops-grid" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#60A5FA" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#secops-grid)"/>
      </svg>
    </div>
  );
};

