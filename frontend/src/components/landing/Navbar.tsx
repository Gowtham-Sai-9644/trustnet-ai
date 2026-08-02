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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-sm' : ''
      }`}
      style={{
        background: scrolled ? 'rgba(245, 237, 216, 0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(180,150,100,0.2)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm"
            style={{ background: 'linear-gradient(135deg, #8B6914, #C9971A)' }}
          >
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight" style={{ color: '#2D1B00' }}>
            TrustNet AI
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold" style={{ color: '#5C3D11' }}>
          <a href="#features" className="hover:text-amber-800 transition-colors">My Defense Hub</a>
          <span className="opacity-30">|</span>
          <a href="#solution" className="hover:text-amber-800 transition-colors">Scam Observatory</a>
          <span className="opacity-30">|</span>
          <a href="#architecture" className="hover:text-amber-800 transition-colors">About Us</a>
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="http://localhost:8000/docs"
            className="text-sm font-medium transition-colors"
            style={{ color: '#7C5C2E' }}
          >
            API Docs
          </a>
          <Link
            to="/console"
            className="px-5 py-2 rounded-full text-sm font-bold transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #8B6914, #C9971A)',
              color: '#FFFFFF',
            }}
          >
            Launch Console →
          </Link>
          {/* Avatar */}
          <div
            className="w-8 h-8 rounded-full overflow-hidden border-2"
            style={{ borderColor: 'rgba(140,100,30,0.4)' }}
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-lg"
          style={{ color: '#5C3D11' }}
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
            className="md:hidden absolute top-16 left-0 right-0 py-4 px-6 flex flex-col gap-4 shadow-lg"
            style={{ background: 'rgba(245,237,216,0.97)', backdropFilter: 'blur(12px)' }}
          >
            <a href="#features" className="font-medium" style={{ color: '#5C3D11' }} onClick={() => setMobileOpen(false)}>My Defense Hub</a>
            <a href="#solution" className="font-medium" style={{ color: '#5C3D11' }} onClick={() => setMobileOpen(false)}>Scam Observatory</a>
            <Link
              to="/console"
              className="text-center py-2.5 rounded-xl font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #8B6914, #C9971A)' }}
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
