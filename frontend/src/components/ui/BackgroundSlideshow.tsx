import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BACKGROUND_IMAGES: Record<number, string> = {
  1: '/scene1_threat_landscape.png',
  2: '/scene2_ingestion_scanner.png',
  3: '/scene3_relationship_forensics.png',
  4: '/scene4_explainable_ai.png',
  5: '/scene5_mitigation_protocol.png'
};

interface BackgroundSlideshowProps {
  activeScene: number;
  blurAmount?: string;
  opacity?: number;
}

const BackgroundSlideshow: React.FC<BackgroundSlideshowProps> = ({
  activeScene,
  blurAmount = "0px", // Crisp by default
  opacity = 0.35, // Clear visibility but still contrast-friendly for text
}) => {
  const currentImage = BACKGROUND_IMAGES[activeScene] || BACKGROUND_IMAGES[1];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#050811]">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={activeScene}
          initial={{ opacity: 0, scale: 1.02, x: -4, y: -4 }}
          animate={{ 
            opacity: opacity, 
            scale: 1.08, 
            x: 4,
            y: 4
          }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ 
            opacity: { duration: 1.0, ease: "easeInOut" },
            scale: { duration: 18, ease: "easeOut" },
            x: { duration: 18, ease: "easeInOut" },
            y: { duration: 18, ease: "easeInOut" }
          }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${currentImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'none',
          }}
        />
      </AnimatePresence>

      {/* Grid overlay for tactical command center design */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 229, 255, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 229, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
};

export default BackgroundSlideshow;
