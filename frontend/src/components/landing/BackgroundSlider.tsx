import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

const backgrounds = [
  '/bg_slide_1.jpg',
  '/bg_slide_2.jpg',
  '/bg_slide_3.jpg',
  '/bg_slide_4.jpg'
];

export const BackgroundSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { theme } = useTheme();

  useEffect(() => {
    if (theme !== 'glass') return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [theme]);

  if (theme !== 'glass') return null;

  return (
    <div className="fixed inset-0 z-[-1] bg-slate-900 overflow-hidden">
      <AnimatePresence>
        {backgrounds.map((bg, idx) => {
          if (idx !== currentSlide) return null;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 2 }, scale: { duration: 8, ease: "linear" } }}
              className="absolute inset-0"
            >
              <img src={bg} alt="Background" className="w-full h-full object-cover opacity-80" />
            </motion.div>
          );
        })}
      </AnimatePresence>
      {/* Universal frosted glass overlay to reduce glare and ensure text readability */}
      <div className="absolute inset-0 bg-black/5 backdrop-blur-[12px]"></div>
    </div>
  );
};
