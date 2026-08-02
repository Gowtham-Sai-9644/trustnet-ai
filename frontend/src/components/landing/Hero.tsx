import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Settings, Eye, Waves, Hammer,
  Bell, LogOut, ChevronDown, Activity, Globe
} from 'lucide-react';

/* ── Aether Sphere Component ── */
const AetherSphere: React.FC = () => {
  const rings = 8;
  const nodes = 40;

  const generateNodes = () => {
    return Array.from({ length: nodes }).map((_, i) => {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = 200 + 150 * Math.sin(phi) * Math.cos(theta);
      const y = 200 + 150 * Math.sin(phi) * Math.sin(theta) * 0.4 + 150 * Math.cos(phi) * 0.9;
      const isCyan = Math.random() > 0.5;
      const r = Math.random() * 3 + 2;
      return { x, y, isCyan, r, delay: Math.random() * 3 };
    });
  };

  const sphereNodes = React.useMemo(generateNodes, []);

  return (
    <div className="relative w-full max-w-[500px] aspect-square mx-auto">
      <svg viewBox="0 0 400 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="sphereGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.25" />
            <stop offset="60%" stopColor="#C026D3" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#C026D3" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#818CF8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#C026D3" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Glow behind sphere */}
        <circle cx="200" cy="200" r="160" fill="url(#sphereGlow)" />

        {/* Latitudinal rings (horizontal) */}
        {[0, 1, 2, 3, 4, 5, 6].map(i => {
          const ry = 150 * Math.sin(Math.PI * i / 6);
          const yOffset = 150 * Math.cos(Math.PI * i / 6);
          return (
            <ellipse
              key={`lat-${i}`}
              cx="200" cy={200 + yOffset * 0.3}
              rx={150 * Math.sin(Math.acos(yOffset/150))} ry={ry * 0.4}
              fill="none"
              stroke="url(#ringGrad)"
              strokeWidth="1.5"
              opacity="0.6"
            />
          );
        })}

        {/* Longitudinal rings (vertical) */}
        {Array.from({ length: rings }).map((_, i) => (
          <ellipse
            key={`lon-${i}`}
            cx="200" cy="200"
            rx={150 * Math.cos((i * Math.PI) / rings)} ry="150"
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="1.5"
            opacity="0.6"
          />
        ))}

        {/* Diagonal connecting lines */}
        <path
          d="M 120 120 L 280 280 M 120 280 L 280 120 M 150 100 L 250 300 M 250 100 L 150 300"
          stroke="url(#ringGrad)"
          strokeWidth="1"
          opacity="0.5"
        />

        {/* Glowing Nodes */}
        {sphereNodes.map((node, i) => (
          <circle
            key={`node-${i}`}
            cx={node.x} cy={node.y} r={node.r}
            fill={node.isCyan ? '#00E5FF' : '#E879F9'}
            opacity="0.9"
          >
            <animate
              attributeName="opacity"
              values="0.4;1;0.4"
              dur={`${2 + node.delay}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values={`${node.r};${node.r * 1.6};${node.r}`}
              dur={`${2 + node.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}

        {/* Center core pulse */}
        <circle cx="200" cy="200" r="10" fill="#00E5FF" opacity="0.9">
          <animate attributeName="r" values="8;16;8" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* Floating Labels matching the screenshot layout */}
      <div className="absolute top-[22%] left-[0%] px-3 py-1.5 rounded-full text-[11px] font-bold shadow-lg whitespace-nowrap"
           style={{ background: 'rgba(13, 20, 36, 0.85)', border: '1px solid rgba(0, 229, 255, 0.4)', color: '#00E5FF', backdropFilter: 'blur(6px)' }}>
        Quantum Scans Active
      </div>
      <div className="absolute top-[12%] right-[10%] px-3 py-1.5 rounded-full text-[11px] font-bold shadow-lg whitespace-nowrap"
           style={{ background: 'rgba(13, 20, 36, 0.85)', border: '1px solid rgba(0, 229, 255, 0.4)', color: '#00E5FF', backdropFilter: 'blur(6px)' }}>
        Quantum Scans Active
      </div>
      <div className="absolute top-[28%] right-[0%] px-3 py-1.5 rounded-full text-[11px] font-bold shadow-lg whitespace-nowrap"
           style={{ background: 'rgba(13, 20, 36, 0.85)', border: '1px solid rgba(232, 121, 249, 0.4)', color: '#E879F9', backdropFilter: 'blur(6px)' }}>
        Pattern Flux
      </div>
      <div className="absolute bottom-[28%] left-[0%] px-3 py-1.5 rounded-full text-[11px] font-bold shadow-lg whitespace-nowrap"
           style={{ background: 'rgba(13, 20, 36, 0.85)', border: '1px solid rgba(0, 229, 255, 0.4)', color: '#00E5FF', backdropFilter: 'blur(6px)' }}>
        Quantum Scans Active
      </div>
      <div className="absolute bottom-[32%] right-[8%] px-3 py-1.5 rounded-full text-[11px] font-bold shadow-lg whitespace-nowrap"
           style={{ background: 'rgba(13, 20, 36, 0.85)', border: '1px solid rgba(232, 121, 249, 0.4)', color: '#E879F9', backdropFilter: 'blur(6px)' }}>
        Pattern Flux
      </div>

      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[15px] font-medium text-slate-300 tracking-wide">
        The Aether Sphere
      </div>
    </div>
  );
};

/* ── Feed Component ── */
const ObservatoryFeed = () => {
  const items = [
    { label: 'Phishing URL cluster', tag: 'cyan-glowing tag', color: '#00E5FF' },
    { label: 'Fake Identity Forgery', tag: 'amethyst glowing tag', color: '#E879F9' },
    { label: 'Fake Identity Forgery', tag: 'amethyst glowing tag', color: '#E879F9' },
    { label: 'Fake Identity Forgery', tag: 'amethyst glowing tag', color: '#E879F9' },
    { label: 'Phishing URL cluster', tag: 'cyan-glowing tag', color: '#00E5FF' },
    { label: 'Fake Identity Forgery', tag: 'amethyst glowing tag', color: '#E879F9' },
    { label: 'Fake Identity Forgery', tag: 'cyan-glowing tag', color: '#00E5FF' },
  ];

  return (
    <div className="flex-1 w-full rounded-2xl p-4 flex flex-col relative overflow-hidden"
         style={{ background: 'rgba(23, 30, 46, 0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <h3 className="text-[15px] font-bold text-slate-200 mb-3 flex items-center gap-2">
        The Tides <span className="text-slate-400 font-normal text-[13px]">(Observatory Feed)</span>
      </h3>
      <div className="flex-1 space-y-2.5 overflow-hidden">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-[10px]">
              🕵️
            </div>
            <span className="text-[12px] font-medium text-slate-300 flex-1 truncate">{item.label}</span>
            <span className="text-[9px] px-2 py-0.5 rounded-full whitespace-nowrap"
                  style={{ background: `${item.color}15`, color: item.color, border: `1px solid ${item.color}40` }}>
              {item.tag}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-center text-slate-500">
        <ChevronDown className="w-4 h-4" />
      </div>
    </div>
  );
};

/* ── Main Hero Dashboard Mockup ── */
export const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');

  const handleScan = () => {
    if (!inputValue.trim()) return;
    navigate('/console/analysis');
  };

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center p-4 lg:p-8 overflow-hidden">
      
      {/* ── Outer Browser Window Mockup ── */}
      <div className="w-full max-w-[1400px] h-[90vh] rounded-xl overflow-hidden flex flex-col shadow-2xl relative"
           style={{ background: '#0B1120', border: '1px solid rgba(255,255,255,0.1)' }}>
        
        {/* Browser Chrome */}
        <div className="h-10 flex items-center px-4 gap-4 flex-shrink-0" style={{ background: '#F8FAFC' }}>
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
          </div>
          <div className="flex-1 max-w-2xl h-6 bg-slate-100 rounded flex items-center px-2 border border-slate-200">
            <ShieldCheck className="w-3 h-3 text-emerald-600 mr-2" />
            <span className="text-[11px] text-slate-500">trustnet.com/protect/dashboard</span>
          </div>
        </div>

        {/* Dashboard Body */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* ── Left Sidebar (Thin rail) ── */}
          <div className="w-[72px] flex flex-col items-center py-6 flex-shrink-0 relative z-20"
               style={{ background: 'rgba(9, 15, 30, 0.7)', borderRight: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
            <div className="w-10 h-10 rounded-xl mb-12 flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, #00E5FF, #6366F1)' }}>
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>

            <div className="flex flex-col gap-8 flex-1 w-full items-center">
              {[
                { icon: Settings, label: 'Core', active: true },
                { icon: Eye, label: 'Observer' },
                { icon: Waves, label: 'Tides' },
                { icon: Hammer, label: 'Forge' },
              ].map((item, i) => (
                <div key={i} className={`flex flex-col items-center gap-1.5 cursor-pointer ${item.active ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>
                  <div className="relative">
                    {item.active && <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r-md" />}
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px]">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-6 w-full items-center mb-6">
              <Bell className="w-5 h-5 text-slate-500 hover:text-slate-300 cursor-pointer" />
              <LogOut className="w-5 h-5 text-slate-500 hover:text-slate-300 cursor-pointer" />
            </div>
            
            {/* Social bubbles at bottom left matching image */}
            <div className="flex gap-2 pb-2">
               <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 text-[10px]">f</div>
               <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 text-[10px]">𝕏</div>
               <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 text-[10px]">◉</div>
            </div>
          </div>

          {/* ── Main Workspace Area ── */}
          <div className="flex-1 flex flex-col relative z-10 p-6">
            
            {/* Top Navigation Row */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-display font-bold text-slate-100 tracking-tight">TrustNet</span>
              </div>
              
              <div className="flex items-center gap-8 text-[13px] font-medium text-slate-300">
                <span className="text-slate-100">My Safety Compass</span>
                <span className="text-slate-500">|</span>
                <span>Defense Hub</span>
                <span>Community Watch</span>
                <span>About Us</span>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-[13px] text-slate-300">User</span>
                <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden border border-slate-600">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop" alt="User" />
                </div>
              </div>
            </div>

            {/* Central Content Area (Sphere & Panels) */}
            <div className="flex-1 flex relative">
              
              {/* Left/Center: Aether Sphere */}
              <div className="flex-[1.5] flex items-center justify-center relative -ml-10">
                <AetherSphere />
              </div>

              {/* Middle Floating Input Panel */}
              <div className="absolute left-[48%] top-1/2 -translate-y-1/2 w-72 z-20">
                <h3 className="text-[16px] font-bold text-slate-100 mb-2 px-1">Input Shards</h3>
                <div 
                  className="rounded-2xl p-4 shadow-2xl relative group overflow-hidden"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(30,50,80,0.8), rgba(20,35,60,0.9))',
                    border: '1px solid rgba(0, 229, 255, 0.3)',
                    backdropFilter: 'blur(16px)'
                  }}
                >
                  <div className="absolute inset-0 bg-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <textarea 
                    className="w-full bg-transparent outline-none text-[13px] text-slate-200 resize-none h-16 placeholder-slate-400"
                    placeholder="Input threat signal&#10;(URL, code, message)"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleScan()}
                  />
                  <div className="absolute right-2 bottom-2 w-6 h-6 flex items-center justify-center cursor-pointer opacity-70 hover:opacity-100" onClick={handleScan}>
                     👆
                  </div>
                </div>
              </div>

              {/* Right Side Panels */}
              <div className="flex-1 max-w-[340px] ml-auto flex flex-col gap-4">
                
                {/* The Tides Feed */}
                <ObservatoryFeed />

                {/* Aether Vital Stats */}
                <div className="rounded-2xl p-5 relative overflow-hidden"
                     style={{ background: 'linear-gradient(135deg, rgba(20,30,50,0.7), rgba(10,15,30,0.8))', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  
                  <div className="absolute bottom-0 right-0 w-32 h-32 opacity-30">
                    <Globe className="w-full h-full text-cyan-400 animate-pulse" />
                  </div>

                  <h3 className="text-[15px] font-bold text-slate-200 mb-4 relative z-10">
                    Aether Vital Stats <span className="text-slate-400 font-normal text-[12px]">(Global Watch)</span>
                  </h3>
                  
                  <div className="flex gap-4 relative z-10">
                    {/* Vertical Gradient Bar */}
                    <div className="w-3 rounded-full" style={{ background: 'linear-gradient(to bottom, #00E5FF, #818CF8, #C026D3)' }} />
                    
                    <div className="flex flex-col gap-4">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Threats Dissolved (24h)</p>
                        <p className="text-2xl font-bold text-slate-100 font-mono">1.0K</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Data Integrity Score (%)</p>
                        <p className="text-2xl font-bold text-slate-100 font-mono">72%</p>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>

            {/* Bottom Footer Bar */}
            <div className="flex items-center justify-between mt-4 text-[11px] text-slate-500">
              <div className="flex-1" />
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border border-slate-600 border-t-cyan-400 animate-spin" />
                <span className="text-slate-400 font-medium">Matrix Sync Active</span>
                <Settings className="w-3.5 h-3.5 ml-1" />
              </div>
              <div className="flex-1 flex justify-end">
                <span>© 2024 Quantum Security Labs | Refined Matrix Forge</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
