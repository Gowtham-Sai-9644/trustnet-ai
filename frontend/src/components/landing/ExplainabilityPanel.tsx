import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TerminalSquare, CheckCircle2 } from 'lucide-react';

export const ExplainabilityPanel: React.FC = () => {
  return (
    <section className="relative w-full py-32 flex flex-col items-center">
      <div className="text-center mb-16 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Why did TrustNet flag this?</h2>
        <p className="text-gray-400 font-light max-w-2xl mx-auto">
          Every verdict is fully explainable. We separate deterministic detection from LLM explanation to ensure risk scores are never hallucinated.
        </p>
      </div>

      <div className="w-full max-w-5xl bg-black border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-[0_0_80px_rgba(0,0,0,0.8)] relative">
        
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-900/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Left Side: Score & Signals */}
        <div className="w-full md:w-1/3 p-10 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-center bg-white/[0.01]">
          <div className="text-xs font-bold tracking-widest text-gray-500 mb-6 uppercase flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" /> Risk Assessment
          </div>
          
          <div className="mb-8">
            <span className="text-5xl font-black text-red-500 tracking-tighter uppercase">High</span>
          </div>

          <div className="text-xs font-bold tracking-widest text-gray-500 mb-4 uppercase">
            Detected Signals
          </div>
          <div className="space-y-4">
            {[
              "Suspicious domain pattern",
              "Credential collection indicator",
              "Unusual TLD",
              "Phishing behavior"
            ].map((indicator, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3 text-xs font-mono text-gray-400"
              >
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" /> {indicator}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Side: Explanation */}
        <div className="w-full md:w-2/3 p-10 flex flex-col">
          <div className="text-xs font-bold tracking-widest text-gray-500 mb-6 uppercase flex items-center gap-2">
            <TerminalSquare className="w-4 h-4 text-teal-500" /> Threat Intelligence
          </div>

          <div className="flex-1 bg-black/50 border border-white/5 rounded-xl p-6 font-mono text-sm text-gray-300 leading-loose relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-teal-500/50" />
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              Supporting evidence retrieved from the TrustNet knowledge base.
              <br/><br/>
              <span className="text-teal-400">Analysis:</span> The submitted URL exhibits structural characteristics consistent with credential harvesting. Lexical entropy exceeds the safe threshold for legitimate portals.
              <br/><br/>
              <span className="text-amber-400">Evidence:</span> Cross-referencing threat intelligence confirms the payload matches known phishing templates currently tracked in the database.
              <br/><br/>
              <span className="text-red-400">Action:</span> Block immediately. Do not enter credentials.
            </motion.div>
            
            {/* Blinking cursor */}
            <motion.div 
              animate={{ opacity: [0, 1, 0] }} 
              transition={{ duration: 0.8, repeat: Infinity }} 
              className="inline-block w-2 h-4 bg-teal-400 ml-2 align-middle"
            />
          </div>
        </div>

      </div>
    </section>
  );
};
