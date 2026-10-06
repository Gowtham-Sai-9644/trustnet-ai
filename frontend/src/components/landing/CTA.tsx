import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Github, BookOpen, ScanLine } from 'lucide-react';

export const CTA: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);

  return (
    <section ref={containerRef} className="py-32 px-6 md:px-12 bg-transparent relative overflow-hidden flex justify-center">
      
      {/* Background glow tied to scroll */}
      <motion.div 
        style={{ opacity }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="w-[800px] h-[400px] bg-gradient-to-r from-teal-500/10 via-blue-500/20 to-purple-500/10 rounded-full blur-[100px]" />
      </motion.div>

      <motion.div 
        style={{ y, opacity, scale }}
        className="max-w-4xl mx-auto text-center relative z-10 bg-white/5 border border-white/10 backdrop-blur-2xl p-12 md:p-20 rounded-[3rem] shadow-2xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-teal-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/20"
        >
          <ScanLine className="w-10 h-10 text-app-text" />
        </motion.div>

        <h2 className="text-4xl md:text-6xl font-black text-app-text tracking-tighter mb-6">
          Ready to verify?
        </h2>
        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
          Access the world's most advanced multimodal threat intelligence engine. Instantly detect phishing, UPI fraud, and synthetic scams.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link 
            to="/console" 
            className="group w-full sm:w-auto bg-white text-app-btn-text px-10 py-5 rounded-full text-sm uppercase tracking-widest font-bold transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 flex items-center justify-center space-x-3 overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <span>Start Analysis</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href="https://github.com/Gowtham-Sai-9644/trustnet-ai" target="_blank" rel="noreferrer" className="w-full sm:w-auto bg-white/5 border border-white/10 text-app-text hover:bg-white/10 px-8 py-5 rounded-full text-sm uppercase tracking-widest font-bold transition-all flex items-center justify-center space-x-3">
            <Github className="w-5 h-5" />
            <span>GitHub</span>
          </a>
        </div>
      </motion.div>
    </section>
  );
};
