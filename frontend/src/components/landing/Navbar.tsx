import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, progress: number) => {
    e.preventDefault();
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: scrollHeight * progress,
      behavior: 'smooth'
    });
    setMobileOpen(false);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-landing-bg/90 backdrop-blur-xl border-b border-landing-border shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm bg-landing-primary">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-landing-text">
            TrustNet AI
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-landing-muted">
          <a href="#" onClick={(e) => scrollToSection(e, 0.65)} className="hover:text-landing-primary transition-colors">My Defense Hub</a>
          <span className="opacity-30">|</span>
          <a href="#" onClick={(e) => scrollToSection(e, 0.25)} className="hover:text-landing-primary transition-colors">Scam Observatory</a>
          <span className="opacity-30">|</span>
          <a href="#" onClick={(e) => scrollToSection(e, 0.90)} className="hover:text-landing-primary transition-colors">About Us</a>
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="http://localhost:8000/docs"
            className="text-sm font-medium text-landing-muted hover:text-landing-primary transition-colors"
          >
            API Docs
          </a>
          <Link
            to="/console"
            className="px-5 py-2 rounded-full text-sm font-bold transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95 bg-landing-primary text-white"
          >
            Launch Console →
          </Link>
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-landing-border">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-landing-text"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-16 left-0 right-0 py-4 px-6 flex flex-col gap-4 shadow-lg bg-landing-bg/95 backdrop-blur-xl"
          >
            <a href="#" onClick={(e) => scrollToSection(e, 0.65)} className="font-medium text-landing-text">My Defense Hub</a>
            <a href="#" onClick={(e) => scrollToSection(e, 0.25)} className="font-medium text-landing-text">Scam Observatory</a>
            <a href="#" onClick={(e) => scrollToSection(e, 0.90)} className="font-medium text-landing-text">About Us</a>
            <Link
              to="/console"
              className="text-center py-2.5 rounded-xl font-bold bg-landing-primary text-white"
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
