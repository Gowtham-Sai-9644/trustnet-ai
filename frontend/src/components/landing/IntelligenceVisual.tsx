import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, Brain, Fingerprint, Activity, Database, CheckCircle } from 'lucide-react';

const INPUTS = ['URL', 'DOMAIN', 'IP', 'PHONE', 'UPI', 'MESSAGE', 'QR'];

export const IntelligenceVisual: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section id="system" ref={containerRef} className="relative w-full py-32 flex flex-col items-center justify-center">
      <div className="text-center mb-24 relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">The Intelligence Pipeline</h2>
        <p className="text-gray-400 max-w-2xl mx-auto font-light">
          A continuous flow of multi-modal threat vectors processed in real-time through heuristic detection and RAG grounding.
        </p>
      </div>

      <motion.div style={{ scale, opacity }} className="relative w-full max-w-5xl mx-auto h-[600px] flex items-center justify-center">
        
        {/* Abstract Data Streams (Left side: Inputs) */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-6">
          {INPUTS.map((type, i) => (
            <motion.div 
              key={type}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-end w-32 relative"
            >
              <span className="text-[10px] font-mono tracking-widest text-app-text/50 bg-white/5 px-3 py-1 rounded-full border border-white/10 z-10">{type}</span>
              {/* Connecting line to center */}
              <div className="absolute right-0 top-1/2 w-48 h-px bg-gradient-to-r from-transparent via-white/20 to-teal-500/50 transform translate-x-full" style={{ rotate: `${(i - 3) * 10}deg`, transformOrigin: "left center" }} />
              
              {/* Animated Particle traveling along the line */}
              <motion.div
                animate={{ x: [0, 200] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3, ease: "linear" }}
                className="absolute right-0 top-1/2 w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_10px_#2dd4bf] -translate-y-1/2 z-20"
                style={{ rotate: `${(i - 3) * 10}deg`, transformOrigin: "left center" }}
              />
            </motion.div>
          ))}
        </div>

        {/* Center: TRUSTNET AI Core */}
        <div className="relative z-30 flex items-center justify-center w-64 h-64">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-2 border-dashed border-teal-500/30 rounded-full"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 border border-blue-500/20 rounded-full"
          />
          <div className="absolute inset-8 bg-black rounded-full shadow-[0_0_80px_rgba(45,212,191,0.2)] flex items-center justify-center border border-white/10 backdrop-blur-xl">
            <div className="text-center">
              <Shield className="w-10 h-10 text-app-text mx-auto mb-2" />
              <div className="font-bold tracking-widest text-sm">TRUSTNET</div>
              <div className="text-[9px] text-teal-400 font-mono mt-1">CORE ENGINE</div>
            </div>
          </div>
        </div>

        {/* Right side: Pipeline Stages */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
          
          <div className="w-32 h-px bg-gradient-to-r from-teal-500/50 to-white/20 relative">
             <motion.div animate={{ x: [0, 128] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_15px_white]" />
          </div>

          <div className="flex gap-8 relative z-10">
            {[
              { icon: Activity, label: 'DETECTION' },
              { icon: Database, label: 'THREAT INTEL' },
              { icon: Fingerprint, label: 'EVIDENCE' },
              { icon: CheckCircle, label: 'VERDICT' }
            ].map((stage, i) => (
              <div key={stage.label} className="flex flex-col items-center gap-4 relative">
                {i > 0 && <div className="absolute top-6 -left-8 w-8 h-px bg-white/20" />}
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: 0.5 + (i * 0.2), type: "spring" }}
                  className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md"
                >
                  <stage.icon className="w-5 h-5 text-app-text/70" />
                </motion.div>
                <div className="text-[9px] font-mono tracking-widest text-app-text/50">{stage.label}</div>
              </div>
            ))}
          </div>

        </div>
      </motion.div>
    </section>
  );
};
