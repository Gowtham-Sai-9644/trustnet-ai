import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BACKGROUND_IMAGES: Record<number, string> = {
  1: '/spam_detect_1.png',
  2: '/spam_detect_2.png',
  3: '/spam_detect_3.png',
  4: '/spam_detect_4.png',
  5: '/spam_detect_1.png'
};

interface BackgroundSlideshowProps {
  activeScene: number;
  blurAmount?: string;
  opacity?: number;
}

const BackgroundSlideshow: React.FC<BackgroundSlideshowProps> = ({
  activeScene,
  blurAmount = "0px",
  opacity = 0.40, // Reduced opacity to ensure text is highly readable
}) => {
  const currentImage = BACKGROUND_IMAGES[activeScene] || BACKGROUND_IMAGES[1];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#050811]">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={activeScene}
          initial={{ opacity: 0, scale: 1.05, filter: "brightness(1.0) saturate(1.2)" }}
          animate={{ 
            opacity: opacity, 
            scale: 1.1, 
            filter: "brightness(0.6) saturate(1.2)" // Darkened the image
          }}
          exit={{ opacity: 0, scale: 1.05, filter: "brightness(0.3)" }}
          transition={{ 
            opacity: { duration: 1.2, ease: "easeInOut" },
            scale: { duration: 20, ease: "linear" },
            filter: { duration: 2 }
          }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${currentImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </AnimatePresence>

      {/* Grid overlay for tactical command center design with neon edge light feel */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 0, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      {/* Dynamic edge lighting gradient */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,255,255,0.08)]" />
      
      {/* Dark vignette overlay to ensure text contrast */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,8,17,0.7)_100%)]" />
    </div>
  );
};

export default BackgroundSlideshow;
