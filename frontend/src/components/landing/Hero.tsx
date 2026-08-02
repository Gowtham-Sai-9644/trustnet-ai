import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, Globe, Search, AlertTriangle, Zap, Eye } from 'lucide-react';

/* ── Live Observatory Feed Items ── */
interface FeedItem {
  id: string;
  label: string;
  time: string;
  type: 'critical' | 'warning' | 'info';
  icon: string;
  detail: string;
}

const FEED_POOL: Omit<FeedItem, 'id' | 'time'>[] = [
  { label: 'UPI Scam Verified', type: 'critical', icon: '🚨', detail: 'merchant-fraud-99@ybl flagged' },
  { label: 'Fake Job Portal', type: 'warning', icon: '🦊', detail: 'jobs-earn-daily.online detected' },
  { label: 'Phishing Domain', type: 'critical', icon: '🎭', detail: 'sbi-verify-now.net — takedown initiated' },
  { label: 'QR Code Threat', type: 'warning', icon: '📱', detail: 'Malicious redirect in QR payload' },
  { label: 'Lottery Scam', type: 'info', icon: '🎰', detail: 'lotto-rewards-claim.cfd — low risk' },
  { label: 'Investment Fraud', type: 'critical', icon: '📉', detail: 'High-yield scheme network found' },
];

const makeFeedItem = (): FeedItem => {
  const base = FEED_POOL[Math.floor(Math.random() * FEED_POOL.length)];
  const now = new Date();
  return {
    ...base,
    id: String(Math.random()),
    time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} ago`,
  };
};

/* ── Realistic Globe Component ── */
const RealisticGlobe: React.FC = () => {
  const rings = 12;
  const nodes = 35;

  const generateNodes = () => {
    return Array.from({ length: nodes }).map((_, i) => {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = 200 + 150 * Math.sin(phi) * Math.cos(theta);
      const y = 200 + 150 * Math.sin(phi) * Math.sin(theta) * 0.4 + 150 * Math.cos(phi) * 0.9;
      // Gold and deep amber nodes for a more physical, realistic look
      const isGold = Math.random() > 0.4;
      const r = Math.random() * 2.5 + 1.5;
      return { x, y, isGold, r, delay: Math.random() * 4 };
    });
  };

  const globeNodes = React.useMemo(generateNodes, []);

  return (
    <g>
      {/* Physical glass/acrylic sphere base */}
      <circle cx="200" cy="200" r="150" fill="url(#glassSphere)" />
      {/* Subtle inner shadow for 3D depth */}
      <circle cx="200" cy="200" r="150" fill="url(#innerShadow)" />

      {/* Latitudinal rings (horizontal) - styled like engraved metallic lines */}
      {[1, 2, 3, 4, 5].map(i => {
        const ry = 150 * Math.sin(Math.PI * i / 6);
        const yOffset = 150 * Math.cos(Math.PI * i / 6);
        return (
          <ellipse
            key={`lat-${i}`}
            cx="200" cy={200 + yOffset * 0.3}
            rx={150 * Math.sin(Math.acos(yOffset/150))} ry={ry * 0.35}
            fill="none"
            stroke="url(#metalLine)"
            strokeWidth="0.75"
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
          stroke="url(#metalLine)"
          strokeWidth="0.75"
          opacity="0.5"
        />
      ))}

      {/* Glowing Nodes - styled like realistic LED indicators */}
      {globeNodes.map((node, i) => (
        <g key={`node-${i}`}>
          <circle
            cx={node.x} cy={node.y} r={node.r * 2.5}
            fill={node.isGold ? '#FDE68A' : '#FCA5A5'}
            opacity="0.2"
          >
            <animate
              attributeName="opacity"
              values="0.1;0.4;0.1"
              dur={`${3 + node.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
          <circle
            cx={node.x} cy={node.y} r={node.r}
            fill={node.isGold ? '#D97706' : '#B91C1C'}
            opacity="0.95"
            stroke={node.isGold ? '#FEF3C7' : '#FEE2E2'}
            strokeWidth="0.5"
          />
        </g>
      ))}

      {/* Front Specular Highlight to enhance 3D realism */}
      <ellipse cx="160" cy="120" rx="40" ry="20" fill="url(#highlight)" transform="rotate(-30 160 120)" />
    </g>
  );
};

