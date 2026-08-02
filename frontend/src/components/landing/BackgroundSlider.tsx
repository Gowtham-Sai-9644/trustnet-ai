import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Rich set of vibrant background images available in public folder
const backgrounds = [
  '/cyber_mesh_bg.png',
  '/scene1_threat_landscape.png',
  '/digital_world_telemetry.png',
  '/scam_nodes_bg.png',
  '/ai_investigation_center.png',
  '/scene2_ingestion_scanner.png',
  '/fraud_network.png',
  '/scene3_relationship_forensics.png'
];

export const BackgroundSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Shift every 2 seconds as requested by the user
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgrounds.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden" style={{ background: '#080c16' }}>
      <AnimatePresence mode="wait">
        {backgrounds.map((bg, idx) => {
          if (idx !== currentSlide) return null;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 0.6 }, scale: { duration: 2.2, ease: 'linear' } }}
              className="absolute inset-0"
            >
              <img src={bg} alt="Vibrant Background" className="w-full h-full object-cover saturate-150 contrast-110 opacity-40" />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Dark Aether overlay to ensure text readability while maintaining atmosphere */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(13, 20, 36, 0.6) 0%, rgba(8, 12, 22, 0.95) 100%)',
        }}
      />

      {/* Subtle tech circuit texture */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="circuit" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 40 30 M 40 50 L 40 80 M 0 40 L 30 40 M 50 40 L 80 40" stroke="#00E5FF" strokeWidth="1" fill="none"/>
            <circle cx="40" cy="40" r="4" fill="none" stroke="#00E5FF" strokeWidth="1"/>
            <circle cx="40" cy="0" r="2" fill="#00E5FF"/>
            <circle cx="40" cy="80" r="2" fill="#00E5FF"/>
            <circle cx="0" cy="40" r="2" fill="#00E5FF"/>
            <circle cx="80" cy="40" r="2" fill="#00E5FF"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit)"/>
      </svg>
    </div>
  );
};
