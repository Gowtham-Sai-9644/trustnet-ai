import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Shield, Activity, Share2, Search, ArrowRight } from 'lucide-react';

export const CommandCenterPreview: React.FC = () => {
  return (
    <section className="relative w-full py-40 overflow-hidden">
      <div className="text-center relative z-20 mb-20">
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-white">
          <span className="block text-gray-500 font-light text-4xl mb-2">FROM DETECTION</span>
          TO INVESTIGATION.
        </h2>
        <p className="text-gray-400 font-light max-w-2xl mx-auto mb-10 text-lg">
          Seamlessly transition from automated detection into a deep-dive investigation environment. Monitor risk, explore graphs, and converse with the intelligence assistant.
        </p>
        
        <Link 
          to="/console" 
          className="group inline-flex items-center gap-3 px-8 py-4 rounded-full border border-teal-500/50 bg-teal-500/10 text-sm font-bold uppercase tracking-widest text-teal-400 hover:bg-teal-500 hover:text-black transition-colors backdrop-blur-md"
        >
          ENTER COMMAND CENTER <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Console Mockup */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ margin: "-10%" }}
        className="relative max-w-6xl mx-auto px-6 z-10"
      >
        <div className="w-full rounded-t-3xl border-t border-l border-r border-white/10 bg-[#0a0a0a] shadow-[0_-20px_80px_rgba(45,212,191,0.15)] flex flex-col overflow-hidden h-[500px]">
          
          {/* Header */}
          <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-teal-500" />
              <span className="text-xs font-bold tracking-widest text-white">TRUSTNET CONSOLE</span>
            </div>
            <div className="flex gap-4 text-xs font-mono text-gray-500">
              <span className="flex items-center gap-1"><Activity className="w-3 h-3"/> MONITOR</span>
              <span className="flex items-center gap-1"><Share2 className="w-3 h-3"/> GRAPH</span>
              <span className="flex items-center gap-1"><Search className="w-3 h-3"/> ANALYSIS</span>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 flex p-6 gap-6 relative">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay" />
            
            {/* Sidebar */}
            <div className="w-48 hidden md:flex flex-col gap-2 border-r border-white/5 pr-6">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`h-8 rounded ${i === 1 ? 'bg-teal-500/10 border border-teal-500/20' : 'bg-white/5'} w-full`} />
              ))}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col gap-6">
              <div className="h-40 w-full rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 flex items-center justify-between p-8">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-white/10 rounded" />
                  <div className="h-8 w-64 bg-white/20 rounded" />
                </div>
                <div className="w-24 h-24 rounded-full border-[6px] border-teal-500/20 border-t-teal-500" />
              </div>

              <div className="flex-1 grid grid-cols-3 gap-6">
                <div className="col-span-2 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-full h-full opacity-30" viewBox="0 0 100 100">
                      <line x1="20" y1="20" x2="80" y2="80" stroke="#2dd4bf" strokeWidth="0.5" />
                      <line x1="80" y1="20" x2="20" y2="80" stroke="#2dd4bf" strokeWidth="0.5" />
                      <circle cx="20" cy="20" r="2" fill="#2dd4bf" />
                      <circle cx="80" cy="80" r="3" fill="#2dd4bf" />
                      <circle cx="80" cy="20" r="2" fill="#ef4444" />
                      <circle cx="20" cy="80" r="2" fill="#2dd4bf" />
                      <circle cx="50" cy="50" r="4" fill="#ef4444" />
                    </svg>
                  </div>
                </div>
                <div className="col-span-1 rounded-2xl bg-white/5 border border-white/5 p-4 flex flex-col gap-3">
                  <div className="h-3 w-1/2 bg-white/10 rounded" />
                  <div className="h-2 w-full bg-white/5 rounded" />
                  <div className="h-2 w-full bg-white/5 rounded" />
                  <div className="h-2 w-3/4 bg-white/5 rounded" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
      
      {/* Fade at bottom so it looks like it's emerging */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-20" />
    </section>
  );
};
