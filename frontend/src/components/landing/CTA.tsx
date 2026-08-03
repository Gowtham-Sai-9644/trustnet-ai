import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Github, BookOpen } from 'lucide-react';

export const CTA: React.FC = () => {
  return (
    <section className="py-32 px-6 md:px-12 bg-transparent relative overflow-hidden">

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.h2  className="text-4xl md:text-6xl font-extrabold text-landing-text tracking-tight mb-6">
          Start Building Trust with AI.
        </motion.h2>
        <p className="text-xl text-landing-muted mb-12 max-w-2xl mx-auto">
          Integrate the world's most advanced Review Intelligence Platform into your e-commerce ecosystem today.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link to="/console" className="w-full sm:w-auto bg-landing-primary text-white px-8 py-4 rounded-full text-base font-bold transition-all shadow-[0_10px_30px_rgba(13,148,136,0.3)] hover:scale-105 flex items-center justify-center space-x-2">
            <span>Launch Demo</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="w-full sm:w-auto bg-landing-card border border-landing-border text-landing-text hover:bg-landing-surface px-8 py-4 rounded-full text-base font-bold transition-all flex items-center justify-center space-x-2">
            <Github className="w-5 h-5" />
            <span>View GitHub</span>
          </a>
          <a href="http://localhost:8000/docs" className="w-full sm:w-auto bg-landing-card border border-landing-border text-landing-text hover:bg-landing-surface px-8 py-4 rounded-full text-base font-bold transition-all flex items-center justify-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <span>Documentation</span>
          </a>
        </div>
      </div>
    </section>
  );
};
