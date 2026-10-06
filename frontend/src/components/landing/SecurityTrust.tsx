import React from 'react';
import { ShieldCheck, Eye, Zap, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const STATEMENTS = [
  { icon: ShieldCheck, title: "VERIFY THE SIGNAL", desc: "Don't guess if a link is safe. Use deterministic extraction to prove it." },
  { icon: Eye, title: "UNDERSTAND THE RISK", desc: "See exactly why a threat is flagged with transparent scoring." },
  { icon: Zap, title: "SEE THE EVIDENCE", desc: "Every verdict is backed by retrieved real-world threat intelligence." },
  { icon: Lock, title: "ACT WITH CONFIDENCE", desc: "Block scams before they result in financial or data loss." }
];

export const SecurityTrust: React.FC = () => {
  return (
    <section className="relative w-full py-32 bg-black border-y border-white/5">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-20 text-center">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
            Before you <span className="text-gray-500">click.</span> <br/>
            Before you <span className="text-gray-500">pay.</span> <br/>
            Before you <span className="text-teal-500">trust.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STATEMENTS.map((s, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center p-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <s.icon className="w-8 h-8 text-app-text" />
              </div>
              <h3 className="text-sm font-bold tracking-widest uppercase mb-3 text-app-text">{s.title}</h3>
              <p className="text-sm text-gray-500 font-light leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
