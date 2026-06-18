import React, { useEffect, useState, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavigationSidebar from './NavigationSidebar';
import { Search, Activity, Radio, Cpu, Network, Database, ChevronRight, ChevronLeft, Volume2, ShieldAlert } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { motion, AnimatePresence } from 'framer-motion';

interface StreamEvent {
  id: string;
  time: string;
  type: 'INFO' | 'WARNING' | 'CRITICAL';
  source: string;
  message: string;
}

const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const { systemHealth, fetchSystemHealth } = useAppStore();
  const [showTelemetry, setShowTelemetry] = useState(true);
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

  // Initial stream seed
  useEffect(() => {
    const seedEvents: StreamEvent[] = [
      { id: '1', time: '13:41:02', type: 'CRITICAL', source: 'UPI-MULE', message: 'Risk score 0.98 triggered on merchant-scam-address-24@ybl' },
      { id: '2', time: '13:41:12', type: 'WARNING', source: 'URL-LEXICAL', message: 'Redirect loop detected on suspect-upi-mule-11.com' },
      { id: '3', time: '13:41:35', type: 'INFO', source: 'RAG-RETRIEVE', message: 'Compliance playbook loaded for query: lottery scam' },
      { id: '4', time: '13:41:50', type: 'CRITICAL', source: 'NLP-COERCION', message: 'Urgent reward hook identified in incoming SMS payload' },
      { id: '5', time: '13:42:01', type: 'INFO', source: 'NEO4J-CENTRAL', message: 'PageRank recalculation completed for subnet cluster-C' }
    ];
    setStreamEvents(seedEvents);
  }, []);

  // Event stream simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const types: ('INFO' | 'WARNING' | 'CRITICAL')[] = ['INFO', 'WARNING', 'CRITICAL'];
      const sources = ['UPI-MULE', 'URL-LEXICAL', 'NLP-COERCION', 'NEO4J-CENTRAL', 'RAG-RETRIEVE'];
      const messages = [
        'Node degree centrality exceed threshold on sub-account',
        'Phishing redirect signature detected from new IP subnet',
        'Calibrated risk probability model adjusted (+0.03)',
        'Compliance check complete: HIPAA/PCI data scrub verified',
        'Shapley value attributions calculated for suspect case TXN-72091'
      ];
      
      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomSource = sources[Math.floor(Math.random() * sources.length)];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      
      const newEvent: StreamEvent = {
        id: String(Math.random()),
        time: timeStr,
        type: randomType,
        source: randomSource,
        message: randomMessage
      };

      setStreamEvents(prev => [newEvent, ...prev.slice(0, 7)]);
      
      // Update telemetry numbers
      setTelemetryStats(prev => ({
        scannedCount: prev.scannedCount + 1,
        criticalAlerts: prev.criticalAlerts + (randomType === 'CRITICAL' ? 1 : 0),
        cpuLoad: Math.floor(22 + Math.random() * 15),
        dbLatency: Number((3.5 + Math.random() * 2.5).toFixed(1))
      }));
    }, 4500);

    return () => clearInterval(interval);
  }, []);

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
      <NavigationSidebar />

      {/* Main Area (Top Nav + Workspace Panel) */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Navigation */}
        <header className="h-14 border-b border-[#1E293B] bg-[#0B1220] px-6 flex items-center justify-between z-10">
          <div className="flex items-center space-x-8">
            <h2 className="font-sans font-bold text-xs text-slate-100 uppercase tracking-tight min-w-[140px] text-left">
              {getPageTitle(location.pathname)}
            </h2>
            
            {/* Global Search Bar */}
            <div className="hidden md:flex items-center relative w-72">
              <Search className="absolute left-3 w-3.5 h-3.5 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search cases, indicators, networks... (⌘K)" 
                className="w-full bg-[#050811] border border-[#1E293B] rounded-xl pl-9 pr-8 py-1.5 text-[10px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/30 transition-all font-sans"
              />
              <div className="absolute right-2 px-1.5 py-0.5 rounded bg-[#1E293B] text-[8px] text-slate-500 font-mono select-none">
                ⌘K
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Health Tickers */}
            <div className="hidden sm:flex items-center space-x-3 bg-[#111827] px-3 py-1.5 rounded-xl border border-[#1E293B] font-mono text-[9px] text-slate-400 select-none">
              <span className="text-[8px] uppercase tracking-wider text-slate-500 font-bold mr-1">Nodes:</span>
              <div className="flex items-center space-x-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${systemHealth?.api ? 'bg-[#22C55E]' : 'bg-[#EF4444]'}`} />
                <span className="text-slate-300">API</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${systemHealth?.postgres ? 'bg-[#22C55E]' : 'bg-[#EF4444]'}`} />
                <span className="text-slate-300">SQL</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${systemHealth?.neo4j ? 'bg-[#22C55E]' : 'bg-[#EF4444]'}`} />
                <span className="text-slate-300">NEO4J</span>
              </div>
            </div>

            {/* Toggle Telemetry Stream */}
            <button 
              onClick={() => setShowTelemetry(prev => !prev)}
              className={`p-1.5 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
                showTelemetry 
                  ? 'bg-[#00E5FF]/10 border-[#00E5FF]/30 text-[#00E5FF]' 
                  : 'bg-[#111827] border-[#1E293B] text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle Telemetry Stream"
            >
              <Radio className={`w-4 h-4 ${showTelemetry ? 'animate-pulse' : ''}`} />
            </button>
            
            {/* Operator Profile Card */}
            <div className="flex items-center space-x-2.5 border-l border-[#1E293B] pl-4">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80" 
                  alt="Operator Profile" 
                  className="w-7 h-7 rounded-full object-cover border border-[#00E5FF]/40"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#22C55E] border border-[#050811]" />
              </div>
              <div className="flex flex-col text-left">
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

            {/* Live Event Stream logs */}
            <div className="flex-1 p-4 flex flex-col min-h-0 text-left">
              <span className="text-[8px] font-sans font-bold text-slate-500 uppercase tracking-wide block mb-2">Live Activity Stream</span>
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                <AnimatePresence initial={false}>
                  {streamEvents.map(event => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-[#1E293B]/40 pb-2 text-[9px] font-mono leading-relaxed"
                    >
                      <div className="flex justify-between items-center mb-1 text-[8px]">
                        <span className="text-slate-500">{event.time}</span>
                        <span className={`px-1 rounded font-bold ${
                          event.type === 'CRITICAL' ? 'bg-[#EF4444]/10 text-[#EF4444]' :
                          event.type === 'WARNING' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                          'bg-[#00E5FF]/10 text-[#00E5FF]'
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
    </div>
  );
};

export default DashboardLayout;
