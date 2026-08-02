import React from 'react';
import { ShieldAlert, Globe, Search, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

/* ── Feed Items ── */
const FEED_ITEMS = [
  { id: 1, title: 'Fake Instagram Job', desc: 'Job offering scam detected', time: '10m ago', verified: true, alert: true, icon: '🕵️' },
  { id: 2, title: 'UPI Payment Scam', desc: 'Fake payment request', time: '18m ago', verified: true, alert: true, icon: '💸' },
  { id: 3, title: 'Phishing Website', desc: 'Credential harvesting site', time: '25m ago', verified: true, alert: true, icon: '🎣' },
  { id: 4, title: 'Fake Social Giveaway', desc: 'Prize scam detected', time: '32m ago', verified: true, alert: true, icon: '🎁' },
  { id: 5, title: 'Spam Call Campaign', desc: 'Robocall fraud detected', time: '45m ago', verified: true, alert: true, icon: '📞' },
];

/* ── Analytical Tools ── */
const ANALYTICAL_TOOLS = [
  { id: 1, title: 'Phishing Shield', desc: 'URL & Email Analysis', icon: '🛡️' },
  { id: 2, title: 'Scammer Trace', desc: 'Phone & Profile Origin', icon: '🕵️‍♂️' },
  { id: 3, title: 'Data Forgery Lab', desc: 'Job & Document Verification', icon: '📄' },
  { id: 4, title: 'Community Watch', desc: 'Real-time Reports', icon: '🌐' },
  { id: 5, title: 'Secure Social', desc: 'Profile Authenticity', icon: '✅' },
];

/* ── Custom Compass SVG ── */
const SafetyCompass: React.FC = () => {
  return (
    <div className="relative w-full max-w-[700px] aspect-[4/3] flex items-center justify-center mx-auto">
      <svg width="100%" height="100%" viewBox="0 0 800 600" className="drop-shadow-2xl overflow-visible">
        <defs>
          <radialGradient id="dialGlow" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="#D97706" stopOpacity="0.1" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="10" stdDeviation="15" floodOpacity="0.1" />
          </filter>
        </defs>

        {/* ── Background Connections (Dots & Lines) ── */}
        <g stroke="#E2E8F0" strokeWidth="1" opacity="0.6">
          <line x1="150" y1="200" x2="300" y2="300" />
          <line x1="150" y1="300" x2="300" y2="300" />
          <line x1="150" y1="400" x2="300" y2="300" />
          
          <line x1="650" y1="200" x2="500" y2="300" />
          <line x1="650" y1="300" x2="500" y2="300" />
          <line x1="650" y1="400" x2="500" y2="300" />
        </g>

        {/* ── Central Compass ── */}
        <g transform="translate(400, 300)" filter="url(#dropShadow)">
          {/* Outer glowing rings */}
          <circle r="160" fill="none" stroke="#D97706" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
          <circle r="145" fill="none" stroke="#0D9488" strokeWidth="2" opacity="0.5" />
          
          {/* Main Dial Body */}
          <circle r="130" fill="#FFF" stroke="#E2E8F0" strokeWidth="1" />
          
          {/* Golden Inner Ring */}
          <circle r="115" fill="none" stroke="#D97706" strokeWidth="12" opacity="0.1" />
          <circle r="115" fill="none" stroke="#D97706" strokeWidth="1" />

          {/* Compass Ticks */}
          {Array.from({ length: 24 }).map((_, i) => (
            <line key={i} x1="0" y1="-105" x2="0" y2="-115" transform={`rotate(${i * 15})`} stroke="#CBD5E1" strokeWidth={i % 6 === 0 ? "2" : "1"} />
          ))}

          {/* Inner Teal Ring */}
          <circle r="90" fill="url(#dialGlow)" />
          <circle r="90" fill="none" stroke="#0D9488" strokeWidth="8" opacity="0.2" />
          <circle r="90" fill="none" stroke="#0D9488" strokeWidth="1" />

          {/* Center Text */}
          <text y="-55" textAnchor="middle" fontSize="12" fill="#64748B" fontWeight="600">Scan Field</text>
          <path d="M -40 -45 Q 0 -35 40 -45" fill="none" stroke="#CBD5E1" strokeWidth="1" />
          
          <text y="-25" textAnchor="middle" fontSize="12" fill="#64748B" fontWeight="600">Data Streams</text>
          <path d="M -50 -15 Q 0 -5 50 -15" fill="none" stroke="#CBD5E1" strokeWidth="1" />

          <text y="5" textAnchor="middle" fontSize="12" fill="#64748B" fontWeight="600">Trust Hub</text>

          {/* 96% INTEGRITY */}
          <text y="40" textAnchor="middle" fontSize="36" fill="#0F172A" fontWeight="900">96%</text>
          <text y="55" textAnchor="middle" fontSize="10" fill="#64748B" fontWeight="700" letterSpacing="2">INTEGRITY</text>
          
          {/* Compass Needle Highlights */}
          <path d="M -80 0 L -100 0 M 80 0 L 100 0" stroke="#0D9488" strokeWidth="2" />
        </g>

        {/* ── Left Nodes (Teal) ── */}
        <g transform="translate(150, 200)">
          <circle r="25" fill="#0D9488" opacity="0.1" />
          <circle r="18" fill="#0D9488" />
          <text y="5" textAnchor="middle" fill="#FFF" fontSize="14" fontFamily="sans-serif">💬</text>
          <text x="35" y="4" fontSize="14" fill="#0F172A" fontWeight="600">Message</text>
        </g>

        <g transform="translate(130, 300)">
          <circle r="25" fill="#0D9488" opacity="0.1" />
          <circle r="18" fill="#0D9488" />
          <text y="5" textAnchor="middle" fill="#FFF" fontSize="14" fontFamily="sans-serif">🔗</text>
          <text x="35" y="4" fontSize="14" fill="#0F172A" fontWeight="600">URL</text>
        </g>

        <g transform="translate(150, 400)">
          <circle r="25" fill="#0D9488" opacity="0.1" />
          <circle r="18" fill="#0D9488" />
          <text y="5" textAnchor="middle" fill="#FFF" fontSize="14" fontFamily="sans-serif">₹</text>
          <text x="35" y="4" fontSize="14" fill="#0F172A" fontWeight="600">UPI</text>
        </g>

        {/* ── Right Nodes (Gold) ── */}
        <g transform="translate(650, 200)">
          <circle r="25" fill="#D97706" opacity="0.1" />
          <circle r="18" fill="#D97706" />
          <text y="5" textAnchor="middle" fill="#FFF" fontSize="14" fontFamily="sans-serif">👥</text>
          <text x="-35" y="4" textAnchor="end" fontSize="14" fill="#0F172A" fontWeight="600">Social</text>
        </g>

        <g transform="translate(670, 300)">
          <circle r="25" fill="#D97706" opacity="0.1" />
          <circle r="18" fill="#D97706" />
          <text y="5" textAnchor="middle" fill="#FFF" fontSize="14" fontFamily="sans-serif">📱</text>
          <text x="-35" y="4" textAnchor="end" fontSize="14" fill="#0F172A" fontWeight="600">QR</text>
        </g>

        <g transform="translate(650, 400)">
          <circle r="25" fill="#D97706" opacity="0.1" />
          <circle r="18" fill="#D97706" />
          <text y="5" textAnchor="middle" fill="#FFF" fontSize="14" fontFamily="sans-serif">🖼️</text>
          <text x="-35" y="4" textAnchor="end" fontSize="14" fill="#0F172A" fontWeight="600">Image</text>
        </g>

      </svg>

      {/* Floating Search Bar */}
      <div className="absolute bottom-[-10%] md:bottom-[5%] left-1/2 -translate-x-1/2 w-[90%] max-w-[600px]">
        <div className="bg-white rounded-full shadow-2xl p-2 flex items-center border border-slate-200">
          <div className="pl-4 text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input 
            type="text" 
            placeholder="Input fraud signal (URL, message, UPI, code)..." 
            className="flex-1 bg-transparent border-none outline-none px-4 text-sm text-slate-800 placeholder-slate-400"
          />
          <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-full text-xs font-bold tracking-wide transition-colors">
            DECONSTRUCT
          </button>
        </div>
        <div className="text-center mt-3 text-[11px] text-slate-500 font-medium tracking-wide">
          Supports: URL • Message • UPI • QR • Image • Email
        </div>
      </div>
    </div>
  );
};

export const Hero: React.FC = () => {
  return (
    <section className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      
      {/* Background ambient accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-teal-100 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-amber-50 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10 flex flex-col items-center pt-48 md:pt-56">
        
        {/* ── Center: Title & Compass ── */}
        <div className="flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
            Deconstruct The Scam Web.<br/>
            <span className="text-teal-600 font-bold">Instantly verify with AI.</span>
          </h1>
          <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto mb-10 font-medium">
            Analyze URLs, messages, QR codes, images and more.<br/>
            Powered by AI. Secured by Community.
          </p>
          
          <SafetyCompass />
        </div>

      </div>
    </section>
  );
};
