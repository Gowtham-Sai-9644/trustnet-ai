import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Github, BookOpen } from 'lucide-react';

export const CTA: React.FC = () => {
  return (
    <section className="py-32 px-6 md:px-12 bg-blue-600 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-700 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
          Start Building Trust with AI.
        </h2>
        <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
          Integrate the world's most advanced Review Intelligence Platform into your e-commerce ecosystem today.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link to="/console" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-slate-50 px-8 py-4 rounded-full text-base font-bold transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center space-x-2">
            <span>Launch Demo</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="w-full sm:w-auto bg-blue-700 text-white hover:bg-blue-800 px-8 py-4 rounded-full text-base font-bold transition-all flex items-center justify-center space-x-2">
            <Github className="w-5 h-5" />
            <span>View GitHub</span>
          </a>
          <Link to="/docs" className="w-full sm:w-auto bg-blue-700 text-white hover:bg-blue-800 px-8 py-4 rounded-full text-base font-bold transition-all flex items-center justify-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <span>Documentation</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
