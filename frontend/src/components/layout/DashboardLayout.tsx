import React, { useEffect, useState, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import NavigationSidebar from './NavigationSidebar';
import { Search, Activity, Radio, Cpu, Network, Database, ChevronRight, ChevronLeft, Volume2, ShieldAlert, Menu } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
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
  const [showTelemetry, setShowTelemetry] = useState(true);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  // Initial stream seed matching different feeds
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
      
      // Update telemetry numbers
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

    // Extract indicator from log message
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
      // Fallback
      type = 'url';
      value = 'https://lotto-rewards-claim.cfd';
    }

    setInputs({ [type]: value });

    // Navigate to respective pages
    if (type === 'upi' || type === 'phone') {
      navigate('/console/graph');
    } else {
      navigate('/console/analysis');
    }
  };

  // Ambient canvas waveform animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let offset = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      
      // Draw grid lines
      const gridSpacing = 20;
      for (let x = 0; x < canvas.width; x += gridSpacing) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      for (let y = 0; y < canvas.height; y += gridSpacing) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      ctx.stroke();

      // Draw active waveform
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
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

    // Resize handler
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
  
  // Resolve view title from active route
  const getPageTitle = (path: string) => {
    switch(path) {
      case '/console': return 'Mission Control Cockpit';
      case '/console/analysis': return 'Calibrated Threat Analysis';
      case '/console/graph': return 'Graph Intelligence Workspace';
      case '/console/research': return 'Observability & Model Registry';
      case '/console/reports': return 'Incident Intake Portal';
      case '/console/assistant': return 'Digital Fraud Analyst';
      case '/console/viva': return 'Governance & Assurance Audit';
      case '/console/settings': return 'System Configurations';
      default: return 'TrustNet OS';
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#050811] text-slate-100 font-sans selection:bg-[#00E5FF]/20 selection:text-slate-200">
      {/* Left Sidebar */}
      <NavigationSidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      {/* Main Area (Top Nav + Workspace Panel) */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Navigation */}
        <header className="h-14 border-b border-[#1E293B] bg-[#0B1220] px-4 md:px-6 flex items-center justify-between z-10 flex-shrink-0">
          <div className="flex items-center space-x-3 md:space-x-8 min-w-0 flex-1">
            <button 
              className="md:hidden p-1.5 -ml-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#1E293B] transition-colors flex-shrink-0"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="font-sans font-bold text-xs text-slate-100 uppercase tracking-tight truncate text-left">
              {getPageTitle(location.pathname)}
            </h2>
            
            {/* Command Palette Trigger Search Box */}
            <div 
              onClick={() => setIsPaletteOpen(true)}
              className="hidden md:flex items-center relative w-72 cursor-pointer group flex-shrink-0"
            >
              <Search className="absolute left-3 w-3.5 h-3.5 text-slate-500 group-hover:text-[#00E5FF] transition-colors" />
              <div className="w-full bg-[#050811] border border-[#1E293B] group-hover:border-[#00E5FF]/40 rounded-xl pl-9 pr-8 py-2 text-[10px] text-slate-500 text-left transition-all font-sans select-none">
                Search cases, indicators, networks...
              </div>
              <div className="absolute right-2 px-1.5 py-0.5 rounded bg-[#1E293B] text-[8px] text-slate-500 font-mono select-none">
                ⌘K
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 md:space-x-4 flex-shrink-0 ml-2">
            {/* Health Tickers */}
            <div className="hidden sm:flex items-center space-x-3 bg-[#111827] px-3 py-1.5 rounded-xl border border-[#1E293B] font-mono text-[9px] text-slate-400 select-none">
              <span className="text-[8px] uppercase tracking-wider text-slate-500 font-bold mr-1">System Health:</span>
              <div className="flex items-center space-x-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${systemHealth?.api ? 'bg-[#22C55E]' : 'bg-[#EF4444]'}`} />
                <span className="text-slate-300">API</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${systemHealth?.postgres ? 'bg-[#22C55E]' : 'bg-[#EF4444]'}`} />
                <span className="text-slate-300">SQL</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${systemHealth?.neo4j ? 'bg-[#22C55E]' : 'bg-[#F59E0B]'}`} />
                <span className="text-slate-300">NEO4J</span>
              </div>
            </div>

            {/* Toggle Telemetry Stream */}
            <button 
              onClick={() => setShowTelemetry(prev => !prev)}
              className={`p-1.5 rounded-xl border transition-all flex items-center justify-center cursor-pointer flex-shrink-0 ${
                showTelemetry 
                  ? 'bg-[#00E5FF]/10 border-[#00E5FF]/30 text-[#00E5FF]' 
                  : 'bg-[#111827] border-[#1E293B] text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle Telemetry Stream"
            >
              <Radio className={`w-4 h-4 ${showTelemetry ? 'animate-pulse' : ''}`} />
            </button>
            
            {/* Operator Profile Card */}
            <div className="flex items-center space-x-2.5 border-l border-[#1E293B] pl-3 md:pl-4">
              <div className="relative flex-shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80" 
                  alt="Operator Profile" 
                  className="w-7 h-7 rounded-full object-cover border border-[#00E5FF]/40"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#22C55E] border border-[#050811]" />
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[11px] font-semibold text-slate-200 leading-tight">Gowtham Sai</span>
                <span className="text-[8px] font-mono text-[#00E5FF] uppercase tracking-wider leading-none">SecOps Operator</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Workspace Viewport */}
        <main className="flex-1 overflow-y-auto bg-[#050811] p-6 relative">
          <div className="max-w-[1440px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Right Intelligence Telemetry & Threat Activity Sidebar */}
      <AnimatePresence>
        {showTelemetry && (
          <motion.aside 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 288, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="hidden xl:flex flex-col w-72 bg-[#0B1220] border-l border-[#1E293B] h-screen overflow-hidden relative z-20 flex-shrink-0"
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-[#1E293B] flex items-center justify-between">
              <span className="text-[10px] font-sans font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                <Activity className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>Live Signal Telemetry</span>
              </span>
              <span className="bg-[#EF4444]/10 text-[#EF4444] px-1.5 py-0.5 rounded font-mono text-[8px] font-bold border border-[#EF4444]/20 animate-pulse">
                STREAM ACTIVE
              </span>
            </div>

            {/* Live Telemetry counters */}
            <div className="p-4 border-b border-[#1E293B] grid grid-cols-2 gap-2 text-left">
              <div className="bg-[#111827] border border-[#1E293B] p-2 rounded-xl">
                <span className="text-[7px] text-slate-500 font-mono uppercase block">Total Scans</span>
                <span className="text-xs font-bold font-mono text-[#00E5FF]">
                  {telemetryStats.scannedCount.toLocaleString()}
                </span>
              </div>
              <div className="bg-[#111827] border border-[#1E293B] p-2 rounded-xl">
                <span className="text-[7px] text-slate-500 font-mono uppercase block">Critical Alerts</span>
                <span className="text-xs font-bold font-mono text-[#EF4444]">
                  {telemetryStats.criticalAlerts}
                </span>
              </div>
            </div>

            {/* Waveform Visualization */}
            <div className="p-4 border-b border-[#1E293B] bg-[#050811]/40 flex flex-col items-center">
              <span className="text-[7px] font-mono text-slate-500 uppercase tracking-widest block mb-2 text-left w-full">Threat Frequency Amplitude</span>
              <div className="w-full bg-[#050811] rounded-xl border border-[#1E293B] overflow-hidden flex items-center justify-center">
                <canvas ref={canvasRef} className="w-full h-20" />
              </div>
            </div>

            {/* Live Operational Health Status */}
            <div className="p-4 border-b border-[#1E293B] space-y-2 text-left font-mono text-[9px] text-slate-400">
              <span className="text-[8px] font-sans font-bold text-slate-500 uppercase tracking-wide block mb-1">Resource Overhead</span>
              <div className="flex justify-between items-center bg-[#111827]/40 px-2.5 py-1.5 rounded-lg border border-[#1E293B]/60">
                <div className="flex items-center space-x-1.5">
                  <Cpu className="w-3 h-3 text-[#00E5FF]" />
                  <span>CPU Overhead</span>
                </div>
                <span className="text-slate-200">{telemetryStats.cpuLoad}%</span>
              </div>
              <div className="flex justify-between items-center bg-[#111827]/40 px-2.5 py-1.5 rounded-lg border border-[#1E293B]/60">
                <div className="flex items-center space-x-1.5">
                  <Database className="w-3 h-3 text-[#22C55E]" />
                  <span>DB Latency</span>
                </div>
                <span className="text-slate-200">{telemetryStats.dbLatency}ms</span>
              </div>
            </div>

            {/* Feed Selector Tabs */}
            <div className="px-4 py-2 border-b border-[#1E293B]/60 flex space-x-1.5 overflow-x-auto no-scrollbar font-mono text-[8px] scroll-smooth">
              {[
                { id: 'all', label: 'ALL' },
                { id: 'threat', label: 'THREATS' },
                { id: 'investigate', label: 'INVEST' },
                { id: 'discover', label: 'DISCOV' },
                { id: 'escalate', label: 'ESCAL' },
                { id: 'evolve', label: 'EVOLV' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveFeedTab(t.id as any)}
                  className={`px-1.5 py-0.5 rounded transition-all whitespace-nowrap cursor-pointer border ${
                    activeFeedTab === t.id 
                      ? 'bg-[#00E5FF]/10 text-[#00E5FF] font-bold border-[#00E5FF]/30' 
                      : 'text-slate-500 border-transparent hover:text-slate-300'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Live Event Stream logs */}
            <div className="flex-1 p-4 flex flex-col min-h-0 text-left">
              <span className="text-[8px] font-sans font-bold text-slate-500 uppercase tracking-wide block mb-2">Live Activity Stream</span>
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                <AnimatePresence initial={false}>
                  {streamEvents
                    .filter(event => {
                      if (activeFeedTab === 'all') return true;
                      if (activeFeedTab === 'threat') return event.source === 'THREAT';
                      if (activeFeedTab === 'investigate') return event.source === 'INVESTIGATE';
                      if (activeFeedTab === 'discover') return event.source === 'DISCOVER';
                      if (activeFeedTab === 'escalate') return event.source === 'ESCALATE';
                      if (activeFeedTab === 'evolve') return event.source === 'EVOLVE';
                      return true;
                    })
                    .map(event => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        onClick={() => handleLogClick(event)}
                        className="border-b border-[#1E293B]/40 pb-2 text-[9px] font-mono leading-relaxed cursor-pointer hover:bg-[#1E293B]/20 p-2 rounded-xl transition-all block"
                      >
                        <div className="flex justify-between items-center mb-1 text-[8px]">
                          <span className="text-slate-500">{event.time}</span>
                          <span className={`px-1.5 py-0.5 rounded font-bold border ${
                            event.type === 'CRITICAL' ? 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20' :
                            event.type === 'WARNING' ? 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20' :
                            'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/20'
                          }`}>
                            {event.source}
                          </span>
                        </div>
                        <p className="text-slate-300 text-[9px] tracking-tight">{event.message}</p>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Global Command Palette Search */}
      <SearchCommandPalette 
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
      />
    </div>
  );
};

export default DashboardLayout;
