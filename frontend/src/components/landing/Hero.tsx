import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ScanLine, CheckCircle2 } from 'lucide-react';

export const Hero: React.FC = () => {
  const [bootSequence, setBootSequence] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setBootSequence(1), 500);
    const timer2 = setTimeout(() => setBootSequence(2), 1500);
    const timer3 = setTimeout(() => setBootSequence(3), 2500);
    const timer4 = setTimeout(() => setBootSequence(4), 3500);
    const timer5 = setTimeout(() => setBootSequence(5), 4500);

    return () => {
      clearTimeout(timer1); clearTimeout(timer2);
      clearTimeout(timer3); clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, []);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-20">
      
      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-8 z-10">
        
        {/* LEFT / CENTER: Typography and Actions */}
        <div className="w-full lg:w-5/12 flex flex-col items-center lg:items-start text-center lg:text-left z-20">
          
          {/* System Telemetry */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: bootSequence >= 5 ? 1 : 0, y: bootSequence >= 5 ? 0 : 10 }}
            transition={{ duration: 1 }}
            className="flex flex-col gap-2 text-[9px] font-mono tracking-widest text-teal-500/70 mb-6 bg-black/40 p-4 rounded-xl border border-teal-500/10 backdrop-blur-md"
          >
            <div className="text-white font-bold mb-1">TRUSTNET AI // INTELLIGENCE CORE</div>
            <div className="flex flex-wrap lg:flex-col gap-x-4 gap-y-2 justify-center lg:justify-start">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-teal-400"/> SYSTEM OPERATIONAL</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-teal-400"/> MULTIMODAL ANALYSIS</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-teal-400"/> RISK ENGINE ONLINE</span>
            </div>
          </motion.div>

          {/* Typography - Scaled Down for better readability */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: bootSequence >= 5 ? 1 : 0, y: bootSequence >= 5 ? 0 : 20 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] mb-6 drop-shadow-2xl"
          >
            <span className="block text-white">SEE THE THREAT.</span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-600">BEFORE IT BECOMES</span>
            <span className="block text-gray-500">AN INCIDENT.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: bootSequence >= 5 ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-sm sm:text-base text-gray-300 max-w-lg mb-10 font-light leading-relaxed drop-shadow-md"
          >
            Detect, investigate, explain, and understand digital threats across URLs, domains, IPs, phone numbers, UPI, messages, and QR codes.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: bootSequence >= 5 ? 1 : 0, y: bootSequence >= 5 ? 0 : 20 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex flex-col xl:flex-row items-center lg:items-start gap-4 w-full sm:w-auto"
          >
            <a 
              href="#vectors" 
              className="w-full sm:w-auto group relative px-6 py-4 bg-teal-500 text-black rounded-full font-bold uppercase tracking-widest text-[11px] hover:bg-teal-400 transition-all duration-500 flex items-center justify-center gap-3 overflow-hidden shadow-[0_0_30px_rgba(45,212,191,0.3)] whitespace-nowrap"
            >
              <ScanLine className="w-4 h-4" />
              <span>SCAN A THREAT &rarr;</span>
            </a>
            <Link 
              to="/console" 
              className="w-full sm:w-auto group flex items-center justify-center gap-2 px-6 py-4 rounded-full border border-white/20 bg-black/50 text-[11px] font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-colors backdrop-blur-xl whitespace-nowrap"
            >
              ENTER COMMAND CENTER &rarr;
            </Link>
          </motion.div>
        </div>

        {/* RIGHT / CENTER: Intelligence Visualization - Scaled Up */}
        <div className="w-full lg:w-7/12 h-[500px] sm:h-[600px] flex items-center justify-center relative z-10 scale-90 sm:scale-100 lg:scale-110 xl:scale-125">
          
          {/* Grid / Radar activates */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: bootSequence >= 1 ? 1 : 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="absolute w-[600px] h-[600px] border border-white/5 rounded-full" />
            <div className="absolute w-[450px] h-[450px] border border-teal-500/10 rounded-full" />
            <div className="absolute w-[300px] h-[300px] border border-blue-500/10 rounded-full border-dashed" />
            
            {/* Sweeping radar */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute w-[600px] h-[600px] border-r border-teal-500/20 rounded-full"
            />
          </motion.div>

          {/* Central Node & Threat Nodes */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: bootSequence >= 2 ? 1 : 0, opacity: bootSequence >= 2 ? 1 : 0 }}
              transition={{ type: "spring", duration: 1.5 }}
              className="relative w-24 h-24 bg-black rounded-full border border-teal-500/50 shadow-[0_0_60px_rgba(45,212,191,0.25)] flex items-center justify-center z-20"
            >
              <div className="absolute inset-0 bg-teal-500/10 rounded-full animate-ping opacity-20" />
              <span className="text-[10px] font-bold tracking-widest text-teal-400 uppercase text-center">TrustNet<br/>AI</span>
            </motion.div>

            {/* Orbiting Threat Nodes */}
            {['URL', 'DOMAIN', 'IP', 'PHONE', 'UPI', 'MESSAGE', 'QR'].map((node, i) => {
              const angle = (i * (360 / 7)) * (Math.PI / 180);
              const radius = 220; // Increased radius for larger visual
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <motion.div
                  key={node}
                  initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                  animate={{ 
                    scale: bootSequence >= 3 ? 1 : 0, 
                    opacity: bootSequence >= 3 ? 1 : 0,
                    x: bootSequence >= 3 ? x : 0,
                    y: bootSequence >= 3 ? y : 0
                  }}
                  transition={{ type: "spring", duration: 1.5, delay: i * 0.1 }}
                  className="absolute flex items-center justify-center z-20"
                >
                  <div className="w-12 h-12 bg-black border border-white/20 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.08)] backdrop-blur-md">
                    <span className="text-[8px] font-mono text-gray-300">{node}</span>
                  </div>
                  
                  {/* Connection lines to center */}
                  <motion.svg
                    initial={{ opacity: 0 }}
                    animate={{ opacity: bootSequence >= 4 ? 0.4 : 0 }}
                    className="absolute w-[600px] h-[600px] pointer-events-none"
                    style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: -1 }}
                  >
                    {/* SVG Center is 300, 300 */}
                    <line x1="300" y1="300" x2={300 - x} y2={300 - y} stroke="#2dd4bf" strokeWidth="1.5" strokeDasharray="4 4" />
                  </motion.svg>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