/* ── Main Hero ── */
export const Hero: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [feedItems, setFeedItems] = useState<FeedItem[]>(() =>
    [0, 1, 2].map(() => makeFeedItem())
  );
  const [blockedCount] = useState(1_247_382);
  const [scanning, setScanning] = useState(false);
  const navigate = useNavigate();

  /* Rotate feed every 4 s */
  useEffect(() => {
    const t = setInterval(() => {
      setFeedItems(prev => [makeFeedItem(), ...prev.slice(0, 2)]);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const handleScan = () => {
    if (!inputValue.trim()) return;
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      navigate('/console/analysis');
    }, 800);
  };

  const typeColors = {
    critical: { bg: '#FFF0F0', border: '#FECACA', text: '#B91C1C' },
    warning:  { bg: '#FFFBEB', border: '#FDE68A', text: '#92400E' },
    info:     { bg: '#F0F9FF', border: '#BAE6FD', text: '#0369A1' },
  };

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-start pt-24 pb-10 px-4 overflow-hidden"
    >
      {/* ── Left: Floating shield + social ── */}
      <div className="hidden lg:flex flex-col items-center gap-4 absolute left-6 top-1/3 -translate-y-1/2 z-10">
        {/* Shield illustration */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative"
        >
          <div
            className="w-24 h-28 rounded-2xl flex items-center justify-center shadow-xl"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.9), rgba(245,237,216,0.7))',
              border: '2px solid rgba(180,140,60,0.3)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #93C5FD, #6366F1)' }}
            >
              <ShieldAlert className="w-9 h-9 text-white" />
            </div>
          </div>
          {/* Glow dots */}
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 shadow-lg animate-pulse" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-emerald-400 shadow-lg animate-pulse" />
        </motion.div>

        {/* Social media bubbles */}
        {[
          { color: '#1877F2', label: 'f' },
          { color: '#1DA1F2', label: '𝕏' },
          { color: '#E60023', label: '𝑃' },
          { color: '#C13584', label: '◉' },
        ].map((s, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.15 }}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md cursor-pointer"
            style={{ background: s.color }}
          >
            {s.label}
          </motion.div>
        ))}
      </div>

      {/* ── Center Content ── */}
      <div className="max-w-5xl w-full mx-auto text-center flex flex-col items-center">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-2"
            style={{ color: '#1C0D00', fontFamily: "'Outfit', sans-serif" }}
          >
            The Safety Compass
          </h1>
          <p
            className="text-base md:text-lg font-medium mb-6"
            style={{ color: '#5C3D11' }}
          >
            India's AI-powered scam detection engine — URLs, UPI, messages &amp; beyond
          </p>
        </motion.div>

        {/* ── Compass SVG ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative w-[340px] h-[340px] md:w-[400px] md:h-[400px] mx-auto mb-6"
        >
          <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="glassSphere" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#F5EDD8" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#8B6914" stopOpacity="0.3" />
              </radialGradient>
              <radialGradient id="innerShadow" cx="50%" cy="50%" r="50%">
                <stop offset="70%" stopColor="transparent" />
                <stop offset="100%" stopColor="#452a0a" stopOpacity="0.4" />
              </radialGradient>
              <linearGradient id="metalLine" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#B48C3C" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#FDE68A" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#78350F" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="highlight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>
            </defs>

            <RealisticGlobe />
          </svg>

          {/* Floating Labels - styled as physical metallic plates */}
          <div className="absolute top-[8%] left-[-5%] px-3 py-1.5 rounded text-[10px] font-bold shadow-md uppercase tracking-wider"
               style={{ background: 'linear-gradient(to bottom, #F5EDD8, #E8D5A8)', border: '1px solid #B48C3C', color: '#5C3D11' }}>
            Active Scanning
          </div>
          <div className="absolute top-[18%] right-[-10%] px-3 py-1.5 rounded text-[10px] font-bold shadow-md uppercase tracking-wider"
               style={{ background: 'linear-gradient(to bottom, #F5EDD8, #E8D5A8)', border: '1px solid #B48C3C', color: '#5C3D11' }}>
            Threat Telemetry
          </div>
          <div className="absolute bottom-[20%] left-[-15%] px-3 py-1.5 rounded text-[10px] font-bold shadow-md uppercase tracking-wider"
               style={{ background: 'linear-gradient(to bottom, #F5EDD8, #E8D5A8)', border: '1px solid #B48C3C', color: '#5C3D11' }}>
            Signal Intercept
          </div>
          <div className="absolute bottom-[10%] right-[-5%] px-3 py-1.5 rounded text-[10px] font-bold shadow-md uppercase tracking-wider"
               style={{ background: 'linear-gradient(to bottom, #F5EDD8, #E8D5A8)', border: '1px solid #B48C3C', color: '#5C3D11' }}>
            Pattern Matching
          </div>

          {/* Corner tech badges */}
          {[
            { label: '🔗 URL', pos: 'top-2 left-0' },
            { label: '📱 UPI', pos: 'top-2 right-0' },
            { label: '💬 SMS', pos: 'bottom-2 left-0' },
            { label: '📷 QR',  pos: 'bottom-2 right-0' },
          ].map(({ label, pos }) => (
            <div
              key={label}
              className={`absolute ${pos} text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm`}
              style={{
                background: 'rgba(255,255,255,0.85)',
                border: '1px solid rgba(180,140,60,0.3)',
                color: '#5C3D11',
                backdropFilter: 'blur(4px)',
              }}
            >
              {label}
            </div>
          ))}
        </motion.div>

        {/* ── Scan Input ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-lg mx-auto relative"
        >
          <div
            className="flex items-center rounded-2xl overflow-hidden shadow-xl"
            style={{
              background: 'rgba(255,255,255,0.92)',
              border: '1.5px solid rgba(180,140,60,0.35)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Search className="w-4 h-4 ml-4 flex-shrink-0" style={{ color: '#9CA3AF' }} />
            <input
              className="flex-1 px-3 py-4 text-sm bg-transparent outline-none"
              style={{ color: '#1C0D00' }}
              placeholder="Input fraud signal (URL, message, UPI, code)…"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleScan()}
            />
            <button
              onClick={handleScan}
              disabled={scanning}
              className="mr-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, #8B6914, #C9971A)',
                color: '#FFFFFF',
                letterSpacing: '0.1em',
              }}
            >
              {scanning ? '…' : 'Deconstruct'}
            </button>
          </div>
          <p className="text-[11px] mt-2" style={{ color: '#9CA3AF' }}>
            Supports: URLs · UPI IDs · Phone numbers · SMS text · QR payloads
          </p>
        </motion.div>

        {/* ── Global Watch Panel ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="w-full max-w-lg mx-auto mt-5 rounded-2xl overflow-hidden shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #67E8F9 0%, #818CF8 50%, #C084FC 100%)',
          }}
        >
          <div className="p-5 flex items-center justify-between relative overflow-hidden">
            {/* Globe illustration */}
            <div className="relative z-10">
              <p className="text-xl font-extrabold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Global Watch
              </p>
              <p className="text-sm font-medium text-white/80 mt-0.5">Threats Blocked Today:</p>
              <p className="text-4xl font-black text-white mt-1 tracking-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {(blockedCount + Math.floor(Math.random() * 10)).toLocaleString()}
              </p>
            </div>
            {/* Globe SVG */}
            <div className="relative z-10">
              <Globe className="w-20 h-20 text-white/30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-2 border-white/40 animate-spin" style={{ borderTopColor: 'rgba(255,255,255,0.9)', animationDuration: '3s' }} />
              </div>
            </div>
            {/* Background shimmer blobs */}
            <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <div className="absolute -left-4 -top-4 w-20 h-20 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>
          {/* Pulse indicator */}
          <div
            className="px-5 py-2.5 flex items-center gap-2"
            style={{ background: 'rgba(0,0,0,0.12)', borderTop: '1px solid rgba(255,255,255,0.15)' }}
          >
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-amber-300 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-300" />
            </span>
            <span className="text-xs font-medium text-white/80">
              Global Watch Pulse · {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-3 mt-5"
        >
          <Link
            to="/console"
            className="px-6 py-2.5 rounded-full text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #8B6914, #C9971A)', color: '#FFFFFF' }}
          >
            Open Full Console →
          </Link>
          <a
            href="#architecture"
            className="px-6 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105"
            style={{
              background: 'rgba(255,255,255,0.7)',
              color: '#5C3D11',
              border: '1.5px solid rgba(180,140,60,0.3)',
              backdropFilter: 'blur(4px)',
            }}
          >
            See Architecture
          </a>
        </motion.div>
      </div>

      {/* ── Right: Scam Observatory Feed ── */}
      <div className="hidden lg:flex flex-col gap-3 absolute right-4 xl:right-8 top-28 w-52 z-10">
        <div
          className="px-4 py-2 rounded-xl text-sm font-bold"
          style={{ color: '#2D1B00', background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)' }}
        >
          🔭 Scam Observatory
        </div>
        <AnimatePresence>
          {feedItems.map((item) => {
            const colors = typeColors[item.type];
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl p-3 shadow-md cursor-pointer hover:scale-[1.02] transition-transform"
                style={{
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                    style={{ background: 'rgba(255,255,255,0.7)' }}
                  >
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold leading-tight" style={{ color: colors.text }}>
                      Observatory Feed:
                    </p>
                    <p className="text-[10px] font-medium truncate" style={{ color: '#374151' }}>
                      {item.label}
                    </p>
                    <p className="text-[9px] mt-0.5" style={{ color: '#9CA3AF' }}>
                      Verified · {item.time}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
};
