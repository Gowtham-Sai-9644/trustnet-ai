import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/70 backdrop-blur-md border-b border-slate-200/50 shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900">TrustNet AI</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
          <a href="#solution" className="hover:text-blue-600 transition-colors">How it Works</a>
          <a href="#architecture" className="hover:text-blue-600 transition-colors">Architecture</a>
          <a href="#metrics" className="hover:text-blue-600 transition-colors">Performance</a>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Link to="/docs" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Documentation</Link>
          <Link to="/console" className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-md shadow-slate-900/10 hover:shadow-lg hover:shadow-slate-900/20 active:scale-95">
            Launch Demo
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 text-slate-600" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-slate-200 shadow-lg py-4 px-6 flex flex-col space-y-4">
            <a href="#features" className="text-slate-600 font-medium" onClick={() => setMobileOpen(false)}>Features</a>
            <a href="#solution" className="text-slate-600 font-medium" onClick={() => setMobileOpen(false)}>How it Works</a>
            <Link to="/console" className="bg-blue-600 text-white text-center py-2 rounded-lg font-medium" onClick={() => setMobileOpen(false)}>Launch Demo</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
