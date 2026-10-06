import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ScanLine } from 'lucide-react';

export const FinalCTA: React.FC = () => {
  return (
    <section className="py-32 relative overflow-hidden flex justify-center">
      
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="w-[800px] h-[400px] bg-gradient-to-r from-teal-500/10 via-blue-500/10 to-purple-500/10 rounded-full blur-[100px]" />
      </motion.div>

      <div className="text-center relative z-10 max-w-3xl">
        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 text-app-text">
          Ready to verify?
        </h2>
        <p className="text-xl text-gray-400 mb-12 font-light leading-relaxed">
          The console is ready. Access the world's most advanced multimodal threat intelligence engine.
        </p>

        <Link 
          to="/console" 
          className="group relative inline-flex items-center gap-3 px-12 py-6 bg-white text-app-btn-text rounded-full font-bold uppercase tracking-widest text-sm hover:scale-105 transition-all duration-500 shadow-[0_0_40px_rgba(255,255,255,0.15)] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <ScanLine className="w-5 h-5" />
          <span>Start Analysis</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
};
