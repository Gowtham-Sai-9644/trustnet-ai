import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Activity, Database, Radar } from 'lucide-react';

export const RiskVisualization: React.FC = () => {
  return (
    <section className="relative w-full py-32 flex justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6 px-6">
        
        {/* Main Risk Gauge */}
        <div className="lg:col-span-1 bg-black border border-white/10 rounded-3xl p-10 flex flex-col items-center justify-center relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-0 bg-red-900/10 blur-[80px]" />
          
          <div className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-8 self-start">Threat Risk</div>
          
          <div className="relative w-48 h-48 flex items-center justify-center mb-6">
            {/* Background Circle */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle cx="96" cy="96" r="88" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
              <motion.circle 
                cx="96" cy="96" r="88" 
                fill="none" 
                stroke="#ef4444" 
                strokeWidth="8" 
                strokeLinecap="round"
                initial={{ strokeDasharray: "553", strokeDashoffset: "553" }}
                whileInView={{ strokeDashoffset: 553 - (553 * 0.78) }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="shadow-[0_0_20px_#ef4444]"
              />
            </svg>
            <div className="text-center">
              <div className="text-6xl font-black text-white">78<span className="text-2xl text-gray-500">%</span></div>
              <div className="text-red-500 font-bold tracking-widest mt-1">HIGH</div>
            </div>
          </div>
        </div>

        {/* Signals List */}
        <div className="lg:col-span-2 bg-[#050505] border border-white/5 rounded-3xl p-10 flex flex-col">
          <div className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-8">Detected Signals</div>
          
          <div className="flex-1 flex flex-col justify-center gap-4">
            {[
              { label: "SUSPICIOUS DOMAIN", value: 92, color: "bg-red-500" },
              { label: "CREDENTIAL COLLECTION", value: 85, color: "bg-red-500" },
              { label: "UNUSUAL TLD", value: 64, color: "bg-amber-500" },
              { label: "PHISHING PATTERN", value: 88, color: "bg-red-500" }
            ].map((signal, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-48 text-xs font-mono text-gray-300">{signal.label}</div>
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${signal.value}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={`h-full ${signal.color} shadow-[0_0_10px_currentColor]`}
                  />
                </div>
                <div className="w-8 text-right text-xs font-mono text-gray-500">{signal.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between text-xs font-mono text-gray-500">
            <div className="flex items-center gap-2"><Radar className="w-4 h-4"/> Signal Analysis Complete</div>
            <div className="flex items-center gap-2"><Database className="w-4 h-4"/> Threat Intel Matched</div>
          </div>
        </div>

      </div>
    </section>
  );
};
