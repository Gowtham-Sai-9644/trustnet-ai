import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ShieldAlert, Activity } from 'lucide-react';

const TICKER_ITEMS = [
  "PHISHING SIGNAL DETECTED: aws-login-verify.com",
  "UPI FRAUD PATTERN: refund-desk@ybl",
  "SUSPICIOUS DOMAIN: 0-day registrations",
  "QR PAYMENT ANOMALY: dynamic payload injection",
  "SOCIAL ENGINEERING SIGNAL: urgency context matched",
  "THREAT INTELLIGENCE MATCH: credential harvester",
  "NETWORK ANOMALY: DGA domain structure",
  "SYNTHETIC SCAM: AI-generated coercion text"
];

export const ThreatTicker: React.FC = () => {
  return (
    <div className="w-full bg-teal-950/40 border-y border-teal-500/20 py-3 overflow-hidden flex items-center relative z-20 backdrop-blur-md">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10" />
      
      <div className="flex items-center px-4 border-r border-teal-500/30 bg-black/50 absolute left-0 z-20 h-full backdrop-blur-xl">
        <Activity className="w-4 h-4 text-teal-400 mr-2 animate-pulse" />
        <span className="text-[10px] font-bold tracking-widest uppercase text-teal-400">Live Telemetry</span>
      </div>

      <motion.div
        animate={{ x: [0, -2000] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="flex items-center whitespace-nowrap pl-48"
      >
        {/* Duplicate items for infinite scroll effect */}
        {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <div key={i} className="flex items-center mx-6 opacity-60 hover:opacity-100 transition-opacity">
            {i % 3 === 0 ? (
              <AlertTriangle className="w-3 h-3 text-red-400 mr-2" />
            ) : (
              <ShieldAlert className="w-3 h-3 text-amber-400 mr-2" />
            )}
            <span className="text-xs font-mono text-gray-300 tracking-wider">{item}</span>
            <span className="mx-6 text-teal-500/30">|</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
