import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, PlayCircle, ShieldCheck } from 'lucide-react';

const backgrounds = [
  { type: 'image', src: '/bg_slide_1.jpg' },
  { type: 'image', src: '/bg_slide_2.jpg' },
  { type: 'video', src: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-connection-lines-10088-large.mp4' },
  { type: 'image', src: '/bg_slide_3.jpg' },
  { type: 'image', src: '/bg_slide_4.jpg' }
];

export const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgrounds.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden px-6">
      {/* Background Slider */}
      <div className="absolute inset-0 z-0 bg-slate-100">
        <AnimatePresence>
          {backgrounds.map((bg, idx) => {
            if (idx !== currentSlide) return null;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
              >
                {bg.type === 'image' ? (
                  <img src={bg.src} alt="Background" className="w-full h-full object-cover brightness-[1.40]" />
                ) : (
                  <video src={bg.src} autoPlay muted loop playsInline className="w-full h-full object-cover brightness-[1.40]" />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Background overlay */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-0"></div>

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
          <div className="inline-flex items-center space-x-2 bg-white/50 backdrop-blur-md border border-slate-200/60 rounded-full px-4 py-1.5 mb-8 shadow-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-xs font-semibold text-slate-700 tracking-wide uppercase">TrustNet AI 2.0 is Live</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6 max-w-4xl drop-shadow-sm">
            Trust Every Review with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              AI-Powered Intelligence
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed font-medium">
            The enterprise Review Intelligence Platform that detects fake reviews, performs sentiment analysis, calculates trust scores, and uses RAG with LLMs to explain its decisions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/console" className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-full text-base font-semibold transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center space-x-2 active:scale-95">
              <span>Launch Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#architecture" className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-3.5 rounded-full text-base font-semibold transition-all shadow-sm flex items-center justify-center space-x-2 active:scale-95">
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
          <div className="rounded-2xl border border-slate-200/50 bg-white/40 backdrop-blur-xl shadow-2xl overflow-hidden">
            {/* Mac OS Header */}
            <div className="h-12 border-b border-slate-200/50 flex items-center px-4 bg-white/50">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium bg-slate-100/50 px-4 py-1 rounded-md">
                  <ShieldCheck className="w-3 h-3 text-blue-500" />
                  <span>trustnet-ai.platform.net</span>
                </div>
              </div>
            </div>
            
            {/* Mock Dashboard Body */}
            <div className="aspect-[16/9] w-full bg-slate-50 flex items-center justify-center relative overflow-hidden">
              <img src="/dashboard_mockup.jpg" alt="Dashboard Preview" className="w-full h-full object-cover opacity-60 mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-50/80 via-transparent to-transparent" />
              
              <div className="absolute inset-0 p-8 grid grid-cols-3 gap-6">
                 {/* Fake UI Elements for demo */}
                 <div className="col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col space-y-4">
                    <div className="h-4 w-32 bg-slate-100 rounded" />
                    <div className="flex-1 bg-slate-50 rounded border border-slate-100" />
                 </div>
                 <div className="col-span-1 space-y-6">
                    <div className="h-1/3 bg-white rounded-xl shadow-sm border border-slate-200 p-6" />
                    <div className="h-2/3 bg-white rounded-xl shadow-sm border border-slate-200 p-6" />
                 </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
