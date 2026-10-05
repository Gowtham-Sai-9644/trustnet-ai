import React from 'react';
import { motion } from 'framer-motion';
import { Crosshair } from 'lucide-react';

export const ThreatRadar: React.FC = () => {
  return (
    <section className="relative w-full py-40 overflow-hidden flex flex-col items-center">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-teal-900/5 to-transparent pointer-events-none" />
      
      <div className="text-center relative z-10 mb-20">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">Live Global Radar.</h2>
        <p className="text-gray-400 font-light max-w-2xl mx-auto mb-4">
          Continuously scanning the threat horizon. Monitoring interconnected signals across telecommunications, infrastructure, and financial networks.
        </p>
        <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-gray-500 uppercase tracking-widest">
          THREAT LANDSCAPE SIMULATION
        </div>
      </div>

      <div className="relative w-[800px] h-[800px] flex items-center justify-center perspective-1000">
        <motion.div 
          style={{ transformStyle: "preserve-3d", rotateX: 60 }} 
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* Radar Rings */}
          {[1, 2, 3, 4, 5].map((ring) => (
            <div 
              key={ring} 
              className="absolute rounded-full border border-teal-500/20"
              style={{ width: `${ring * 150}px`, height: `${ring * 150}px` }}
            />
          ))}

          {/* Radar Sweep */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute w-1/2 h-1/2 origin-bottom-right right-1/2 bottom-1/2 bg-gradient-to-br from-transparent via-teal-500/10 to-teal-400/30 border-r-2 border-teal-400 rounded-tl-full"
          />

          {/* Random Threat Blips */}
          {[
            { top: '30%', left: '40%', color: 'bg-red-500', label: 'PHISHING' },
            { top: '65%', left: '70%', color: 'bg-amber-500', label: 'UPI FRAUD' },
            { top: '55%', left: '30%', color: 'bg-teal-500', label: 'BOTNET' },
            { top: '40%', left: '75%', color: 'bg-red-500', label: 'MALWARE' },
            { top: '20%', left: '60%', color: 'bg-amber-500', label: 'SOCIAL ENGINEERING' },
            { top: '80%', left: '40%', color: 'bg-red-500', label: 'MALICIOUS DOMAIN' }
          ].map((blip, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0.5, 0], scale: [0.5, 1.5, 1, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 0.7 }}
              className="absolute flex flex-col items-center"
              style={{ top: blip.top, left: blip.left, transform: 'rotateX(-60deg)' }}
            >
              <div className={`w-2 h-2 rounded-full ${blip.color} shadow-[0_0_15px_currentColor]`} />
              <span className={`text-[10px] font-mono mt-2 ${blip.color.replace('bg-', 'text-')}`}>{blip.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Center Target (Not tilted) */}
        <div className="absolute flex items-center justify-center z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-16 h-16 bg-black rounded-full border border-teal-500 shadow-[0_0_30px_rgba(45,212,191,0.3)] flex items-center justify-center">
            <Crosshair className="w-6 h-6 text-teal-400" />
          </div>
        </div>
      </div>
    </section>
  );
};
