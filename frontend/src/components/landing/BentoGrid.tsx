import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, MessageSquare, Network, BarChart3, ShieldCheck, Zap } from 'lucide-react';

export const BentoGrid: React.FC = () => {
  return (
    <section className="py-24 px-6 md:px-12 bg-transparent" id="features">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-app-text tracking-tight mb-16 text-center">
          Intelligence at every layer.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
          {/* Card 1 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-2 bg-app-card border border-app-border backdrop-blur-md rounded-3xl p-8 border border-app-border shadow-[0_4px_20px_rgb(0,0,0,0.03)] relative overflow-hidden group"
          >
            <div className="relative z-10 w-2/3">
              <div className="bg-violet-100 text-violet-600 p-3 rounded-xl inline-block mb-4">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-app-text mb-3">Fake Review Detection</h3>
              <p className="text-app-muted leading-relaxed">
                Our proprietary ensemble models analyze lexical patterns, semantic entropy, and timestamp anomalies to detect artificially generated text instantly.
              </p>
            </div>
            {/* Visual element */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-violet-50 rounded-full border border-violet-100 group-hover:scale-110 transition-transform duration-500" />
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-1 bg-app-card border border-app-border backdrop-blur-md rounded-3xl p-8 border border-app-border shadow-[0_4px_20px_rgb(0,0,0,0.03)] relative overflow-hidden group"
          >
             <div className="bg-fuchsia-100 text-fuchsia-600 p-3 rounded-xl inline-block mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-app-text mb-3">Sentiment Analysis</h3>
              <p className="text-app-muted text-sm">
                Fine-tuned RoBERTa models extract highly nuanced emotional sentiment beyond simple star ratings.
              </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-1 bg-app-card border border-app-border backdrop-blur-md rounded-3xl p-8 border border-app-border shadow-[0_4px_20px_rgb(0,0,0,0.03)] relative overflow-hidden group"
          >
             <div className="bg-emerald-100 text-emerald-600 p-3 rounded-xl inline-block mb-4">
                <Network className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-app-text mb-3">RAG Search</h3>
              <p className="text-app-muted text-sm">
                Vector-based semantic search to find contradictory reviews from the same IP or account cluster.
              </p>
          </motion.div>

          {/* Card 4 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-2 bg-app-btn-bg text-app-btn-text rounded-3xl p-8 border border-slate-800 shadow-[0_12px_40px_rgb(0,0,0,0.06)] relative overflow-hidden group"
          >
             <div className="relative z-10 w-2/3">
              <div className="bg-slate-800 text-app-btn-text p-3 rounded-xl inline-block mb-4 border border-slate-700">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Trust Score Engine</h3>
              <p className="text-slate-400 leading-relaxed">
                We output a highly calibrated Trust Score. Don't just block or approve—understand the probabilistic risk level of every single user interaction.
              </p>
            </div>
            <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-blue-500/20 to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
