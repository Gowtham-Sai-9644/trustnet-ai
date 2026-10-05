import React from 'react';
import { motion } from 'framer-motion';
import { Database, Search, FileText } from 'lucide-react';

export const RagSection: React.FC = () => {
  return (
    <section id="rag" className="relative w-full py-32 border-t border-white/5">
      <div className="flex flex-col md:flex-row-reverse justify-between items-center gap-16">
        
        <div className="w-full md:w-1/2 space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Grounded by Reality.</h2>
          <p className="text-lg text-gray-400 font-light leading-relaxed">
            TrustNet dynamically constructs RAG (Retrieval-Augmented Generation) queries based purely on extracted evidence indicators, querying local vector databases for real-world threat reports.
          </p>
          <div className="space-y-4 pt-4">
            {[
              "Dynamic Threat Query Construction",
              "Local Vector Database Search",
              "Similarity Threshold Filtering",
              "Grounded Narrative Generation"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-4 text-sm font-medium text-white/70">
                <div className="w-6 h-px bg-teal-500" /> {feature}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-[#0a0a0a] rounded-3xl p-8 border border-white/10 relative overflow-hidden h-[400px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
          
          <div className="h-full flex flex-col justify-between relative z-10">
            {/* Top Query */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 w-3/4"
            >
              <Search className="w-4 h-4 text-gray-400" />
              <div className="text-xs font-mono text-gray-400">"typosquatting brand impersonation phishing"</div>
            </motion.div>

            {/* Middle DB Search */}
            <div className="flex flex-col items-center justify-center my-8">
              <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent relative">
                <motion.div animate={{ y: [0, 48] }} transition={{ duration: 1, repeat: Infinity }} className="absolute w-1 h-3 bg-teal-400 left-1/2 -translate-x-1/2 rounded-full" />
              </div>
              <Database className="w-10 h-10 text-white/40 my-4" />
              <div className="w-px h-12 bg-gradient-to-t from-white/20 to-transparent relative">
                <motion.div animate={{ y: [48, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0.5 }} className="absolute w-1 h-3 bg-blue-400 left-1/2 -translate-x-1/2 rounded-full" />
              </div>
            </div>

            {/* Bottom Result */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-start gap-4 p-5 bg-teal-900/20 rounded-xl border border-teal-500/30 self-end w-5/6 backdrop-blur-md"
            >
              <FileText className="w-5 h-5 text-teal-400 mt-1 shrink-0" />
              <div>
                <div className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-1">phishing_credential_theft.md</div>
                <div className="text-xs text-teal-100/70 font-light leading-relaxed">
                  "Phishing attacks are malicious attempts to acquire sensitive information by masquerading as a trustworthy entity..."
                </div>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
};
