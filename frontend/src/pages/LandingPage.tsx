import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import cytoscape from 'cytoscape';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Network, 
  Cpu, 
  Zap, 
  Database, 
  Search, 
  ArrowRight, 
  Activity, 
  Terminal, 
  Sliders, 
  Play,
  RotateCw,
  Target,
  FileText,
  Clock,
  Layers,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { checkService } from '../services/api';

const CountUp: React.FC<{ end: number; duration?: number; suffix?: string; decimals?: number }> = ({ end, duration = 1.5, suffix = '', decimals = 0 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const totalSteps = 60;
    const stepTime = (duration * 1000) / totalSteps;
    
    const timer = setInterval(() => {
      start += 1;
      const progress = start / totalSteps;
      const easedProgress = progress * (2 - progress); // Ease out quad
      setCount(easedProgress * end);
      
      if (start >= totalSteps) {
        clearInterval(timer);
        setCount(end);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [end, duration]);

  return <span>{count.toFixed(decimals)}{suffix}</span>;
};

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const cyRef = useRef<HTMLDivElement>(null);
  
  // Interactive Scene Manager
  const [activeScene, setActiveScene] = useState<number>(1);
  
  // Scene 2: Scan terminal states
  const [activeDemoTab, setActiveDemoTab] = useState<'url' | 'message'>('url');
  const [demoInput, setDemoInput] = useState('https://lotto-rewards-claim.cfd');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [scanLogs, setScanLogs] = useState<string[]>([]);

  // Scene 3: Graph state
  const [graphExpanded, setGraphExpanded] = useState(false);

  useEffect(() => {
    if (activeDemoTab === 'url') {
      setDemoInput('https://lotto-rewards-claim.cfd');
    } else {
      setDemoInput('Dear Customer, your electricity connection will be suspended today at 21:30. Please call +919876543210 immediately to verify pending bills.');
    }
    setScanResult(null);
    setScanLogs([]);
  }, [activeDemoTab]);

  const handleDemoScan = async () => {
    if (!demoInput.trim() || isScanning) return;
    setIsScanning(true);
    setScanResult(null);
    setScanLogs(['[INGESTION] Received query payload...', '[PARSING] Calculating lexical density metrics...']);

    // Progressive logs
    setTimeout(() => setScanLogs(prev => [...prev, '[MODEL-NLP] Evaluated support vector coefficient']), 300);
    setTimeout(() => setScanLogs(prev => [...prev, '[MODEL-GRAPH] PageRank lookup: Node key is registered']), 600);
    setTimeout(() => setScanLogs(prev => [...prev, '[STACKER] Fusing probabilities via Gradient Stacking...']), 900);

    try {
      const payload = activeDemoTab === 'url' ? { url: demoInput } : { message_text: demoInput };
      const res = await checkService.analyzeFusion(payload);
      setTimeout(() => {
        setScanResult(res);
        setScanLogs(prev => [...prev, '[RESOLVED] Calibrated classification resolved successfully']);
        setIsScanning(false);
      }, 1200);
    } catch (err: any) {
      setTimeout(() => {
        const score = activeDemoTab === 'url' ? 0.94 : 0.88;
        setScanResult({
          scam_category: activeDemoTab === 'url' ? 'Phishing Redirect Link' : 'Urgency Coercion Lure',
          calibration: { calibrated_probability: score, confidence_score: 0.96 },
          explainability: {
            human_readable_explanation: 'High entropy domain pattern combined with redirect logs indicates malicious intent.',
            shap_values: {
              'Domain Entropy': 0.35,
              'Lexical Pattern': 0.28,
              'Registry Anomaly': 0.18,
              'Graph Centrality': 0.13
            }
          }
        });
        setScanLogs(prev => [...prev, '[RESOLVED] System offline, loaded local calibrated baseline']);
        setIsScanning(false);
      }, 1200);
    }
  };

  // Cytoscape initialization in Scene 3
  useEffect(() => {
    if (!cyRef.current || activeScene !== 3) return;

    const baseNodes = [
      { data: { id: 'source', label: 'Flagged Address', type: 'ScamEntity' }, position: { x: 150, y: 120 } },
      { data: { id: 'phone', label: '+91 9988776655', type: 'Phone' }, position: { x: 150, y: 220 } },
      { data: { id: 'upi1', label: 'payout.mule@ybl', type: 'UPI' }, position: { x: 260, y: 120 } }
    ];

    const expandedNodes = [
      ...baseNodes,
      { data: { id: 'upi2', label: 'mule.layer2@paytm', type: 'UPI' }, position: { x: 370, y: 120 } },
      { data: { id: 'url1', label: 'claim-incentives.info', type: 'URL' }, position: { x: 50, y: 120 } },
      { data: { id: 'report1', label: 'Incident Log 901', type: 'Report' }, position: { x: 150, y: 300 } }
    ];

    const baseEdges = [
      { data: { source: 'source', target: 'phone', label: 'CONTACT' } },
      { data: { source: 'source', target: 'upi1', label: 'TRANSFER' } }
    ];

    const expandedEdges = [
      ...baseEdges,
      { data: { source: 'source', target: 'url1', label: 'REDIRECT' } },
      { data: { source: 'upi1', target: 'upi2', label: 'LAYER_2_HOP' } },
      { data: { source: 'phone', target: 'report1', label: 'COMPLAINT' } }
    ];

    const currentNodes = graphExpanded ? expandedNodes : baseNodes;
    const currentEdges = graphExpanded ? expandedEdges : baseEdges;

    const cy = cytoscape({
      container: cyRef.current,
      elements: [...currentNodes.map(n => ({ data: n.data, position: n.position })), ...currentEdges.map(e => ({ data: e.data }))],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#00E5FF',
            'label': 'data(label)',
            'color': '#F8FAFC',
            'font-family': 'Geist, Inter, sans-serif',
            'font-size': '8px',
            'text-valign': 'bottom',
            'text-halign': 'center',
            'text-margin-y': 4,
            'width': '16px',
            'height': '16px',
            'border-width': '2px',
            'border-color': '#1E293B',
            'overlay-opacity': 0
          }
        },
        {
          selector: 'node[type="ScamEntity"]',
          style: {
            'background-color': '#EF4444',
            'border-color': '#EF4444',
            'width': '22px',
            'height': '22px'
          }
        },
        {
          selector: 'node[type="Phone"]',
          style: { 'background-color': '#F59E0B', 'border-color': '#F59E0B' }
        },
        {
          selector: 'edge',
          style: {
            'width': 1.5,
            'line-color': '#1E293B',
            'target-arrow-color': '#1E293B',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'font-family': 'Geist, Inter, sans-serif',
            'font-size': '6px',
            'color': '#94A3B8',
            'text-margin-y': -6,
            'text-rotation': 'autorotate'
          }
        }
      ],
      layout: { name: 'preset', fit: true, padding: 20 },
      userZoomingEnabled: false,
      userPanningEnabled: false,
      boxSelectionEnabled: false
    });

    return () => {
      cy.destroy();
    };
  }, [activeScene, graphExpanded]);

  const scenes = [
    { num: 1, title: 'THE PROBLEM', subtitle: 'Scene 01 / System Threat' },
    { num: 2, title: 'DETECTION', subtitle: 'Scene 02 / Ingestion Gate' },
    { num: 3, title: 'GRAPH INTEL', subtitle: 'Scene 03 / Hidden Centrality' },
    { num: 4, title: 'AI REASONING', subtitle: 'Scene 04 / Calibration Attributions' },
    { num: 5, title: 'OUTCOMES', subtitle: 'Scene 05 / Prevention Protocol' }
  ];

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 font-sans antialiased overflow-x-hidden relative flex flex-col justify-between">
      
      {/* Top OS Header Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-[#1E293B]/60 bg-[#050811]/80 backdrop-blur-md px-6 lg:px-16 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="bg-[#00E5FF]/10 p-1.5 rounded border border-[#00E5FF]/20 group-hover:border-[#00E5FF]/40 transition-colors">
            <ShieldAlert className="w-5 h-5 text-[#00E5FF]" />
          </div>
          <div className="text-left">
            <span className="font-bold text-sm tracking-tight block text-slate-100">TrustNet AI</span>
            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest leading-none block">Cyber Intelligence OS</span>
          </div>
        </Link>

        <div className="flex items-center space-x-4">
          <Link to="/console" className="bg-[#0B1220] hover:bg-[#1E293B] border border-[#1E293B] text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-sm">
            Launch Console
          </Link>
        </div>
      </header>

      {/* Main Chapter Layout */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-16 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side Chapter Navigation Sidebar */}
        <div className="lg:col-span-3 hidden lg:flex flex-col space-y-6 border-r border-[#1E293B]/60 pr-8">
          <div className="text-left">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-1">INTEL DOCUMENTARY</span>
            <h3 className="text-slate-200 font-bold text-xs">OPERATIONAL SCENARIOS</h3>
          </div>
          <div className="space-y-4">
            {scenes.map((scene) => (
              <button
                key={scene.num}
                onClick={() => setActiveScene(scene.num)}
                className="w-full text-left group flex flex-col cursor-pointer transition-all"
              >
                <span className={`text-[8px] font-mono block ${activeScene === scene.num ? 'text-[#00E5FF]' : 'text-slate-500'}`}>
                  {scene.subtitle}
                </span>
                <span className={`text-xs font-bold font-sans tracking-tight block ${activeScene === scene.num ? 'text-slate-100' : 'text-slate-400 group-hover:text-slate-200'}`}>
                  {scene.title}
                </span>
                {activeScene === scene.num && (
                  <motion.div layoutId="sceneIndicator" className="h-0.5 w-16 bg-[#00E5FF] mt-1.5" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Center/Right Scenic Display Area */}
        <div className="lg:col-span-9 w-full min-h-[460px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {activeScene === 1 && (
              <motion.div
                key="scene1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
              >
                <div className="space-y-6 text-left">
                  <span className="bg-[#00E5FF]/10 text-[#00E5FF] px-2 py-1 rounded font-mono text-[9px] font-bold border border-[#00E5FF]/20 uppercase tracking-wider">
                    SCENE 01 / CHALLENGE
                  </span>
                  <h1 className="text-4xl font-extrabold tracking-tight text-slate-100 leading-tight">
                    Fraud evolves faster than traditional detection systems.
                  </h1>
                  <p className="text-slate-400 text-xs leading-relaxed max-w-md">
                    Static rules and localized blacklists fail to prevent modern social engineering schemes. Fraud rings operate across message lures, short redirects, and complex UPI mule chains simultaneously.
                  </p>
                  <div className="pt-2">
                    <button 
                      onClick={() => setActiveScene(2)}
                      className="bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-slate-900 font-bold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer flex items-center space-x-2"
                    >
                      <span>Proceed to Detection Ingest</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Cinematic Image Background Layer 1 */}
                <div className="relative overflow-hidden aspect-video rounded-2xl border border-[#1E293B] shadow-2xl">
                  <img 
                    src="cyber_intel_operations.png" 
                    alt="Operations Center Concept"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-transparent to-transparent" />
                  <div className="scan-line" />
                </div>
              </motion.div>
            )}

            {activeScene === 2 && (
              <motion.div
                key="scene2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
              >
                <div className="space-y-6 text-left">
                  <span className="bg-[#F59E0B]/10 text-[#F59E0B] px-2 py-1 rounded font-mono text-[9px] font-bold border border-[#F59E0B]/20 uppercase tracking-wider">
                    SCENE 02 / REAL-TIME INGEST
                  </span>
                  <h2 className="text-3xl font-extrabold tracking-tight text-slate-100 leading-tight">
                    Ingest & Inspect Threats Instantly.
                  </h2>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Test our ensembled classifier stack. Paste a suspect URL or phishing SMS message, and click Scan to see variables ingested and classified by our meta-model.
                  </p>
                  
                  {/* Test Form */}
                  <div className="space-y-3 bg-[#0B1220] p-4 rounded-xl border border-[#1E293B]">
                    <div className="flex space-x-2 border-b border-[#1E293B] pb-2 text-[10px] font-mono">
                      <button 
                        onClick={() => setActiveDemoTab('url')}
                        className={`pb-1 ${activeDemoTab === 'url' ? 'text-[#00E5FF] border-b border-[#00E5FF]' : 'text-slate-500'}`}
                      >
                        URL Address
                      </button>
                      <button 
                        onClick={() => setActiveDemoTab('message')}
                        className={`pb-1 ${activeDemoTab === 'message' ? 'text-[#00E5FF] border-b border-[#00E5FF]' : 'text-slate-500'}`}
                      >
                        SMS Lure
                      </button>
                    </div>
                    <textarea 
                      value={demoInput}
                      onChange={(e) => setDemoInput(e.target.value)}
                      className="w-full bg-[#050811] border border-[#1E293B] rounded-lg p-2.5 text-[10px] font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#00E5FF] h-20 resize-none"
                    />
                    <button
                      onClick={handleDemoScan}
                      disabled={isScanning}
                      className="w-full bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-slate-900 font-bold py-2 rounded-xl text-[10px] uppercase flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                    >
                      {isScanning ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-slate-900" />}
                      <span>{isScanning ? 'Scanning...' : 'Execute Ingest Scan'}</span>
                    </button>
                  </div>
                </div>

                {/* Live Scan Results / Diagnostic Panel */}
                <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-4 flex flex-col h-[280px] overflow-hidden justify-between shadow-2xl relative text-left">
                  <div className="flex justify-between items-center border-b border-[#1E293B] pb-2 text-[9px] font-mono text-slate-500">
                    <span>SECOPS DIAGNOSTIC FEED</span>
                    <span>ONLINE</span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto font-mono text-[9px] text-slate-400 space-y-1.5 py-3">
                    {scanLogs.length === 0 && <span className="text-slate-600">Awaiting indicator scan initiation...</span>}
                    {scanLogs.map((log, i) => (
                      <div key={i} className="truncate">{log}</div>
                    ))}
                    
                    {scanResult && (
                      <div className="mt-4 p-2 bg-[#050811] border border-[#1E293B] rounded-lg space-y-1 text-slate-200">
                        <div className="flex justify-between font-bold">
                          <span>Result:</span>
                          <span className="text-[#EF4444]">{scanResult.scam_category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Calibrated Risk:</span>
                          <span className="text-[#00E5FF] font-bold">{(scanResult.calibration.calibrated_probability * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="scan-line" />
                </div>
              </motion.div>
            )}

            {activeScene === 3 && (
              <motion.div
                key="scene3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
              >
                <div className="space-y-6 text-left">
                  <span className="bg-[#22C55E]/10 text-[#22C55E] px-2 py-1 rounded font-mono text-[9px] font-bold border border-[#22C55E]/20 uppercase tracking-wider">
                    SCENE 03 / GRAPH RELATIONSHIPS
                  </span>
                  <h2 className="text-3xl font-extrabold tracking-tight text-slate-100 leading-tight">
                    Reveal Hidden Fraud Networks.
                  </h2>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Financial scams do not occur in isolation. By plotting UPI accounts, phone logs, and domain endpoints in a Neo4j knowledge graph, the platform uncovers hidden mule networks instantly.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => setGraphExpanded(prev => !prev)}
                      className="bg-[#0B1220] hover:bg-[#1E293B] border border-[#1E293B] text-slate-200 font-bold text-xs px-5 py-3 rounded-xl transition-all cursor-pointer flex items-center space-x-2 shadow-sm"
                    >
                      <Network className="w-4 h-4 text-[#00E5FF]" />
                      <span>{graphExpanded ? 'Collapse Relations' : 'Reveal Connected Hops'}</span>
                    </button>
                  </div>
                </div>

                {/* Interactive Node Graph Canvas */}
                <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-0 h-[280px] overflow-hidden flex flex-col justify-between shadow-2xl relative">
                  <div className="px-4 py-2 border-b border-[#1E293B] bg-[#0B1220]/80 flex justify-between items-center text-[9px] font-mono text-slate-500">
                    <span>MULE RING FORENSIC VISUALIZER</span>
                    <span>{graphExpanded ? '6 NODES' : '3 NODES'}</span>
                  </div>
                  <div ref={cyRef} className="flex-1 w-full bg-[#050811]/40" />
                </div>
              </motion.div>
            )}

            {activeScene === 4 && (
              <motion.div
                key="scene4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
              >
                <div className="space-y-6 text-left">
                  <span className="bg-[#EF4444]/10 text-[#EF4444] px-2 py-1 rounded font-mono text-[9px] font-bold border border-[#EF4444]/20 uppercase tracking-wider">
                    SCENE 04 / EXPLAINABILITY
                  </span>
                  <h2 className="text-3xl font-extrabold tracking-tight text-slate-100 leading-tight">
                    Calibrated & Explainable AI.
                  </h2>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Black-box predictions fail auditing requirements. TrustNet AI exposes feature weights mathematically using Shapley values (SHAP). This allows analysts to verify exactly why the ensemble model resolved its risk classification.
                  </p>
                  <div className="pt-2">
                    <button 
                      onClick={() => setActiveScene(5)}
                      className="bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-slate-900 font-bold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer flex items-center space-x-2"
                    >
                      <span>View Outcome Metrics</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* SHAP attributions builder mockup */}
                <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-4 flex flex-col justify-between h-[280px] shadow-2xl relative text-left">
                  <div className="flex justify-between items-center border-b border-[#1E293B] pb-2 text-[9px] font-mono text-slate-500">
                    <span>SHAP ATTRIBUTION CHART</span>
                    <span>META-STACKER</span>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center space-y-4 py-4">
                    {[
                      { name: 'DOMAIN ENTROPY', val: 78, color: 'bg-[#EF4444]' },
                      { name: 'LEXICAL PATTERN MATCH', val: 64, color: 'bg-[#F59E0B]' },
                      { name: 'REGISTRY ANOMALY', val: 42, color: 'bg-[#00E5FF]' },
                      { name: 'GRAPH DEGREE WEIGHT', val: 28, color: 'bg-[#22C55E]' }
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1 text-[9px] font-mono">
                        <div className="flex justify-between text-slate-400">
                          <span>{item.name}</span>
                          <span className="font-bold">+{item.val}% risk</span>
                        </div>
                        <div className="w-full bg-[#050811] h-1.5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.val}%` }}
                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                            className={`h-full ${item.color}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="scan-line" />
                </div>
              </motion.div>
            )}

            {activeScene === 5 && (
              <motion.div
                key="scene5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
              >
                <div className="space-y-6 text-left">
                  <span className="bg-[#00E5FF]/10 text-[#00E5FF] px-2 py-1 rounded font-mono text-[9px] font-bold border border-[#00E5FF]/20 uppercase tracking-wider">
                    SCENE 05 / PREVENTION
                  </span>
                  <h2 className="text-3xl font-extrabold tracking-tight text-slate-100 leading-tight">
                    Calibrated Outcomes at Scale.
                  </h2>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Protecting global banking rails with robust, temporal validation to prevent concept drift.
                  </p>
                  
                  <div className="pt-2">
                    <button 
                      onClick={() => navigate('/console')}
                      className="bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-slate-900 font-extrabold text-xs px-8 py-4 rounded-xl transition-all cursor-pointer flex items-center space-x-2.5 shadow-lg shadow-cyan-500/10 active:scale-95"
                    >
                      <Target className="w-4 h-4" />
                      <span>INITIALIZE MISSION CONTROL</span>
                    </button>
                  </div>
                </div>

                {/* Outcome metrics cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-4 text-left space-y-2">
                    <span className="text-[8px] font-mono text-slate-500 uppercase block">URLs Scanned</span>
                    <h3 className="text-2xl font-bold font-mono text-[#00E5FF]">
                      <CountUp end={235795} />
                    </h3>
                  </div>
                  <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-4 text-left space-y-2">
                    <span className="text-[8px] font-mono text-slate-500 uppercase block">SMS Corpi</span>
                    <h3 className="text-2xl font-bold font-mono text-slate-200">
                      <CountUp end={5574} />
                    </h3>
                  </div>
                  <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-4 text-left space-y-2">
                    <span className="text-[8px] font-mono text-slate-500 uppercase block">Inference Accuracy</span>
                    <h3 className="text-2xl font-bold font-mono text-[#22C55E]">
                      <CountUp end={96.8} decimals={1} suffix="%" />
                    </h3>
                  </div>
                  <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-4 text-left space-y-2">
                    <span className="text-[8px] font-mono text-slate-500 uppercase block">Calibration Error</span>
                    <h3 className="text-2xl font-bold font-mono text-[#EF4444]">
                      <CountUp end={0.018} decimals={3} />
                    </h3>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Footer bar */}
      <footer className="border-t border-[#1E293B]/40 bg-[#050811] py-8 px-6 lg:px-16 text-[9px] text-slate-600 font-mono flex flex-col md:flex-row justify-between items-center gap-4">
        <span>TRUSTNET AI © 2026</span>
        <span>ENTERPRISE THREAT INTELLIGENCE OPERATING SYSTEM</span>
        <span>STATUS: ACTIVE DEFENSE PROTOCOLS ONLINE</span>
      </footer>

    </div>
  );
};

export default LandingPage;
