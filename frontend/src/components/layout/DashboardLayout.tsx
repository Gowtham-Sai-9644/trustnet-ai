import React, { useEffect, useState, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import NavigationSidebar from './NavigationSidebar';
import { Search, Activity, Radio, Cpu, Database, Menu } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchCommandPalette } from '../ui/SearchCommandPalette';

interface StreamEvent {
  id: string;
  time: string;
  type: 'INFO' | 'WARNING' | 'CRITICAL';
  source: string;
  message: string;
}

const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { systemHealth, fetchSystemHealth, setInputs } = useAppStore();
  const { theme } = useTheme();
  const [showTelemetry, setShowTelemetry] = useState(true);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);
  const [activeFeedTab, setActiveFeedTab] = useState<'all' | 'threat' | 'investigate' | 'discover' | 'escalate' | 'evolve'>('all');
  const [streamEvents, setStreamEvents] = useState<StreamEvent[]>([]);
  const [telemetryStats, setTelemetryStats] = useState({
    scannedCount: 235795,
    criticalAlerts: 142,
    cpuLoad: 28,
    dbLatency: 4.8
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetchSystemHealth();
    const interval = setInterval(fetchSystemHealth, 15000);
    return () => clearInterval(interval);
  }, [fetchSystemHealth]);

  // Key bind for Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initial stream seed
  useEffect(() => {
    const seedEvents: StreamEvent[] = [
      { id: '1', time: '13:41:02', type: 'CRITICAL', source: 'THREAT', message: 'Risk score 0.98 triggered on merchant-scam-address-24@ybl' },
      { id: '2', time: '13:41:12', type: 'WARNING', source: 'EVOLVE', message: 'Redirect loop detected on suspect-upi-mule-11.com' },
      { id: '3', time: '13:41:35', type: 'INFO', source: 'DISCOVER', message: 'Network expansion: Newly discovered UPI node registered payout.mule@ybl' },
      { id: '4', time: '13:41:50', type: 'CRITICAL', source: 'ESCALATE', message: 'Urgent: Escalated UPI merchant node to risk level CRITICAL' },
      { id: '5', time: '13:42:01', type: 'INFO', source: 'INVESTIGATE', message: 'Active case trace completed for indicator +91 99887 76655' }
    ];
    setStreamEvents(seedEvents);
  }, []);

  // Event stream simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const types: ('INFO' | 'WARNING' | 'CRITICAL')[] = ['INFO', 'WARNING', 'CRITICAL'];
      const feeds = [
        { source: 'THREAT', message: 'High entropy domain pattern detected: rewards-claim-web.info' },
        { source: 'EVOLVE', message: 'Model drift check complete: IndicBERT accuracy within nominal baselines' },
        { source: 'DISCOVER', message: 'Network expansion: Auto-mapped adjacent hop sub-ledger-88@paytm' },
        { source: 'ESCALATE', message: 'Coercion probability exceeded threshold on threat ticket TXN-72091' },
        { source: 'INVESTIGATE', message: 'Compliance playbook verified: PCI-DSS rules applied to suspect transfer' }
      ];
      const selectedFeed = feeds[Math.floor(Math.random() * feeds.length)];
      const randomType = types[Math.floor(Math.random() * types.length)];
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      const newEvent: StreamEvent = {
        id: String(Math.random()),
        time: timeStr,
        type: randomType,
        source: selectedFeed.source,
        message: selectedFeed.message
      };
      setStreamEvents(prev => [newEvent, ...prev.slice(0, 9)]);
      setTelemetryStats(prev => ({
        scannedCount: prev.scannedCount + 1,
        criticalAlerts: prev.criticalAlerts + (randomType === 'CRITICAL' ? 1 : 0),
        cpuLoad: Math.floor(22 + Math.random() * 15),
        dbLatency: Number((3.5 + Math.random() * 2.5).toFixed(1))
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogClick = (event: StreamEvent) => {
    let type: 'url' | 'upi' | 'phone' | 'messageText' = 'url';
    let value = '';
    if (event.message.includes('@')) {
      type = 'upi';
      const match = event.message.match(/[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+/);
      value = match ? match[0] : 'merchant-scam-address-24@ybl';
    } else if (event.message.includes('.com') || event.message.includes('.info') || event.message.includes('.cfd')) {
      type = 'url';
      const match = event.message.match(/[a-zA-Z0-9.-]+\.[a-z]{2,}/);
      value = match ? 'https://' + match[0] : 'https://suspect-upi-mule-11.com';
    } else if (event.message.includes('+91')) {
      type = 'phone';
      const match = event.message.match(/\+91\s*[0-9\s]{8,15}/);
      value = match ? match[0] : '+91 9988776655';
    } else {
      type = 'url';
      value = 'https://lotto-rewards-claim.cfd';
    }
    setInputs({ [type]: value });
    if (type === 'upi' || type === 'phone') {
      navigate('/console/investigations');
    } else {
      navigate('/console/analysis');
    }
  };

  // Waveform canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationId: number;
    let offset = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      const gridSpacing = 20;
      for (let x = 0; x < canvas.width; x += gridSpacing) {
        ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height);
      }
      for (let y = 0; y < canvas.height; y += gridSpacing) {
        ctx.moveTo(0, y); ctx.lineTo(canvas.width, y);
      }
      ctx.stroke();
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + Math.sin(x * 0.03 + offset) * 12 * Math.cos(x * 0.01 + offset * 0.5);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      offset += 0.02;
      animationId = requestAnimationFrame(draw);
    };
    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 288;
      canvas.height = 80;
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    draw();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [showTelemetry]);

  const getPageTitle = (path: string) => {
    switch (path) {
      case '/console':
      case '/console/analysis': return 'Calibrated Threat Analysis';
      case '/console/investigations': return 'Investigation Room';
      case '/console/research': return 'Observability & Model Registry';
      case '/console/reports': return 'Incident Intake Portal';
      case '/console/assistant': return 'Digital Fraud Analyst';
      case '/console/viva': return 'Governance & Assurance Audit';
      case '/console/settings': return 'System Configurations';
      default: return 'TrustNet OS';
    }
  };



  return (
    <div
      className="flex h-screen w-screen overflow-hidden font-sans"
      style={{ background: 'var(--theme-bg)', color: 'var(--theme-text)' }}
    >
      {/* ── Left Sidebar ── */}
      <NavigationSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isCollapsed={isDesktopSidebarCollapsed}
        onToggleCollapse={() => setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed)}
      />

      {/* ── Main Column ── */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">

        {/* ── Top Navigation Bar ── */}
        <header
          className="h-14 px-4 md:px-6 flex items-center justify-between z-10 flex-shrink-0"
          style={{
            background: 'var(--theme-surface)',
            borderBottom: '1px solid var(--theme-border)',
            boxShadow: '0 1px 0 0 var(--theme-border)'
          }}
        >
          {/* Left: hamburger + page title + search */}
          <div className="flex items-center space-x-3 md:space-x-5 min-w-0 flex-1">
            <button
              className="md:hidden p-1.5 -ml-2 rounded-lg transition-colors flex-shrink-0"
              style={{ color: 'var(--theme-text-muted)' }}
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Page title with gradient underline */}
            <div className="flex flex-col items-start min-w-0">
              <h2
                className="font-display font-bold text-[11px] uppercase tracking-widest truncate"
                style={{ color: 'var(--theme-text)' }}
              >
                {getPageTitle(location.pathname)}
              </h2>
              <div
                className="h-0.5 w-10 rounded-full mt-0.5"
                style={{ background: 'linear-gradient(90deg, var(--theme-accent-start), var(--theme-accent-end))' }}
              />
            </div>

            {/* Command Palette Search Trigger */}
            <div
              onClick={() => setIsPaletteOpen(true)}
              className="hidden md:flex items-center relative w-60 cursor-pointer flex-shrink-0 group"
            >
              <Search
                className="absolute left-3 w-3.5 h-3.5 transition-colors"
                style={{ color: 'var(--theme-text-muted)' }}
              />
              <div
                className="w-full rounded-xl pl-9 pr-12 py-2 text-[10px] text-left transition-all font-sans select-none"
                style={{
                  background: 'var(--theme-bg)',
                  border: '1px solid var(--theme-border)',
                  color: 'var(--theme-text-muted)'
                }}
              >
                Search cases, threats, indicators…
              </div>
              <div
                className="absolute right-2.5 px-1.5 py-0.5 rounded text-[8px] font-mono select-none"
                style={{ background: 'var(--theme-border)', color: 'var(--theme-text-muted)' }}
              >
                ⌘K
              </div>
            </div>
          </div>

          {/* Right: theme switcher + health badges + telemetry toggle + operator */}
          <div className="flex items-center space-x-2 md:space-x-3 flex-shrink-0 ml-2">



            {/* Health Status Pills */}
            <div
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-[9px] select-none"
              style={{ background: 'var(--theme-card)', border: '1px solid var(--theme-border)', color: 'var(--theme-text-muted)' }}
            >
              <span className="text-[8px] uppercase tracking-wider font-bold" style={{ opacity: 0.6 }}>Health</span>
              {[
                { label: 'API', ok: systemHealth?.api },
                { label: 'SQL', ok: systemHealth?.postgres },
                { label: 'NEO4J', ok: systemHealth?.neo4j }
              ].map(s => (
                <div key={s.label} className="flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${s.ok ? 'bg-emerald-400' : 'bg-red-500'}`} />
                  <span style={{ color: 'var(--theme-text)' }}>{s.label}</span>
                </div>
              ))}
            </div>

            {/* Telemetry Toggle */}
            <button
              onClick={() => setShowTelemetry(prev => !prev)}
              className="p-1.5 rounded-xl border transition-all flex items-center justify-center cursor-pointer flex-shrink-0"
              title="Toggle Live Signal Feed"
              style={showTelemetry ? {
                background: 'color-mix(in srgb, var(--theme-accent-start) 12%, transparent)',
                borderColor: 'color-mix(in srgb, var(--theme-accent-start) 40%, transparent)',
                color: 'var(--theme-accent-start)'
              } : {
                background: 'var(--theme-card)',
                borderColor: 'var(--theme-border)',
                color: 'var(--theme-text-muted)'
              }}
            >
              <Radio className={`w-4 h-4 ${showTelemetry ? 'animate-pulse' : ''}`} />
            </button>

            {/* Operator Profile */}
            <div
              className="flex items-center gap-2.5 pl-3"
              style={{ borderLeft: '1px solid var(--theme-border)' }}
            >
              <div className="relative flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80"
                  alt="Operator"
                  className="w-7 h-7 rounded-full object-cover"
                  style={{ border: '2px solid color-mix(in srgb, var(--theme-accent-start) 50%, transparent)' }}
                />
                <span
                  className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400"
                  style={{ border: '2px solid var(--theme-surface)' }}
                />
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[11px] font-semibold leading-tight" style={{ color: 'var(--theme-text)' }}>Gowtham Sai</span>
                <span className="text-[8px] font-mono uppercase tracking-wider" style={{ color: 'var(--theme-accent-start)' }}>SecOps Operator</span>
              </div>
            </div>
          </div>
        </header>

        {/* ── Main Content ── */}
        <main
          className="flex-1 overflow-y-auto p-6 relative"
          style={{ background: 'var(--theme-bg)' }}
        >
          {/* Ambient gradient glows */}
          <div
            className="pointer-events-none fixed inset-0 z-0"
            style={{
              background: `
                radial-gradient(ellipse 55% 38% at 25% 15%, color-mix(in srgb, var(--theme-accent-start) 6%, transparent), transparent),
                radial-gradient(ellipse 45% 32% at 82% 85%, color-mix(in srgb, var(--theme-accent-end) 5%, transparent), transparent)
              `
            }}
          />
          <div className="max-w-[1440px] mx-auto w-full relative z-10">
            <Outlet />
          </div>
        </main>
      </div>

      {/* ── Right Telemetry Sidebar ── */}
      <AnimatePresence>
        {showTelemetry && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 288, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="hidden xl:flex flex-col w-72 h-screen overflow-hidden relative z-20 flex-shrink-0"
            style={{ background: 'var(--theme-surface)', borderLeft: '1px solid var(--theme-border)' }}
          >
            {/* Header */}
            <div
              className="p-4 flex items-center justify-between flex-shrink-0"
              style={{ borderBottom: '1px solid var(--theme-border)' }}
            >
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--theme-text)' }}>
                <Activity className="w-3.5 h-3.5" style={{ color: 'var(--theme-accent-start)' }} />
                Live Signal Telemetry
              </span>
              <span
                className="px-1.5 py-0.5 rounded font-mono text-[8px] font-bold border animate-pulse"
                style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', borderColor: 'rgba(239,68,68,0.25)' }}
              >
                STREAM ACTIVE
              </span>
            </div>

            {/* Stats Grid */}
            <div
              className="p-4 grid grid-cols-2 gap-2 flex-shrink-0"
              style={{ borderBottom: '1px solid var(--theme-border)' }}
            >
              {[
                { label: 'Total Scans', value: telemetryStats.scannedCount.toLocaleString(), accent: 'var(--theme-accent-start)' },
                { label: 'Critical Alerts', value: String(telemetryStats.criticalAlerts), accent: '#EF4444' },
              ].map(({ label, value, accent }) => (
                <div
                  key={label}
                  className="p-2.5 rounded-xl"
                  style={{ background: 'var(--theme-card)', border: '1px solid var(--theme-border)' }}
                >
                  <span className="text-[7px] font-mono uppercase block mb-1" style={{ color: 'var(--theme-text-muted)' }}>{label}</span>
                  <span className="text-xs font-bold font-mono" style={{ color: accent }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Waveform */}
            <div
              className="p-4 flex flex-col items-center flex-shrink-0"
              style={{ borderBottom: '1px solid var(--theme-border)' }}
            >
              <span className="text-[7px] font-mono uppercase tracking-widest block mb-2 w-full" style={{ color: 'var(--theme-text-muted)' }}>
                Threat Frequency Amplitude
              </span>
              <div
                className="w-full rounded-xl overflow-hidden"
                style={{ background: 'var(--theme-bg)', border: '1px solid var(--theme-border)' }}
              >
                <canvas ref={canvasRef} className="w-full h-20" />
              </div>
            </div>

            {/* Resource Overhead */}
            <div
              className="p-4 space-y-2 flex-shrink-0"
              style={{ borderBottom: '1px solid var(--theme-border)' }}
            >
              <span className="text-[8px] font-sans font-bold uppercase tracking-wide block" style={{ color: 'var(--theme-text-muted)', opacity: 0.7 }}>Resource Overhead</span>
              {[
                { Icon: Cpu, label: 'CPU Overhead', value: `${telemetryStats.cpuLoad}%`, accent: 'var(--theme-accent-start)' },
                { Icon: Database, label: 'DB Latency', value: `${telemetryStats.dbLatency}ms`, accent: '#22C55E' },
              ].map(({ Icon, label, value, accent }) => (
                <div
                  key={label}
                  className="flex justify-between items-center px-2.5 py-1.5 rounded-lg"
                  style={{ background: 'var(--theme-card)', border: '1px solid var(--theme-border)' }}
                >
                  <div className="flex items-center gap-1.5 font-mono text-[9px]">
                    <Icon className="w-3 h-3" style={{ color: accent }} />
                    <span style={{ color: 'var(--theme-text-muted)' }}>{label}</span>
                  </div>
                  <span className="text-[9px] font-bold font-mono" style={{ color: 'var(--theme-text)' }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Feed Tabs */}
            <div
              className="px-4 py-2 flex gap-1 overflow-x-auto no-scrollbar font-mono text-[8px] flex-shrink-0"
              style={{ borderBottom: '1px solid color-mix(in srgb, var(--theme-border) 60%, transparent)' }}
            >
              {(['all', 'threat', 'investigate', 'discover', 'escalate', 'evolve'] as const).map(id => (
                <button
                  key={id}
                  onClick={() => setActiveFeedTab(id)}
                  className="px-1.5 py-0.5 rounded transition-all whitespace-nowrap cursor-pointer"
                  style={activeFeedTab === id ? {
                    background: 'color-mix(in srgb, var(--theme-accent-start) 12%, transparent)',
                    color: 'var(--theme-accent-start)',
                    border: '1px solid color-mix(in srgb, var(--theme-accent-start) 30%, transparent)',
                    fontWeight: 'bold'
                  } : {
                    color: 'var(--theme-text-muted)',
                    border: '1px solid transparent'
                  }}
                >
                  {id.toUpperCase().slice(0, 6)}
                </button>
              ))}
            </div>

            {/* Live Stream Events */}
            <div className="flex-1 p-4 flex flex-col min-h-0 overflow-hidden">
              <span className="text-[8px] font-sans font-bold uppercase tracking-wide block mb-2 flex-shrink-0" style={{ color: 'var(--theme-text-muted)', opacity: 0.7 }}>
                Live Activity Stream
              </span>
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                <AnimatePresence initial={false}>
                  {streamEvents
                    .filter(ev => {
                      if (activeFeedTab === 'all') return true;
                      return ev.source === activeFeedTab.toUpperCase();
                    })
                    .map(ev => (
                      <motion.div
                        key={ev.id}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        onClick={() => handleLogClick(ev)}
                        className="pb-2 text-[9px] font-mono leading-relaxed cursor-pointer p-2 rounded-xl transition-all block"
                        style={{ borderBottom: '1px solid color-mix(in srgb, var(--theme-border) 40%, transparent)' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'color-mix(in srgb, var(--theme-border) 50%, transparent)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span style={{ color: 'var(--theme-text-muted)' }}>{ev.time}</span>
                          <span
                            className="px-1.5 py-0.5 rounded font-bold border text-[8px]"
                            style={
                              ev.type === 'CRITICAL'
                                ? { background: 'rgba(239,68,68,0.1)', color: '#EF4444', borderColor: 'rgba(239,68,68,0.25)' }
                                : ev.type === 'WARNING'
                                ? { background: 'rgba(245,158,11,0.1)', color: '#F59E0B', borderColor: 'rgba(245,158,11,0.25)' }
                                : { background: 'color-mix(in srgb, var(--theme-accent-start) 10%, transparent)', color: 'var(--theme-accent-start)', borderColor: 'color-mix(in srgb, var(--theme-accent-start) 25%, transparent)' }
                            }
                          >
                            {ev.source}
                          </span>
                        </div>
                        <p className="text-[9px] tracking-tight" style={{ color: 'var(--theme-text)', opacity: 0.85 }}>{ev.message}</p>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Global Command Palette */}
      <SearchCommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
      />
    </div>
  );
};

export default DashboardLayout;
