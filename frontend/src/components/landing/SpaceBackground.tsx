import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export const SpaceBackground: React.FC = () => {
  // Generate random stars
  const stars = useMemo(() => {
    return Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5, // 0.5px to 2.5px
      opacity: Math.random() * 0.5 + 0.3,
      duration: Math.random() * 20 + 20, // 20s to 40s
    }));
  }, []);

  // Generate random asteroids/debris
  const asteroids = useMemo(() => {
    return Array.from({ length: 10 }).map((_, i) => ({
      id: `ast-${i}`,
      startX: Math.random() * 100,
      startY: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 40 + 40,
      delay: Math.random() * 10,
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-black">
      {/* Deep Space Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(13,25,48,0.4)_0%,rgba(0,0,0,1)_100%)]" />

      {/* Moving Stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
          }}
          animate={{
            y: [0, -1000],
            opacity: [star.opacity, star.opacity * 0.2, star.opacity],
          }}
          transition={{
            y: {
              duration: star.duration,
              repeat: Infinity,
              ease: "linear",
            },
            opacity: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }
          }}
        />
      ))}

      {/* Moving Asteroids / Debris */}
      {asteroids.map((ast) => (
        <motion.div
          key={ast.id}
          className="absolute bg-teal-500/20 rounded-full blur-[1px]"
          style={{
            left: `${ast.startX}%`,
            top: `${ast.startY}%`,
            width: `${ast.size}px`,
            height: `${ast.size}px`,
          }}
          animate={{
            x: [0, Math.random() > 0.5 ? 500 : -500],
            y: [0, Math.random() > 0.5 ? 500 : -500],
            rotate: 360,
          }}
          transition={{
            duration: ast.duration,
            repeat: Infinity,
            delay: ast.delay,
            ease: "linear",
          }}
        />
      ))}
      
      {/* Ambient noise for texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
    </div>
  );
};
