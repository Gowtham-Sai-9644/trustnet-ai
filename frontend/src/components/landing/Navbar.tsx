import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Menu, X, Sun, Moon, Droplets } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();

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
        scrolled ? 'bg-white/70 backdrop-blur-md border-b border-app-border shadow-[0_4px_20px_rgb(0,0,0,0.03)]' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-violet-600 p-1.5 rounded-lg">
            <ShieldCheck className="w-5 h-5 text-app-btn-text" />
          </div>
          <span className="font-bold text-lg tracking-tight text-app-text">TrustNet AI</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-app-muted">
          <a href="#features" className="hover:text-violet-600 transition-colors">Features</a>
          <a href="#solution" className="hover:text-violet-600 transition-colors">How it Works</a>
          <a href="#architecture" className="hover:text-violet-600 transition-colors">Architecture</a>
          <a href="#metrics" className="hover:text-violet-600 transition-colors">Performance</a>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center bg-app-border/50 rounded-full p-1 mr-2">
            <button
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded-full transition-all ${theme === 'light' ? 'bg-white shadow-sm text-indigo-950' : 'text-app-muted hover:text-app-text'}`}
              title="Light Theme"
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded-full transition-all ${theme === 'dark' ? 'bg-white shadow-sm text-indigo-950' : 'text-app-muted hover:text-app-text'}`}
              title="Dark Theme"
            >
              <Moon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme('glass')}
              className={`p-1.5 rounded-full transition-all ${theme === 'glass' ? 'bg-white shadow-sm text-indigo-950' : 'text-app-muted hover:text-app-text'}`}
              title="Glass Theme"
            >
              <Droplets className="w-4 h-4" />
            </button>
          </div>
          <a href="http://localhost:8000/docs" className="text-sm font-medium text-app-muted hover:text-app-text transition-colors">Documentation</a>
          <Link to="/console" className="bg-app-btn-bg hover:opacity-90 text-app-btn-text px-4 py-2 rounded-full text-sm font-medium transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] shadow-indigo-900/10 hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] hover:shadow-indigo-900/20 active:scale-95">
            Launch Demo
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 text-app-muted" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="md:hidden absolute top-16 left-0 right-0 bg-app-card border border-app-border backdrop-blur-md border-b border-app-border shadow-[0_12px_40px_rgb(0,0,0,0.06)] py-4 px-6 flex flex-col space-y-4">
            <a href="#features" className="text-app-muted font-medium" onClick={() => setMobileOpen(false)}>Features</a>
            <a href="#solution" className="text-app-muted font-medium" onClick={() => setMobileOpen(false)}>How it Works</a>
            <Link to="/console" className="bg-violet-600 text-app-btn-text text-center py-2 rounded-lg font-medium" onClick={() => setMobileOpen(false)}>Launch Demo</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
