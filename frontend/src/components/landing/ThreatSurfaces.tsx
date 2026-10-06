import React from 'react';
import { motion } from 'framer-motion';
import { Link2, Globe, Server, Phone, CreditCard, MessageSquare, QrCode } from 'lucide-react';

const SURFACES = [
  { id: 'url', name: 'URL Analysis', icon: Link2, desc: 'Deep lexical inspection and typosquatting detection.' },
  { id: 'domain', name: 'Domain Intel', icon: Globe, desc: 'Reputation scoring and TLD risk assessment.' },
  { id: 'ip', name: 'IP Profiling', icon: Server, desc: 'Infrastructure threat vectors and origin tracing.' },
  { id: 'phone', name: 'Telecom Fraud', icon: Phone, desc: 'SMS routing and structural numbering anomalies.' },
  { id: 'upi', name: 'UPI Lures', icon: CreditCard, desc: 'VPA inspection for refund and cashback fraud.' },
  { id: 'message', name: 'Payload NLP', icon: MessageSquare, desc: 'Contextual urgency and scam narrative detection.' },
  { id: 'qr', name: 'QR Extraction', icon: QrCode, desc: 'Deep payload extraction from physical codes.' }
];

export const ThreatSurfaces: React.FC = () => {
  return (
    <section id="vectors" className="relative w-full py-32">
      <div className="mb-20">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 uppercase">
          One Intelligence Layer.<br/>
          <span className="text-gray-500">Multiple Threat Vectors.</span>
        </h2>
        <p className="text-gray-400 font-light max-w-2xl mt-6">
          Every vector processed through a unified heuristic detection and RAG grounding pipeline.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {SURFACES.map((surface, i) => (
          <motion.div
            key={surface.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 overflow-hidden backdrop-blur-sm cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <surface.icon className="w-8 h-8 text-app-text/50 mb-6 group-hover:text-teal-400 transition-colors" />
            <h3 className="text-xl font-medium mb-3 text-app-text/90 group-hover:text-app-text transition-colors">{surface.name}</h3>
            <p className="text-sm text-gray-500 font-light leading-relaxed group-hover:text-gray-400 transition-colors">{surface.desc}</p>

            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity duration-500 translate-x-4 group-hover:translate-x-0">
              <surface.icon className="w-24 h-24 text-teal-500" />
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Background connecting lines for the "universe" feel */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <svg className="w-full h-full opacity-10">
          <path d="M 0 200 Q 300 100 600 300 T 1200 200" stroke="#2dd4bf" strokeWidth="2" fill="none" />
          <path d="M 0 500 Q 400 600 800 400 T 1200 500" stroke="#3b82f6" strokeWidth="2" fill="none" />
        </svg>
      </div>
    </section>
  );
};
