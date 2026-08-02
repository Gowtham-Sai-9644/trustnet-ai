import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, PlayCircle, ShieldCheck } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden px-6">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl opacity-50 mix-blend-multiply animate-blob" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl opacity-50 mix-blend-multiply animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl opacity-50 mix-blend-multiply animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <div className="inline-flex items-center space-x-2 bg-app-card backdrop-blur-md border border-app-border rounded-full px-4 py-1.5 mb-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            <span className="text-xs font-semibold text-slate-700 tracking-wide uppercase">TrustNet AI 2.0 is Live</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-app-text leading-[1.1] mb-6 max-w-4xl drop-shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
            Trust Every Review with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-app-accent-start to-app-accent-end">
              AI-Powered Intelligence
            </span>
          </h1>

          <p className="text-lg md:text-xl text-app-muted mb-10 max-w-2xl leading-relaxed font-medium">
            The enterprise Review Intelligence Platform that detects fake reviews, performs sentiment analysis, calculates trust scores, and uses RAG with LLMs to explain its decisions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/console" className="w-full sm:w-auto bg-app-btn-bg hover:opacity-90 text-app-btn-text px-8 py-3.5 rounded-full text-base font-semibold transition-all shadow-[0_12px_40px_rgb(0,0,0,0.06)] shadow-indigo-900/20 flex items-center justify-center space-x-2 active:scale-95">
              <span>Launch Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#architecture" className="w-full sm:w-auto bg-app-card border border-app-border backdrop-blur-md hover:bg-transparent text-slate-700 border border-app-border px-8 py-3.5 rounded-full text-base font-semibold transition-all shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex items-center justify-center space-x-2 active:scale-95">
              <PlayCircle className="w-4 h-4" />
              <span>View Architecture</span>
            </a>
          </div>
        </motion.div>

        {/* Mac OS Window Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="mt-16 mx-auto max-w-5xl relative"
        >
          <div className="rounded-2xl border border-app-border bg-white/40 backdrop-blur-xl shadow-[0_30px_60px_rgb(0,0,0,0.12)] overflow-hidden">
            {/* Mac OS Header */}
            <div className="h-12 border-b border-app-border flex items-center px-4 bg-white/50">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium bg-transparent/50 px-4 py-1 rounded-md">
                  <ShieldCheck className="w-3 h-3 text-violet-500" />
                  <span>trustnet-ai.platform.net</span>
                </div>
              </div>
            </div>
            
            {/* Mock Dashboard Body */}
            <div className="aspect-[16/9] w-full bg-transparent flex items-center justify-center relative overflow-hidden">
              <img src="/dashboard_mockup.jpg" alt="Dashboard Preview" className="w-full h-full object-cover opacity-60 mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-50/30/80 via-transparent to-transparent" />
              
              <div className="absolute inset-0 p-8 grid grid-cols-3 gap-6">
                 {/* Fake UI Elements for demo */}
                 <div className="col-span-2 bg-app-card border border-app-border backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-app-border p-6 flex flex-col space-y-4">
                    <div className="h-4 w-32 bg-transparent rounded" />
                    <div className="flex-1 bg-transparent rounded border border-app-border" />
                 </div>
                 <div className="col-span-1 space-y-6">
                    <div className="h-1/3 bg-app-card border border-app-border backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-app-border p-6" />
                    <div className="h-2/3 bg-app-card border border-app-border backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-app-border p-6" />
                 </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
