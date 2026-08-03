import React from 'react';
import { ShieldCheck, Github, Linkedin, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-transparent text-landing-muted py-16 px-6 md:px-12 border-t border-landing-border relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center space-x-2 mb-6">
            <div className="bg-landing-primary p-1.5 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-landing-text">TrustNet AI</span>
          </Link>
          <p className="text-sm text-landing-muted opacity-70 leading-relaxed">
            The enterprise Review Intelligence Platform. Detect fake reviews, analyze sentiment, and verify trust with explainable AI.
          </p>
        </div>
        
        <div>
          <h4 className="text-landing-text font-semibold mb-4">Product</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#features" className="hover:text-landing-text transition-colors">Features</a></li>
            <li><a href="#architecture" className="hover:text-landing-text transition-colors">Architecture</a></li>
            <li><Link to="/console" className="hover:text-landing-text transition-colors">Console Demo</Link></li>
            <li><a href="http://localhost:8000/docs" className="hover:text-landing-text transition-colors">Documentation</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-landing-text font-semibold mb-4">Company</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="hover:text-landing-text transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-landing-text transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-landing-text transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-landing-text transition-colors">Terms of Service</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-landing-text font-semibold mb-4">Connect</h4>
          <div className="flex space-x-4">
            <a href="#" className="bg-landing-card border border-landing-border p-2 rounded-full hover:bg-landing-surface transition-colors text-landing-text">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="bg-landing-card border border-landing-border p-2 rounded-full hover:bg-landing-surface transition-colors text-landing-text">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="bg-landing-card border border-landing-border p-2 rounded-full hover:bg-landing-surface transition-colors text-landing-text">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto border-t border-landing-border pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
        <p>© {new Date().getFullYear()} TrustNet AI. All rights reserved.</p>
        <p className="mt-4 md:mt-0">Designed for Enterprise Integrity.</p>
      </div>
    </footer>
  );
};
