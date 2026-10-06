import React from 'react';
import { motion } from 'framer-motion';

export const HowItWorks: React.FC = () => {
  return (
    <section className="relative w-full py-32 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-center gap-16">
        
        {/* Text Side */}
        <div className="w-full md:w-1/2 space-y-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Deterministic. <br/> Not generative.</h2>
            <p className="text-lg text-gray-400 font-light leading-relaxed">
              LLMs are powerful, but they hallucinate risk. TrustNet separates detection from explanation. Our core engine mathematically extracts features—from lexical entropy to structural numbering anomalies—calculating absolute risk. 
            </p>
          </div>
          <div>
            <p className="text-lg text-gray-400 font-light leading-relaxed">
              Only after the threat is mathematically proven does the intelligence layer engage, retrieving verified context to explain the attack vector.
            </p>
          </div>
        </div>

        {/* Visual Side */}
        <div className="w-full md:w-1/2 relative h-[400px] flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-l from-teal-500/10 to-transparent rounded-full blur-[80px]" />
          
          <div className="relative w-full max-w-sm">
            {/* Layer 1: Data */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-20 left-10 p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md shadow-2xl z-20"
            >
              <div className="text-[10px] uppercase font-mono text-app-text/50 mb-2">Lexical Entropy</div>
              <div className="text-xl font-bold font-mono">3.83</div>
            </motion.div>

            {/* Layer 2: Core Matrix */}
            <div className="w-full aspect-square border border-white/10 rounded-full flex items-center justify-center relative z-10">
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="w-3/4 h-3/4 border border-dashed border-teal-500/40 rounded-full"
              />
            </div>

            {/* Layer 3: Risk Score */}
            <motion.div 
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 right-10 p-6 bg-black border border-white/10 rounded-2xl backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-30"
            >
              <div className="text-[10px] uppercase font-mono text-teal-500 mb-2">Absolute Risk</div>
              <div className="text-4xl font-bold font-mono">85<span className="text-lg text-app-text/30">%</span></div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
