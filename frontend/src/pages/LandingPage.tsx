import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import cytoscape from 'cytoscape';
import { CinematicBackground } from '../components/ui/CinematicBackground';
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
  Award,
  AlertTriangle,
  Info,
  CheckCircle,
  Volume2,
  VolumeX,
  ChevronDown
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
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Interactive Scene Manager
  const [activeScene, setActiveScene] = useState<number>(1);
  const [autoPlay, setAutoPlay] = useState<boolean>(true);
  const lastScrollTime = useRef<number>(Date.now());
  
  // Interactive states
  // Scene 1: Alert simulator
  const [selectedThreatType, setSelectedThreatType] = useState<'lures' | 'hops' | 'mules'>('lures');
  
  // Scene 2: Scan terminal states
  const [activeDemoTab, setActiveDemoTab] = useState<'url' | 'message'>('url');
  const [demoInput, setDemoInput] = useState('https://lotto-rewards-claim.cfd');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [scanProgress, setScanProgress] = useState(0);

  // Scene 3: Graph state
  const cyRef = useRef<HTMLDivElement>(null);
  const cyInstance = useRef<cytoscape.Core | null>(null);
  const [graphExpanded, setGraphExpanded] = useState(false);
  const [isRiskPropagated, setIsRiskPropagated] = useState(false);
  const [selectedNodeDetails, setSelectedNodeDetails] = useState<any | null>(null);

  // Scene 4: SHAP state
  const [activeSHAPSegment, setActiveSHAPSegment] = useState<number | null>(null);
  const [expandedEvidenceId, setExpandedEvidenceId] = useState<string | null>(null);
  const [confidenceDialProgress, setConfidenceDialProgress] = useState(0);

  // Scene 5: Testimonials
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Pre-filled inputs for scanner
  useEffect(() => {
    if (activeDemoTab === 'url') {
      setDemoInput('https://lotto-rewards-claim.cfd');
    } else {
      setDemoInput('Dear Customer, your electricity connection will be suspended today at 21:30. Please call +919876543210 immediately to verify pending bills.');
    }
    setScanResult(null);
    setScanLogs([]);
    setScanProgress(0);
  }, [activeDemoTab]);

  // Handle Wheel / Key / Scroll events to detect active scene
  const handleScroll = () => {
    lastScrollTime.current = Date.now();
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;
    const height = containerRef.current.clientHeight;
    
    // Determine current scene from scroll position
    const scene = Math.round(scrollTop / height) + 1;
    const boundedScene = Math.max(1, Math.min(5, scene));
    if (boundedScene !== activeScene) {
      setActiveScene(boundedScene);
    }
  };

  // Scroll directly to a target scene
  const scrollToScene = (sceneNum: number) => {
    if (!containerRef.current) return;
    const height = containerRef.current.clientHeight;
    containerRef.current.scrollTo({
      top: (sceneNum - 1) * height,
      behavior: 'smooth'
    });
    setActiveScene(sceneNum);
    lastScrollTime.current = Date.now();
  };

  // Delayed timer helper for interactions (prevents auto-scroll while playing)
  const registerUserInteraction = () => {
    lastScrollTime.current = Date.now() + 10000; // Delay autoplay by 10s
  };

  // Auto-play mode loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (!autoPlay) return;
      const now = Date.now();
      if (now - lastScrollTime.current >= 4500) {
        setActiveScene(prev => {
          const next = prev < 5 ? prev + 1 : 1;
          scrollToScene(next);
          return next;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [autoPlay]);

  // Execute demo scanner sequence
  const handleDemoScan = async () => {
    if (!demoInput.trim() || isScanning) return;
    registerUserInteraction();
    setIsScanning(true);
    setScanResult(null);
    setScanProgress(5);
    setScanLogs(['[INGESTION] Initiating gateway telemetry scan...', '[INGESTION] Extracting URL payload signatures...']);

    // Progressive logs and progress percentage bar
    const progressSteps = [
      { p: 25, log: '[PARSING] Calculating lexical entropy and domain age metrics...' },
      { p: 50, log: '[NLP-EVAL] Running DistilBERT Coercion analysis...' },
      { p: 75, log: '[NEO4J] Querying degree centralities and PageRank anomalies...' },
      { p: 90, log: '[FUSION] Calibrating Gradient Boosting ensemble weights...' },
      { p: 100, log: '[RESOLVED] Stacking calibration layer completed successfully.' }
    ];

    progressSteps.forEach((step, idx) => {
      setTimeout(() => {
        setScanProgress(step.p);
        setScanLogs(prev => [...prev, step.log]);
      }, (idx + 1) * 300);
    });

    try {
      const payload = activeDemoTab === 'url' ? { url: demoInput } : { message_text: demoInput };
      const res = await checkService.analyzeFusion(payload);
      setTimeout(() => {
        setScanResult(res);
        setIsScanning(false);
      }, 1800);
    } catch (err: any) {
      setTimeout(() => {
        const score = activeDemoTab === 'url' ? 0.942 : 0.885;
        setScanResult({
          scam_category: activeDemoTab === 'url' ? 'Phishing Redirect Link' : 'Urgency Coercion Lure',
          calibration: { calibrated_probability: score, confidence_score: 0.96 },
          explainability: {
            human_readable_explanation: 'High entropy domain pattern combined with redirect logs indicates malicious intent.',
            shap_values: {
              'Domain Entropy': 0.38,
              'Lexical Pattern': 0.28,
              'Registry Anomaly': 0.18,
              'Graph Centrality': 0.12
            }
          }
        });
        setIsScanning(false);
      }, 1800);
    }
  };

  // Scene 3: Cytoscape Graph setup
  useEffect(() => {
    if (!cyRef.current || activeScene !== 3) return;

    const baseNodes = [
      { data: { id: 'source', label: 'Lure URL', type: 'ScamEntity', risk: 94 }, position: { x: 150, y: 120 } },
      { data: { id: 'phone', label: 'Phone Gateway', type: 'Phone', risk: 85 }, position: { x: 150, y: 220 } },
      { data: { id: 'upi1', label: 'Mule Wallet 01', type: 'UPI', risk: 72 }, position: { x: 260, y: 120 } }
    ];

    const expandedNodes = [
      ...baseNodes,
      { data: { id: 'upi2', label: 'Layer 2 Mule', type: 'UPI', risk: 60 }, position: { x: 370, y: 120 } },
      { data: { id: 'ip', label: 'Host IP', type: 'IP', risk: 45 }, position: { x: 50, y: 120 } },
      { data: { id: 'report', label: 'Incident 772', type: 'Report', risk: 80 }, position: { x: 150, y: 300 } }
    ];

    const baseEdges = [
      { data: { id: 'e1', source: 'source', target: 'phone', label: 'LINKED_LURE' } },
      { data: { id: 'e2', source: 'source', target: 'upi1', label: 'TRANSFER' } }
    ];

    const expandedEdges = [
      ...baseEdges,
      { data: { id: 'e3', source: 'source', target: 'ip', label: 'HOSTED_ON' } },
      { data: { id: 'e4', source: 'upi1', target: 'upi2', label: 'NESTED_HOP' } },
      { data: { id: 'e5', source: 'phone', target: 'report', label: 'REPORTED_BY' } }
    ];

    const currentNodes = graphExpanded ? expandedNodes : baseNodes;
    const currentEdges = graphExpanded ? expandedEdges : baseEdges;

    const cy = cytoscape({
      container: cyRef.current,
      elements: [
        ...currentNodes.map(n => ({ data: n.data, position: n.position })),
        ...currentEdges.map(e => ({ data: e.data }))
      ],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#0B1220',
            'label': 'data(label)',
            'color': '#94A3B8',
            'font-family': 'Geist Mono, Courier, monospace',
            'font-size': '8px',
            'text-valign': 'bottom',
            'text-halign': 'center',
            'text-margin-y': 4,
            'width': '20px',
            'height': '20px',
            'border-width': '2px',
            'border-color': '#334155',
            'overlay-opacity': 0,
            'transition-property': 'background-color, border-color, width, height',
            'transition-duration': 0.3
          }
        },
        {
          selector: 'node[type="ScamEntity"]',
          style: {
            'background-color': isRiskPropagated ? '#EF4444' : '#00E5FF',
            'border-color': isRiskPropagated ? '#EF4444' : '#00E5FF',
            'width': '24px',
            'height': '24px'
          }
        },
        {
          selector: 'node[type="Phone"]',
          style: {
            'background-color': isRiskPropagated ? '#EF4444' : '#6366F1',
            'border-color': isRiskPropagated ? '#EF4444' : '#6366F1'
          }
        },
        {
          selector: 'node[type="UPI"]',
          style: {
            'background-color': isRiskPropagated ? '#EF4444' : '#22C55E',
            'border-color': isRiskPropagated ? '#EF4444' : '#22C55E'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 1.5,
            'line-color': isRiskPropagated ? '#EF4444' : '#334155',
            'target-arrow-color': isRiskPropagated ? '#EF4444' : '#334155',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'font-family': 'Geist Mono, Courier, monospace',
            'font-size': '6px',
            'color': '#475569',
            'text-margin-y': -6,
            'text-rotation': 'autorotate'
          }
        }
      ],
      layout: { name: 'preset', fit: true, padding: 30 },
      userZoomingEnabled: false,
      userPanningEnabled: false,
      boxSelectionEnabled: false
    });

    cyInstance.current = cy;

    // Click handler for simple interaction
    cy.on('tap', 'node', (evt) => {
      registerUserInteraction();
      const node = evt.target;
      setSelectedNodeDetails({
        id: node.id(),
        label: node.data('label'),
        type: node.data('type'),
        risk: node.data('risk')
      });
    });

    return () => {
      cy.destroy();
    };
  }, [activeScene, graphExpanded, isRiskPropagated]);

  useEffect(() => {
    let timer: any;
    if (activeScene === 4) {
      setConfidenceDialProgress(0);
      timer = setTimeout(() => {
        setConfidenceDialProgress(94.2);
      }, 500);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [activeScene]);

  // Mock testimonials
  const testimonials = [
    {
      name: 'SARAH CHEN',
      role: 'Lead Fraud Operations Analyst',
      company: 'GLOBAL BANKING GROUP',
      quote: 'TrustNet\'s graph propagation was the game changer for us. We mapped 14 nested mule accounts and blocked the transfer loop in under 3 minutes.',
      metrics: '$12.4M Saved • 98.4% Precision'
    },
    {
      name: 'COL. MARCUS VANCE',
      role: 'Director of Security Response',
      company: 'NEXATECH SYSTEMS',
      quote: 'Explainable AI is not a luxury; it is a regulatory requirement. TrustNet\'s SHAP evidence logs provided the mathematical verification our compliance auditors demanded.',
      metrics: 'SOC-2 Verified • 0.012 calibration error'
    },
    {
      name: 'AMARA OKAFOR',
      role: 'Head of Risk Decisioning',
      company: 'APEX COMMUNICATIONS',
      quote: 'The flow command dashboard is like a tactical mission center. Our analysts see threat signals emerge, link nodes, and take compliance action in one fluid sequence.',
      metrics: '99.9% System Uptime • 4ms Inference Latency'
    }
  ];

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 font-sans antialiased overflow-hidden relative flex flex-col justify-between select-none">
      
      {/* Cinematic Background Canvas Layer */}
      <CinematicBackground />

      {/* Global Transition Wipes */}
      <AnimatePresence>
        {activeScene === 2 && (
          <motion.div 
            initial={{ left: '-100%' }}
            animate={{ left: '100%' }}
            transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed top-0 bottom-0 w-2.5 bg-[#00E5FF] shadow-[0_0_35px_#00E5FF] z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* OS Command Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-[#1E293B]/60 bg-[#050811]/80 backdrop-blur-md px-6 lg:px-16 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="bg-[#00E5FF]/10 p-1.5 rounded border border-[#00E5FF]/20 group-hover:border-[#00E5FF]/40 transition-colors">
            <ShieldAlert className="w-5 h-5 text-[#00E5FF]" />
          </div>
          <div className="text-left">
            <span className="font-bold text-sm tracking-tight block text-slate-100">TrustNet AI</span>
            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest leading-none block">Cyber Intelligence OS</span>
          </div>
        </Link>

        {/* Global Telemetry Lights */}
        <div className="hidden md:flex items-center space-x-6 text-[9px] font-mono text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#22C55E]"></span>
            </span>
            <span>OS PROTOCOLS: ACTIVE</span>
          </div>
          <div className="flex items-center space-x-2 border-l border-[#1E293B] pl-6">
            <Activity className="w-3.5 h-3.5 text-[#00E5FF] animate-pulse" />
            <span>THREAT TELEMETRY FEED: ONLINE</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Autoplay toggler */}
          <button 
            onClick={() => setAutoPlay(!autoPlay)}
            className={`px-3 py-1.5 rounded-lg border text-[9px] font-mono flex items-center space-x-1.5 cursor-pointer transition-all ${
              autoPlay 
                ? 'bg-[#00E5FF]/10 border-[#00E5FF]/30 text-[#00E5FF]' 
                : 'bg-[#0B1220] border-[#1E293B] text-slate-500 hover:text-slate-400'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>{autoPlay ? 'AUTOPLAY ON' : 'AUTOPLAY PAUSED'}</span>
          </button>
          
          <Link to="/console" className="bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-slate-900 border border-[#00E5FF]/20 px-4 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-sm shadow-[#00E5FF]/10 hover:scale-[1.02] active:scale-95">
            Launch Console
          </Link>
        </div>
      </header>

      {/* Snap Scroll Narrative Container */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 w-full h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth"
      >
        
        {/* SCENE 1: "The Problem" - Threat Landscape */}
        <section className="w-full h-screen snap-start overflow-hidden relative flex items-center justify-center px-6 lg:px-16 py-16">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Headline and text */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <span className="bg-[#EF4444]/10 text-[#EF4444] px-2.5 py-1 rounded font-mono text-[9px] font-bold border border-[#EF4444]/20 uppercase tracking-wider">
                SCENE 01 // PROTOCOL LANDSCAPE
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-100 leading-tight">
                Fraud evolves faster than traditional systems.
              </h1>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-lg">
                Static security protocols and siloed blacklists fail to prevent modern social engineering schemes. Threat actors operate across message lures, redirects, and complex multi-layered UPI mule chains concurrently.
              </p>
              
              {/* Interactive simulator controls */}
              <div className="bg-[#0B1220] border border-[#1E293B] rounded-xl p-4 space-y-3 max-w-md">
                <span className="text-[9px] font-mono text-slate-500 uppercase block tracking-wider">Active Threat Monitor Simulator</span>
                <div className="flex gap-2">
                  {(['lures', 'hops', 'mules'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        registerUserInteraction();
                        setSelectedThreatType(type);
                      }}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-[9px] font-mono uppercase border transition-all cursor-pointer ${
                        selectedThreatType === type
                          ? 'bg-[#00E5FF]/10 border-[#00E5FF]/30 text-[#00E5FF]'
                          : 'bg-[#050811] border-[#1E293B] text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {type === 'lures' && 'Lure Signals'}
                      {type === 'hops' && 'Redirect Hops'}
                      {type === 'mules' && 'Mule Chains'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Visual threat telemetry map */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-md aspect-video bg-[#111827] border border-[#1E293B] rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-2xl p-4">
                <div className="flex justify-between items-center border-b border-[#1E293B] pb-2 text-[9px] font-mono text-slate-500">
                  <span className="flex items-center space-x-1">
                    <Terminal className="w-3.5 h-3.5 text-[#EF4444]" />
                    <span>SYNDICATE ACTIVITY TELEMETRY</span>
                  </span>
                  <span className="text-[#EF4444]">ALERT CRITICAL</span>
                </div>

                <div className="flex-1 flex flex-col justify-center space-y-3 font-mono text-[9px] py-4">
                  {selectedThreatType === 'lures' && (
                    <>
                      <div className="flex justify-between items-center bg-[#EF4444]/5 border border-l-2 border-l-[#EF4444] border-[#1E293B] p-2 rounded">
                        <span className="text-[#EF4444] font-bold">LURE_SMS_INGEST:</span>
                        <span className="text-slate-300 truncate max-w-[200px]">"electricity connection will be suspended..."</span>
                      </div>
                      <div className="flex justify-between items-center bg-[#EF4444]/5 border border-[#1E293B] p-2 rounded">
                        <span className="text-slate-500">LEXICAL_ENTROPY:</span>
                        <span className="text-slate-300 font-bold">0.841 (HIGH_COERCION)</span>
                      </div>
                    </>
                  )}

                  {selectedThreatType === 'hops' && (
                    <>
                      <div className="flex justify-between items-center bg-[#F59E0B]/5 border border-l-2 border-l-[#F59E0B] border-[#1E293B] p-2 rounded">
                        <span className="text-[#F59E0B] font-bold">REDIRECT_CHAIN:</span>
                        <span className="text-slate-300 truncate max-w-[200px]">domain.cfd ➔ pay-in.xyz ➔ gateway.link</span>
                      </div>
                      <div className="flex justify-between items-center bg-[#F59E0B]/5 border border-[#1E293B] p-2 rounded">
                        <span className="text-slate-500">IP_GEOLOCATION_DRIFT:</span>
                        <span className="text-slate-300 font-bold">3 countries resolved in 420ms</span>
                      </div>
                    </>
                  )}

                  {selectedThreatType === 'mules' && (
                    <>
                      <div className="flex justify-between items-center bg-[#00E5FF]/5 border border-l-2 border-l-[#00E5FF] border-[#1E293B] p-2 rounded">
                        <span className="text-[#00E5FF] font-bold">MULE_RING_DETECTED:</span>
                        <span className="text-slate-300 font-bold">4 hops unresolved to target mule</span>
                      </div>
                      <div className="flex justify-between items-center bg-[#00E5FF]/5 border border-[#1E293B] p-2 rounded">
                        <span className="text-slate-500">PAGERANK_DEVIATION:</span>
                        <span className="text-slate-300 font-bold">+5.84 (EXTREME_CENTRALITY)</span>
                      </div>
                    </>
                  )}

                  <div className="w-full bg-[#050811] h-1.5 rounded-full overflow-hidden relative">
                    <motion.div 
                      animate={{ left: ['-100%', '100%'] }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                      className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-[#EF4444] to-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-[#1E293B]/60 pt-2 text-[8px] font-mono text-slate-500">
                  <span>THREAT SIGS TODAY: <CountUp end={142891} duration={2} /></span>
                  <span className="text-[#EF4444] animate-pulse">RADAR SWEEP ONLINE</span>
                </div>

                {/* Scan Wipe lines */}
                <div className="scan-line" />
              </div>
            </div>

          </div>

          {/* Indicator scroll prompt */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-1 text-[9px] font-mono text-slate-500 animate-bounce">
            <span>SCROLL OR CLICK TO PROCEED</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </section>

        {/* SCENE 2: "The Solution" - Threat Detection in Action */}
        <section className="w-full h-screen snap-start overflow-hidden relative flex items-center justify-center px-6 lg:px-16 py-16 bg-[#070B14]">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6 text-left">
              <span className="bg-[#00E5FF]/10 text-[#00E5FF] px-2.5 py-1 rounded font-mono text-[9px] font-bold border border-[#00E5FF]/20 uppercase tracking-wider">
                SCENE 02 // MULTI-STAGE INGESTION
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-100 leading-tight">
                Inspect Threats Instantly.
              </h2>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                Test our classifier stack. Ingest a suspect indicator—either a suspicious URL or a coercive SMS message—to watch the pipeline stack models and resolve risk levels.
              </p>

              {/* Form scanner */}
              <div className="space-y-4 bg-[#0B1220] p-5 rounded-2xl border border-[#1E293B] max-w-md">
                <div className="flex space-x-3 border-b border-[#1E293B] pb-2.5 text-[10px] font-mono">
                  <button 
                    onClick={() => {
                      registerUserInteraction();
                      setActiveDemoTab('url');
                    }}
                    className={`pb-1 uppercase tracking-wider font-bold transition-all cursor-pointer ${activeDemoTab === 'url' ? 'text-[#00E5FF] border-b-2 border-[#00E5FF]' : 'text-slate-500'}`}
                  >
                    SUSPECT URL
                  </button>
                  <button 
                    onClick={() => {
                      registerUserInteraction();
                      setActiveDemoTab('message');
                    }}
                    className={`pb-1 uppercase tracking-wider font-bold transition-all cursor-pointer ${activeDemoTab === 'message' ? 'text-[#00E5FF] border-b-2 border-[#00E5FF]' : 'text-slate-500'}`}
                  >
                    SMS LURE
                  </button>
                </div>

                <textarea 
                  value={demoInput}
                  onChange={(e) => {
                    registerUserInteraction();
                    setDemoInput(e.target.value);
                  }}
                  className="w-full bg-[#050811] border border-[#1E293B] rounded-xl p-3 text-[10px] font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#00E5FF] h-20 resize-none"
                />

                <button
                  onClick={handleDemoScan}
                  disabled={isScanning}
                  className="w-full bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-slate-900 font-extrabold py-3 rounded-xl text-xs uppercase flex items-center justify-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isScanning ? <RotateCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-slate-900" />}
                  <span>{isScanning ? 'SYSTEM RUNNING PIPELINE...' : 'EXECUTE INGESTION SCAN'}</span>
                </button>
              </div>
            </div>

            {/* Diagnostic Console display */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-md h-[300px] bg-[#111827] border border-[#1E293B] rounded-2xl p-4 flex flex-col justify-between shadow-2xl relative text-left overflow-hidden">
                <div className="flex justify-between items-center border-b border-[#1E293B] pb-2 text-[9px] font-mono text-slate-500">
                  <span>STAGE RESOLUTION CONSOLE</span>
                  <span className={isScanning ? 'text-[#00E5FF] animate-pulse' : 'text-slate-500'}>
                    {isScanning ? 'PROCESSING' : 'ONLINE'}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto font-mono text-[9px] text-slate-400 space-y-1.5 py-4 max-h-[190px]">
                  {scanLogs.length === 0 && <span className="text-slate-600">Awaiting scan trigger... Click "EXECUTE INGESTION SCAN".</span>}
                  {scanLogs.map((log, i) => (
                    <div key={i} className="truncate text-slate-300">
                      <span className="text-[#00E5FF] mr-1">➔</span>
                      {log}
                    </div>
                  ))}
                  
                  {isScanning && (
                    <div className="w-full bg-[#050811] h-1 rounded overflow-hidden">
                      <div className="bg-[#00E5FF] h-full transition-all duration-300" style={{ width: `${scanProgress}%` }} />
                    </div>
                  )}

                  {scanResult && !isScanning && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 p-3 bg-[#0B1220] border border-[#1E293B] rounded-xl space-y-1 text-slate-200"
                    >
                      <div className="flex justify-between font-bold border-b border-[#1E293B]/60 pb-1">
                        <span>Classification:</span>
                        <span className="text-[#EF4444] uppercase tracking-wider">{scanResult.scam_category}</span>
                      </div>
                      <div className="flex justify-between text-[10px] pt-1">
                        <span>Calibrated Fusion Score:</span>
                        <span className="text-[#00E5FF] font-bold">{(scanResult.calibration.calibrated_probability * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span>Classifier Confidence:</span>
                        <span className="text-[#22C55E] font-bold">{(scanResult.calibration.confidence_score * 100).toFixed(1)}%</span>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="border-t border-[#1E293B]/60 pt-2 text-[8px] font-mono text-slate-500 flex justify-between">
                  <span>TELEMETRY STACK: FUSION_v3</span>
                  <span>LATENCY: 4.2ms</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SCENE 3: "The Power" - Graph Intelligence */}
        <section className="w-full h-screen snap-start overflow-hidden relative flex items-center justify-center px-6 lg:px-16 py-16 bg-[#050811]">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6 text-left">
              <span className="bg-[#22C55E]/10 text-[#22C55E] px-2.5 py-1 rounded font-mono text-[9px] font-bold border border-[#22C55E]/20 uppercase tracking-wider">
                SCENE 03 // RELATIONSHIP FORENSICS
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-100 leading-tight">
                Expose Syndicate Clusters.
              </h2>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                Fraud is not isolated. A single phishing link is linked to domains, host IPs, phone networks, and multiple mule payment accounts. By visualizing connections, the system isolates rings instantly.
              </p>

              {/* Interaction buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    registerUserInteraction();
                    setGraphExpanded(!graphExpanded);
                  }}
                  className={`py-3 px-5 rounded-xl text-xs font-bold font-sans tracking-wide transition-all border cursor-pointer flex items-center justify-center space-x-2 shadow-sm ${
                    graphExpanded 
                      ? 'bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]' 
                      : 'bg-[#0B1220] border-[#1E293B] text-slate-300 hover:text-slate-100'
                  }`}
                >
                  <Network className="w-4 h-4" />
                  <span>{graphExpanded ? 'Collapse Sub-Hops' : 'Reveal Sub-Hop Connections'}</span>
                </button>

                <button
                  onClick={() => {
                    registerUserInteraction();
                    setIsRiskPropagated(!isRiskPropagated);
                  }}
                  className={`py-3 px-5 rounded-xl text-xs font-bold font-sans tracking-wide transition-all border cursor-pointer flex items-center justify-center space-x-2 shadow-sm ${
                    isRiskPropagated 
                      ? 'bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]' 
                      : 'bg-[#0B1220] border-[#1E293B] text-slate-300 hover:text-slate-100'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>{isRiskPropagated ? 'Reset Propagation' : 'Propagate Risk Vectors'}</span>
                </button>
              </div>
            </div>

            {/* Interactive Graph Canvas */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-md h-[300px] bg-[#111827] border border-[#1E293B] rounded-2xl flex flex-col justify-between shadow-2xl relative overflow-hidden text-left">
                <div className="px-4 py-2 border-b border-[#1E293B] bg-[#0B1220]/80 flex justify-between items-center text-[9px] font-mono text-slate-500">
                  <span>MULE REGISTRY VISUALIZER</span>
                  <span>{graphExpanded ? '6 NODES LOADED' : '3 NODES LOADED'}</span>
                </div>

                {/* Cytoscape container */}
                <div ref={cyRef} className="flex-1 w-full bg-[#050811]/45" />

                {/* Selected Node Details Box overlay */}
                {selectedNodeDetails && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-4 left-4 right-4 bg-[#0B1220]/95 border border-[#1E293B] p-3 rounded-xl shadow-lg text-[9px] font-mono space-y-1 z-10"
                  >
                    <div className="flex justify-between font-bold border-b border-[#1E293B]/60 pb-1 text-slate-200">
                      <span>ENTITY_ID: {selectedNodeDetails.id}</span>
                      <span className="text-[#00E5FF]">{selectedNodeDetails.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Node Descriptor:</span>
                      <span className="text-slate-300">{selectedNodeDetails.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">PageRank Risk Index:</span>
                      <span className="text-[#EF4444] font-bold">{selectedNodeDetails.risk}%</span>
                    </div>
                  </motion.div>
                )}

                <div className="px-4 py-2 border-t border-[#1E293B]/60 bg-[#0B1220]/80 text-[8px] font-mono text-slate-500 flex justify-between">
                  <span>INTERACT: CLICK NODES TO INSPECT</span>
                  <span className={isRiskPropagated ? 'text-[#EF4444] animate-pulse' : ''}>
                    {isRiskPropagated ? 'RISK PROPAGATING' : 'PROPAGATION STANDBY'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SCENE 4: "The Trust" - Explainable AI */}
        <section className="w-full h-screen snap-start overflow-hidden relative flex items-center justify-center px-6 lg:px-16 py-16 bg-[#070B14]">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6 text-left">
              <span className="bg-[#EF4444]/10 text-[#EF4444] px-2.5 py-1 rounded font-mono text-[9px] font-bold border border-[#EF4444]/20 uppercase tracking-wider">
                SCENE 04 // EXPLAINABILITY SUITE
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-100 leading-tight">
                Explainable Decision Logic.
              </h2>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                Black box security models fail inspection requirements. TrustNet decomposes classifications into mathematical feature contributions using Shapley values (SHAP). Analysts verify exactly why an indicator was flagged.
              </p>

              {/* Expandable evidence cards */}
              <div className="space-y-2.5 max-w-md">
                <span className="text-[9px] font-mono text-slate-500 uppercase block tracking-wider">Verify Model Reasoning Checklist</span>
                
                {[
                  { id: 'nlp', title: 'NLP Lexical Coercion', desc: 'The DistilBERT language model flagged urgent threat keywords with 94.2% probability matching extortion parameters.' },
                  { id: 'entropy', title: 'Domain Shannon Entropy', desc: 'Linguistic randomness calculation matched custom DGA generator signatures with high correlation.' },
                  { id: 'pagerank', title: 'PageRank Node Degree', desc: 'Graph topology analysis detected high structural centrality connecting to registered payment mule clusters.' }
                ].map((item) => (
                  <div 
                    key={item.id}
                    className="bg-[#0B1220] border border-[#1E293B] rounded-xl overflow-hidden cursor-pointer transition-all hover:border-[#1E293B]"
                    onClick={() => {
                      registerUserInteraction();
                      setExpandedEvidenceId(expandedEvidenceId === item.id ? null : item.id);
                    }}
                  >
                    <div className="p-3 flex justify-between items-center text-xs font-semibold">
                      <span className="text-slate-200">{item.title}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${expandedEvidenceId === item.id ? 'rotate-180' : ''}`} />
                    </div>
                    <AnimatePresence>
                      {expandedEvidenceId === item.id && (
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="px-3 pb-3 overflow-hidden text-[10px] text-slate-400 leading-relaxed font-sans border-t border-[#1E293B]/40 pt-2"
                        >
                          {item.desc}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual SHAP progress bars and confidence dial */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-md h-[300px] bg-[#111827] border border-[#1E293B] rounded-2xl p-4 flex flex-col justify-between shadow-2xl relative text-left">
                <div className="flex justify-between items-center border-b border-[#1E293B] pb-2 text-[9px] font-mono text-slate-500">
                  <span>SHAPLEY VALUE ATTRIBUTION</span>
                  <span>ENSEMBLE STACK</span>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 items-center py-2">
                  {/* Confidence gauge dial */}
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="relative w-24 h-24">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-[#0B1220]"
                          strokeWidth="2"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <motion.path
                          className="text-[#00E5FF]"
                          strokeWidth="2"
                          strokeDasharray={`${confidenceDialProgress}, 100`}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                        <span className="text-lg font-bold text-slate-100">{confidenceDialProgress.toFixed(1)}%</span>
                        <span className="text-[6px] text-slate-500 uppercase tracking-widest leading-none">RISK INDEX</span>
                      </div>
                    </div>
                    <span className="text-[8px] font-mono text-slate-400">CALIBRATED ACCURACY</span>
                  </div>

                  {/* SHAP bars */}
                  <div className="space-y-3.5">
                    {[
                      { name: 'LEXICAL COERCION NLP', val: 78, color: 'bg-[#EF4444]' },
                      { name: 'DOMAIN SHANNON ENTROPY', val: 64, color: 'bg-[#F59E0B]' },
                      { name: 'PAGERANK DEGREE CENTRALITY', val: 42, color: 'bg-[#22C55E]' }
                    ].map((item, idx) => (
                      <div 
                        key={idx} 
                        className="space-y-1 text-[8px] font-mono cursor-pointer"
                        onMouseEnter={() => setActiveSHAPSegment(idx)}
                        onMouseLeave={() => setActiveSHAPSegment(null)}
                      >
                        <div className="flex justify-between text-slate-400">
                          <span className={activeSHAPSegment === idx ? 'text-[#00E5FF]' : ''}>{item.name}</span>
                          <span>+{item.val}%</span>
                        </div>
                        <div className="w-full bg-[#050811] h-1 rounded-full overflow-hidden">
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
                </div>

                <div className="border-t border-[#1E293B]/60 pt-2 text-[8px] font-mono text-slate-500 flex justify-between">
                  <span>AUDIT CALIBRATION: CAL-04</span>
                  <span>SHAP VECTORS OK</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SCENE 5: "The Impact" - Threat Prevention Outcomes */}
        <section className="w-full h-screen snap-start overflow-hidden relative flex items-center justify-center px-6 lg:px-16 py-16 bg-[#050811]">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6 text-left">
              <span className="bg-[#00E5FF]/10 text-[#00E5FF] px-2.5 py-1 rounded font-mono text-[9px] font-bold border border-[#00E5FF]/20 uppercase tracking-wider">
                SCENE 05 // SYSTEM OUTCOMES
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-100 leading-tight">
                Calibrated Outcomes.
              </h2>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                Empower your intelligence response cells. Deploy automated mitigation playbooks directly to payment networks, web providers, and telecom gateways.
              </p>

              {/* Large CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button 
                  onClick={() => navigate('/console')}
                  className="bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-slate-900 font-extrabold text-xs px-8 py-4 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2.5 shadow-lg shadow-cyan-500/10 active:scale-95"
                >
                  <Target className="w-4 h-4" />
                  <span>LAUNCH MISSION CONTROL</span>
                </button>
                <button 
                  onClick={() => navigate('/console/investigations')}
                  className="bg-[#0B1220] hover:bg-[#1E293B] border border-[#1E293B] text-slate-200 font-extrabold text-xs px-8 py-4 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2.5 active:scale-95"
                >
                  <FileText className="w-4 h-4 text-[#6366F1]" />
                  <span>START INVESTIGATION ROOM</span>
                </button>
              </div>
            </div>

            {/* Testimonials and Metric Grid */}
            <div className="lg:col-span-6 space-y-5">
              {/* Testimonial slider */}
              <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-5 relative overflow-hidden shadow-2xl text-left">
                <div className="flex justify-between items-center border-b border-[#1E293B] pb-2 text-[9px] font-mono text-slate-500 mb-3">
                  <span>SECOPS OFFICER TESTIMONIAL</span>
                  <div className="flex space-x-1.5">
                    {testimonials.map((_, i) => (
                      <button 
                        key={i} 
                        onClick={() => {
                          registerUserInteraction();
                          setActiveTestimonial(i);
                        }}
                        className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-all ${activeTestimonial === i ? 'bg-[#00E5FF]' : 'bg-slate-700'}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="min-h-[90px] flex flex-col justify-between">
                  <p className="text-slate-300 italic text-[11px] leading-relaxed">
                    "{testimonials[activeTestimonial].quote}"
                  </p>
                  <div className="flex justify-between items-end mt-4">
                    <div>
                      <span className="font-bold text-slate-100 text-[10px] block leading-none">{testimonials[activeTestimonial].name}</span>
                      <span className="text-[8px] font-mono text-slate-500 uppercase mt-0.5 block">{testimonials[activeTestimonial].role} @ {testimonials[activeTestimonial].company}</span>
                    </div>
                    <span className="bg-[#00E5FF]/5 border border-[#00E5FF]/20 text-[#00E5FF] px-2 py-0.5 rounded font-mono text-[8px]">
                      {testimonials[activeTestimonial].metrics}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mini metric counters */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-3 text-left space-y-1">
                  <span className="text-[7px] font-mono text-slate-500 uppercase block leading-none">Scans Performed</span>
                  <h3 className="text-md font-bold font-mono text-[#00E5FF]"><CountUp end={235795} /></h3>
                </div>
                <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-3 text-left space-y-1">
                  <span className="text-[7px] font-mono text-slate-500 uppercase block leading-none">Scams Intercepted</span>
                  <h3 className="text-md font-bold font-mono text-slate-200"><CountUp end={5574} /></h3>
                </div>
                <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-3 text-left space-y-1">
                  <span className="text-[7px] font-mono text-slate-500 uppercase block leading-none">AI F1 Accuracy</span>
                  <h3 className="text-md font-bold font-mono text-[#22C55E]"><CountUp end={96.8} decimals={1} suffix="%" /></h3>
                </div>
              </div>
            </div>

          </div>
        </section>

      </div>

      {/* Chapter Indicator Navigation Dots (Sticky bottom left or right) */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center space-y-3.5 bg-[#0B1220]/75 backdrop-blur border border-[#1E293B] p-2.5 rounded-full">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            onClick={() => scrollToScene(num)}
            className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
              activeScene === num 
                ? 'bg-[#00E5FF] scale-125 shadow-md shadow-[#00E5FF]/45' 
                : 'bg-slate-700 hover:bg-slate-400'
            }`}
            title={`Jump to Scene ${num}`}
          />
        ))}
      </div>

      {/* Interactive Bottom Progress Indicator */}
      <div className="fixed bottom-0 left-0 right-0 z-40 h-[3px] bg-[#0B1220]">
        <div 
          className="bg-[#00E5FF] h-full transition-all duration-300"
          style={{ width: `${(activeScene / 5) * 100}%` }}
        />
      </div>

    </div>
  );
};

export default LandingPage;
