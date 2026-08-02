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
    <div className="fixed inset-0 z-[-1] overflow-hidden" style={{ background: '#10172A' }}>
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
              <img src={bg} alt="Vibrant Background" className="w-full h-full object-cover saturate-150 contrast-110" />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Balanced cream/amber overlay to retain vibrant background visuals while ensuring dark text readability */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255, 252, 245, 0.75) 0%, rgba(255, 248, 235, 0.90) 100%)',
        }}
      />

      {/* Subtle tech circuit texture */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="circuit" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 40 30 M 40 50 L 40 80 M 0 40 L 30 40 M 50 40 L 80 40" stroke="#7C5C2E" strokeWidth="1" fill="none"/>
            <circle cx="40" cy="40" r="4" fill="none" stroke="#7C5C2E" strokeWidth="1"/>
            <circle cx="40" cy="0" r="2" fill="#7C5C2E"/>
            <circle cx="40" cy="80" r="2" fill="#7C5C2E"/>
            <circle cx="0" cy="40" r="2" fill="#7C5C2E"/>
            <circle cx="80" cy="40" r="2" fill="#7C5C2E"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit)"/>
      </svg>
    </div>
  );
};
