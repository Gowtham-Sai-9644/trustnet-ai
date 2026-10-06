import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Menu, X, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/50 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
            <Shield className="w-5 h-5 text-teal-400" />
          </div>
          <span className="font-bold text-xl tracking-tighter text-app-text">
            TrustNet <span className="text-gray-500 font-light">AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-gray-400">
          <a href="#system" className="hover:text-app-text transition-colors flex items-center gap-2">
             System
          </a>
          <a href="#vectors" className="hover:text-app-text transition-colors">
             Threat Vectors
          </a>
          <a href="#rag" className="hover:text-app-text transition-colors">
             Intelligence
          </a>
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-6">
          <a
            href="http://localhost:8000/docs"
            className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-app-text transition-colors flex items-center gap-2"
          >
            <Terminal className="w-4 h-4" /> API
          </a>
          <Link
            to="/console"
            className="px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-bold transition-all bg-[#3B82F6] text-white hover:bg-gray-200 hover:scale-105 active:scale-95"
          >
            Launch Console
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-app-text"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 p-6 flex flex-col gap-6 bg-black/90 backdrop-blur-2xl border-b border-white/10"
          >
            <a href="#system" className="font-bold text-lg text-app-text" onClick={() => setMobileOpen(false)}>System</a>
            <a href="#vectors" className="font-bold text-lg text-app-text" onClick={() => setMobileOpen(false)}>Threat Vectors</a>
            <a href="#rag" className="font-bold text-lg text-app-text" onClick={() => setMobileOpen(false)}>Intelligence</a>
            <Link
              to="/console"
              className="text-center py-4 rounded-xl font-bold bg-[#3B82F6] text-white"
              onClick={() => setMobileOpen(false)}
            >
              Launch Console
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

