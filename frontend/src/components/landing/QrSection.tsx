import React from 'react';
import { motion } from 'framer-motion';
import { QrCode, Scan } from 'lucide-react';

export const QrSection: React.FC = () => {
  return (
    <section className="relative w-full py-32">
      <div className="bg-[#050505] border border-white/5 rounded-[3rem] p-12 md:p-20 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
        
        <div className="flex flex-col md:flex-row items-center gap-16 relative z-10">
          
          <div className="w-full md:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8">
              <Scan className="w-4 h-4 text-gray-400" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Physical & Digital</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Omni-channel Intelligence.</h2>
            <p className="text-gray-400 font-light leading-relaxed mb-8">
              Scams don't just exist in the browser. TrustNet seamlessly handles multimodal inputs—from scanning physical QR codes to analyzing uploaded screenshots of suspicious messages.
            </p>
          </div>

          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative">
              {/* QR Scanner Animation */}
              <div className="w-64 h-64 border border-white/20 rounded-3xl flex items-center justify-center relative overflow-hidden bg-black/50 backdrop-blur-xl">
                <QrCode className="w-32 h-32 text-white/20" />
                
                {/* Scanning line */}
                <motion.div 
                  animate={{ y: [-130, 130, -130] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute w-full h-[2px] bg-teal-400 shadow-[0_0_20px_#2dd4bf]"
                />
              </div>

              {/* Data Extraction Particles */}
              <motion.div 
                animate={{ y: -50, opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-10 -right-10 bg-white/10 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-md"
              >
                <div className="text-xs font-mono text-teal-300">Payload Extracted</div>
              </motion.div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};
