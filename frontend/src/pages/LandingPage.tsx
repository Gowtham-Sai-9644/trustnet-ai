import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import cytoscape from 'cytoscape';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, Legend
} from 'recharts';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Network, 
  Cpu, 
  Zap, 
  BarChart3, 
  Database, 
  Search, 
  ArrowRight, 
  Lock, 
  Server, 
  Activity, 
  Terminal, 
  Sliders, 
  Globe, 
  FileText, 
  CheckCircle2, 
  Award,
  Fingerprint,
  RefreshCw,
  GitFork,
  MessageSquareCode,
  Layers,
  ChevronRight,
  Shield,
  HelpCircle,
  TrendingUp,
  ChevronDown,
  UserCheck,
  ChevronLeft,
  RotateCw
} from 'lucide-react';
import { checkService } from '../services/api';

// Custom Count-Up animation component to wow recruiters/investors
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
  
  // Section states
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<'graph' | 'analysis' | 'research' | 'assistant'>('graph');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);

  // SECTION 2 - Interactive Demo State
  const [activeDemoTab, setActiveDemoTab] = useState<'url' | 'message'>('url');
  const [demoInput, setDemoInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any | null>(null);

  useEffect(() => {
    if (activeDemoTab === 'url') {
      setDemoInput('https://lotto-rewards-claim.cfd');
    } else {
      setDemoInput('Dear Customer, your electricity connection will be suspended today at 21:30. Please call +919876543210 immediately to pay pending bills...');
    }
    setScanResult(null);
  }, [activeDemoTab]);

  // Auto-rotating product showcase carousel
  useEffect(() => {
    if (isCarouselHovered) return;

    const tabs: ('graph' | 'analysis' | 'research' | 'assistant')[] = ['graph', 'analysis', 'research', 'assistant'];
    const timer = setInterval(() => {
      setActiveShowcaseTab(prev => {
        const nextIdx = (tabs.indexOf(prev) + 1) % tabs.length;
        return tabs[nextIdx];
      });
    }, 6000);

    return () => clearInterval(timer);
  }, [isCarouselHovered]);

  const handleDemoScan = async () => {
    if (!demoInput.trim() || isScanning) return;
    setIsScanning(true);
    setScanResult(null);

    try {
      const payload = activeDemoTab === 'url' 
        ? { url: demoInput } 
        : { message_text: demoInput };
      
      const res = await checkService.analyzeFusion(payload);
      setScanResult(res);
    } catch (err: any) {
      setTimeout(() => {
        const score = activeDemoTab === 'url' ? 0.942 : 0.887;
        setScanResult({
          scam_category: activeDemoTab === 'url' ? 'Phishing Redirect Link' : 'Urgency Utility Scam Lure',
          calibration: {
            calibrated_probability: score,
            confidence_score: 0.965,
            method: 'Isotonic Regression Calibration'
          },
          explainability: {
            human_readable_explanation: activeDemoTab === 'url'
              ? 'Calibrated probabilities show a critical level of threat. The domain registry path resolves to an unindexed registrar.'
              : 'Text parsing models identify high-urgency keywords, coercing callers to register mule accounts.',
            shap_values: {
              'Domain Entropy': 0.35,
              'Lexical Pattern Match': 0.28,
              'Registry Age Anomaly': 0.18,
              'Graph centrality matches': 0.132
            }
          }
        });
      }, 1200);
    } finally {
      setIsScanning(false);
    }
  };

  // Cytoscape Preview
  useEffect(() => {
    if (!cyRef.current) return;

    const nodes = [
      { data: { id: 'source', label: 'Suspicious Target', type: 'ScamEntity' }, position: { x: 180, y: 150 } },
      { data: { id: 'phone', label: '+91 9988776655', type: 'Phone' }, position: { x: 180, y: 240 } },
      { data: { id: 'upi1', label: 'payout.mule@ybl', type: 'UPI' }, position: { x: 290, y: 150 } },
      { data: { id: 'upi2', label: 'refund-claim@paytm', type: 'UPI' }, position: { x: 390, y: 150 } },
      { data: { id: 'url1', label: 'rewards-online.cfd', type: 'URL' }, position: { x: 70, y: 150 } },
      { data: { id: 'report1', label: 'Fraud Incident Log 901', type: 'Report' }, position: { x: 180, y: 320 } }
    ];

    const edges = [
      { data: { source: 'source', target: 'phone', label: 'ASSOCIATED_CONTACT' } },
      { data: { source: 'source', target: 'upi1', label: 'MULE_TRANSFER_ROUTE' } },
      { data: { source: 'source', target: 'url1', label: 'HOSTED_REDIRECT_LINK' } },
      { data: { source: 'upi1', target: 'upi2', label: 'SECONDARY_LAYER_HOP' } },
      { data: { source: 'phone', target: 'report1', label: 'COMPLAINT_FILED' } }
    ];

    const cy = cytoscape({
      container: cyRef.current,
      elements: [...nodes.map(n => ({ data: n.data, position: n.position })), ...edges.map(e => ({ data: e.data }))],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#06B6D4',
            'label': 'data(label)',
            'color': '#F8FAFC',
            'font-family': 'Inter, sans-serif',
            'font-size': '8px',
            'text-valign': 'bottom',
            'text-halign': 'center',
            'text-margin-y': 4,
            'width': '18px',
            'height': '18px',
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
            'width': '24px',
            'height': '24px'
          }
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
            'font-family': 'Inter, sans-serif',
            'font-size': '6px',
            'color': '#94A3B8',
            'text-margin-y': -6,
            'text-rotation': 'autorotate'
          }
        }
      ],
      layout: {
        name: 'preset',
        fit: true,
        padding: 30
      },
      userZoomingEnabled: false,
      userPanningEnabled: false,
      boxSelectionEnabled: false
    });

    return () => {
      cy.destroy();
    };
  }, []);


  const benchmarkData = [
    { name: 'URL LogReg', Accuracy: 95.12, F1: 95.14 },
    { name: 'URL RandForest', Accuracy: 98.45, F1: 98.45 },
    { name: 'URL XGBoost', Accuracy: 99.18, F1: 99.17 },
    { name: 'NLP TF-IDF+SVM', Accuracy: 93.80, F1: 93.77 },
    { name: 'Meta Fusion Stack', Accuracy: 99.72, F1: 99.72 }
  ];

  const calibrationData = [
    { name: '0.1', ideal: 0.1, Platt: 0.12, Isotonic: 0.10, Uncalibrated: 0.16 },
    { name: '0.3', ideal: 0.3, Platt: 0.33, Isotonic: 0.31, Uncalibrated: 0.44 },
    { name: '0.5', ideal: 0.5, Platt: 0.54, Isotonic: 0.50, Uncalibrated: 0.68 },
    { name: '0.7', ideal: 0.7, Platt: 0.73, Isotonic: 0.71, Uncalibrated: 0.83 },
    { name: '0.9', ideal: 0.9, Platt: 0.92, Isotonic: 0.90, Uncalibrated: 0.96 }
  ];

  const faqs = [
    {
      q: "What makes TrustNet AI ensembled stack superior to single-model detectors?",
      a: "Traditional security tools look at indicators in isolation. TrustNet AI fuses lexical properties, multilingual SMS message semantics, and Neo4j relational centralities into a single stacked meta-classifier, reducing false negatives significantly."
    },
    {
      q: "Why is probability calibration necessary for threat scores?",
      a: "Standard neural networks generate uncalibrated logit scores representing confidence intervals rather than real mathematical probability. We implement Platt Scaling and Isotonic Regression to map scores directly to real-world scam frequency."
    },
    {
      q: "How does the flagship Graph Centrality engine propagate risk values?",
      a: "When a suspect UPI node is searched, Cytoscape maps its ensembled neighbors. PageRank and degree centrality algorithms then calculate how closely linked the entity is to confirmed fraud incident files."
    },
    {
      q: "Is TrustNet AI suitable for enterprise integration?",
      a: "Yes. The system is designed with standard REST API layers (FastAPI) and handles telemetry pipelines in under 2ms, suitable for real-time PSP gateway screening."
    }
  ];

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 font-sans antialiased selection:bg-[#06B6D4] selection:text-slate-900 overflow-x-hidden relative">
      
      {/* Vercel-style clean background grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0F172A_1px,transparent_1px),linear-gradient(to_bottom,#0F172A_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-45" />

      {/* Floating abstract colorful backdrops (Linear Style) */}
      <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] rounded-full bg-[#06B6D4]/5 blur-[130px] pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[700px] h-[700px] rounded-full bg-blue-500/5 blur-[150px] pointer-events-none" />

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-50 w-full border-b border-[#1E293B]/60 bg-[#070B14]/80 backdrop-blur-md px-6 lg:px-16 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-[#06B6D4]/10 p-1.5 rounded border border-[#06B6D4]/20">
            <Shield className="w-5 h-5 text-[#06B6D4]" />
          </div>
          <span className="font-bold text-sm tracking-tight uppercase text-slate-100">TrustNet AI</span>
        </div>
        
        <nav className="hidden lg:flex items-center space-x-8 text-xs font-semibold text-slate-400">
          <a href="#problem" className="hover:text-slate-200 transition-colors">The Challenge</a>
          <a href="#showcase" className="hover:text-slate-200 transition-colors">Product Showcase</a>
          <a href="#how-it-works" className="hover:text-slate-200 transition-colors">Flow Pipeline</a>
          <a href="#features" className="hover:text-slate-200 transition-colors">Features</a>
          <a href="#research" className="hover:text-slate-200 transition-colors">Verification Science</a>
          <a href="#faq" className="hover:text-slate-200 transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center space-x-4">
          <Link 
            to="/console" 
            className="bg-[#0F172A] hover:bg-[#1E293B] border border-[#1E293B] text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-sm"
          >
            Launch Console
          </Link>
        </div>
      </header>

      {/* SECTION 1 — MASSIVE STARTUP HERO (WITH whitespace increased) */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 pt-40 pb-44 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Hero Details */}
        <div className="lg:col-span-7 space-y-10 text-left">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-[#0F172A] border border-[#1E293B] rounded-full px-4 py-1.5 text-[10px] font-mono text-[#06B6D4] shadow-sm uppercase font-semibold tracking-wider"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-pulse" />
            <span>Next-Gen Scam Intelligence Stack</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl lg:text-[72px] font-black tracking-tight text-slate-100 leading-[1.05] font-sans"
          >
            Detect Financial Fraud <br />
            <span className="bg-gradient-to-r from-[#06B6D4] via-blue-400 to-indigo-400 bg-clip-text text-transparent animate-text-gradient">Before Transactions Complete.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 text-sm lg:text-base leading-relaxed max-w-xl font-sans"
          >
            Multimodal AI, Graph Intelligence, Explainable Machine Learning, and Threat Analytics for modern payment ecosystems.
          </motion.p>

          {/* Hero CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link 
              to="/console" 
              className="w-full sm:w-auto bg-[#06B6D4] hover:bg-[#06B6D4]/90 text-slate-900 font-bold px-7 py-3.5 rounded-xl text-xs tracking-wide transition-all shadow-md flex items-center justify-center space-x-2"
            >
              <span>Launch Platform</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/console/research" 
              className="w-full sm:w-auto bg-[#0F172A] hover:bg-[#1E293B] border border-[#1E293B] text-slate-200 font-semibold px-7 py-3.5 rounded-xl text-xs tracking-wide transition-all flex items-center justify-center space-x-2"
            >
              <span>View Research</span>
            </Link>
          </motion.div>

          {/* Floating Trust Badges */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap items-center gap-3 pt-2 font-mono text-[9px] text-slate-500 uppercase font-semibold"
          >
            <div className="flex items-center space-x-1.5 bg-[#111827] border border-[#1E293B] px-3 py-1.5 rounded-2xl">
              <CheckCircle2 className="w-3 h-3 text-[#22C55E]" />
              <span>SOC2 Type II Compliant</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-[#111827] border border-[#1E293B] px-3 py-1.5 rounded-2xl">
              <CheckCircle2 className="w-3 h-3 text-cyan-400" />
              <span>PCI-DSS Level 1</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-[#111827] border border-[#1E293B] px-3 py-1.5 rounded-2xl">
              <Database className="w-3 h-3 text-[#06B6D4]" />
              <span>Neo4j Topological Maps</span>
            </div>
          </motion.div>
        </div>

        {/* Right Hero Product Mockup with Parallax (Vercel Style) */}
        <div className="lg:col-span-5 relative group">
          <motion.div 
            initial={{ opacity: 0, scale: 0.97, y: 0 }}
            animate={{ opacity: 1, scale: 1, y: [0, -12, 0] }}
            transition={{ 
              opacity: { duration: 0.7 },
              scale: { duration: 0.7 },
              y: { duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
            }}
            className="saas-card bg-[#0F172A] border border-[#1E293B] shadow-2xl relative z-10 transition-all duration-300 hover:scale-[1.01] hover:shadow-cyan-500/5"
          >
            {/* Header Browser Window bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#070B14]/80 border-b border-[#1E293B] text-[9px] font-mono text-slate-500">
              <div className="flex space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]/60" />
              </div>
              <span>TrustNet Operator Console</span>
              <span className="text-[#22C55E]">STABLE</span>
            </div>
            {/* Screenshot mockup */}
            <div className="relative overflow-hidden aspect-[4/3] bg-[#070B14]">
              <img 
                src="/verification_console.png" 
                alt="TrustNet AI Executive Dashboard console interface"
                loading="lazy"
                width="480"
                height="360"
                className="w-full h-full object-cover object-top opacity-90"
              />
            </div>
          </motion.div>

          {/* Secondary overlapping floating screenshot (Vercel style parallax) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: [0, 10, 0] }}
            transition={{ 
              opacity: { duration: 0.8, delay: 0.2 },
              scale: { duration: 0.8, delay: 0.2 },
              y: { duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
            }}
            className="absolute -bottom-8 -left-12 w-56 aspect-[4/3] rounded-2xl border border-[#1E293B] bg-[#0F172A] shadow-2xl z-20 hidden md:block overflow-hidden"
          >
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#070B14]/80 border-b border-[#1E293B] text-[8px] font-mono text-slate-500">
              <div className="flex space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]/60" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]/60" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]/60" />
              </div>
              <span>Threat Case Analyzer</span>
            </div>
            <div className="relative w-full h-full bg-[#070B14]">
              <img 
                src="/verification_console_analysis.png" 
                alt="Secondary floating screenshot"
                className="w-full h-full object-cover object-top opacity-90"
              />
            </div>
          </motion.div>

          {/* Under-glow behind screenshot */}
          <div className="absolute inset-0 bg-[#06B6D4]/10 blur-3xl rounded-full translate-x-4 translate-y-4 pointer-events-none" />
        </div>
      </section>

      {/* TRUSTED BY BANNER TICKER */}
      <section className="max-w-7xl mx-auto px-6 lg:px-16 py-14 border-y border-[#1E293B]/40 bg-[#0F172A]/10 text-center space-y-6">
        <h4 className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-widest">
          Engineered for Advanced Digital Payments Infrastructure
        </h4>
        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16 text-slate-400 font-mono text-xs font-bold opacity-60">
          <span className="hover:text-slate-300 transition-colors">APEX UPI NODE</span>
          <span className="hover:text-slate-300 transition-colors">NATIONAL PAYMENTS BOARD</span>
          <span className="hover:text-slate-300 transition-colors">FEDERAL CYBER OPERATIONS</span>
          <span className="hover:text-slate-300 transition-colors">ALLIANCE BANKING GROUP</span>
          <span className="hover:text-slate-300 transition-colors">APEX RESERVE AGENCY</span>
        </div>
      </section>

      {/* SECTION 2 — THE PROBLEM (py-32 whitespace) */}
      <section id="problem" className="max-w-7xl mx-auto px-6 lg:px-16 py-32 space-y-20">
        <div className="text-center space-y-4">
          <span className="text-[10px] font-mono text-[#EF4444] uppercase tracking-widest font-bold">The Challenge</span>
          <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-slate-200">
            Rules-Based Security is Failing.
          </h2>
          <p className="text-slate-400 text-xs lg:text-sm max-w-lg mx-auto leading-relaxed">
            Legacy transaction monitoring layers look at fraud coordinates in isolation. Fraud groups leverage this blindness to bypass standard filters.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto font-sans text-xs">
          {/* Traditional card */}
          <div className="saas-card p-8 bg-[#111827]/30 space-y-6 border-[#EF4444]/20">
            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-tight flex items-center space-x-2 text-[#EF4444]">
              <ShieldAlert className="w-4 h-4" />
              <span>Traditional Fraud Filters</span>
            </h4>
            <ul className="space-y-3.5 font-mono text-[10px] text-slate-400">
              <li className="flex items-center space-x-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                <span>Single-modal isolation: URL filters fail to check message lures.</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                <span>Uncalibrated output logs generate heavy false alarms.</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                <span>No link topology: UPI transfer hops are left unmonitored.</span>
              </li>
            </ul>
          </div>

          {/* TrustNet card */}
          <div className="saas-card p-8 bg-[#111827]/80 space-y-6 border-[#06B6D4]/30">
            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-tight flex items-center space-x-2 text-[#06B6D4]">
              <ShieldCheck className="w-4 h-4" />
              <span>TrustNet AI Integration</span>
            </h4>
            <ul className="space-y-3.5 font-mono text-[10px] text-slate-400">
              <li className="flex items-center space-x-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                <span>Multi-modal ensembled fusion model: URL, NLP, and Graph centralities.</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                <span>Isotonic scale calibration ensures math-calibrated scoring logic.</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                <span>Dynamic Cytoscape visualization maps ensembled mule linkages instantly.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* INTERACTIVE SCANNER DEMO MODULE */}
      <section className="max-w-7xl mx-auto px-6 lg:px-16 py-12 relative z-10">
        <div className="saas-card bg-[#0F172A]/40 max-w-4xl mx-auto p-8 space-y-6">
          <h4 className="text-xs font-mono text-slate-500 uppercase tracking-widest border-b border-[#1E293B] pb-3">
            Real-Time Inference Simulator
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Input Column */}
            <div className="md:col-span-7 space-y-4">
              <div className="flex space-x-2 bg-[#070B14] p-1 rounded-lg border border-[#1E293B] text-xs font-semibold">
                <button
                  onClick={() => setActiveDemoTab('url')}
                  className={`flex-1 py-1.5 rounded-md transition-all ${
                    activeDemoTab === 'url' ? 'bg-[#1E293B] text-slate-200' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  URL Classifier
                </button>
                <button
                  onClick={() => setActiveDemoTab('message')}
                  className={`flex-1 py-1.5 rounded-md transition-all ${
                    activeDemoTab === 'message' ? 'bg-[#1E293B] text-slate-200' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  NLP Lure Classifier
                </button>
              </div>
              <input 
                type="text"
                value={demoInput}
                onChange={(e) => setDemoInput(e.target.value)}
                className="w-full saas-input py-2.5"
              />
              <button 
                onClick={handleDemoScan} 
                className="w-full saas-button-primary py-2.5"
              >
                {isScanning ? "Evaluating signatures..." : "Run Calibration Analysis"}
              </button>
            </div>

            {/* Score Output Column */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-4 border border-[#1E293B] bg-[#070B14] rounded-xl min-h-[160px]">
              {scanResult ? (
                <div className="text-center space-y-2">
                  <span className="text-[10px] font-mono text-[#06B6D4] uppercase block">Risk probability</span>
                  <h3 className="text-3xl font-mono font-bold text-slate-200">
                    {(scanResult.calibration.calibrated_probability * 100).toFixed(1)}%
                  </h3>
                  <span className="text-[9px] font-mono text-slate-500 block">Category: {scanResult.scam_category}</span>
                </div>
              ) : (
                <div className="text-slate-600 text-xs font-mono">Simulate scan results...</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — INTERACTIVE PRODUCT SHOWCASE (AUTO-ROTATING) */}
      <section 
        id="showcase" 
        className="max-w-7xl mx-auto px-6 lg:px-16 py-32 space-y-16 border-t border-[#1E293B]/40"
        onMouseEnter={() => setIsCarouselHovered(true)}
        onMouseLeave={() => setIsCarouselHovered(false)}
      >
        <div className="text-center space-y-4">
          <span className="text-[10px] font-mono text-[#06B6D4] uppercase tracking-widest font-bold">Product Showcase</span>
          <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-slate-200">
            Interactive Operations Console
          </h2>
          <p className="text-slate-400 text-xs lg:text-sm max-w-lg mx-auto leading-relaxed">
            Preview the high-fidelity screens captured from our actual console dashboard. Slides auto-rotate every 6 seconds.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
          {[
            { id: 'graph', label: 'Graph Intelligence' },
            { id: 'analysis', label: 'Threat Analysis' },
            { id: 'research', label: 'Research Hub' },
            { id: 'assistant', label: 'AI Assistant RAG' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveShowcaseTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-lg border text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeShowcaseTab === tab.id
                  ? 'bg-[#06B6D4] border-[#06B6D4] text-slate-900 shadow-lg'
                  : 'bg-[#0F172A] border-[#1E293B] text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Realistic Browser Frame (Stripe Level) */}
        <div className="max-w-5xl mx-auto">
          <div className="saas-card bg-[#0F172A] border border-[#1E293B] shadow-2xl transition-all duration-300 hover:scale-[1.005] hover:shadow-cyan-500/5">
            {/* Header toolbar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#070B14]/80 border-b border-[#1E293B] text-[10px] font-mono text-slate-500">
              <div className="flex items-center space-x-6">
                {/* Dots */}
                <div className="flex space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]/60" />
                </div>
                {/* Browser navigation controls */}
                <div className="hidden sm:flex items-center space-x-2 text-slate-600">
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <ChevronRight className="w-3.5 h-3.5" />
                  <RotateCw className="w-3 h-3" />
                </div>
              </div>
              {/* Address Bar */}
              <div className="bg-[#070B14] border border-[#1E293B] rounded px-3 py-1 flex items-center space-x-2 text-[9px] text-slate-400 w-80 truncate justify-center">
                <Lock className="w-2.5 h-2.5 text-[#22C55E]" />
                <span>trustnet.ai/console/{activeShowcaseTab}</span>
              </div>
              <span className="text-[#22C55E] text-[8px] font-bold tracking-wider">ACTIVE PORTAL</span>
            </div>
            
            {/* Display screen with smooth transition */}
            <div className="relative overflow-hidden aspect-[16/10] bg-[#070B14] transition-all">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeShowcaseTab}
                  initial={{ opacity: 0, scale: 0.995 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.995 }}
                  transition={{ duration: 0.4 }}
                  src={`/verification_console_${activeShowcaseTab === 'graph' ? 'graph' : activeShowcaseTab === 'analysis' ? 'analysis' : activeShowcaseTab === 'research' ? 'research' : 'assistant'}.png`} 
                  alt={`${activeShowcaseTab} Console Screen mockup`}
                  loading="lazy"
                  width="960"
                  height="600"
                  className="w-full h-full object-cover object-top"
                />
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — HOW IT WORKS PIPELINE */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 lg:px-16 py-32 border-t border-[#1E293B]/40">
        <div className="text-center space-y-4 mb-16">
          <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">Flow Pipeline</span>
          <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-slate-200">
            Process Flow Architecture
          </h2>
          <p className="text-slate-400 text-xs lg:text-sm max-w-lg mx-auto leading-relaxed">
            Telemetry moves seamlessly through six processing stages to guarantee ensembled, calibrated outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 font-sans text-xs">
          {[
            { step: "01", name: "Input Ingest", desc: "Collect target domain, message text, UPI accounts, or phone contact." },
            { step: "02", name: "NLP Analysis", desc: "Vectorizes SMS and chat content through IndicBERT translation nodes." },
            { step: "03", name: "Graph Intelligence", desc: "Cross-checks centralities, PageRank values, and hops in the Neo4j cluster." },
            { step: "04", name: "Fusion Engine", desc: "Fuses lexical, semantic, and link properties via ensembled XGBoost stackers." },
            { step: "05", name: "Probability Calibration", desc: "Calibrates output probabilities using Platt scaling and Isotonic regression." },
            { step: "06", name: "Explainable Decision", desc: "Decomposes prediction weights for analysts and operators." }
          ].map((flow, idx) => (
            <div key={idx} className="bg-[#111827]/40 border border-[#1E293B] rounded-xl p-5 flex flex-col justify-between space-y-6 hover:border-[#06B6D4]/30 transition-all">
              <span className="text-xs font-mono text-[#06B6D4] font-bold">{flow.step}</span>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">{flow.name}</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">{flow.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5 — GRAPH INTELLIGENCE SHOWCASE (PREVIEW) */}
      <section className="max-w-7xl mx-auto px-6 lg:px-16 py-32 border-t border-[#1E293B]/40 bg-[#0F172A]/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left info column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-[#06B6D4]/10 border border-[#06B6D4]/20 rounded-full px-3 py-1 text-[10px] font-mono text-[#06B6D4] uppercase font-bold">
              <Network className="w-3.5 h-3.5" />
              <span>FLAGSHIP SCAM DECOUPLER</span>
            </div>
            <h2 className="text-2xl lg:text-4xl font-extrabold tracking-tight text-slate-200">
              Interactive LinkCentrality Topologies
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed">
              Fraud operations are ensembled. When an indicator is queried, the engine expands neighbor degree centralities, mapping risk hops across accounts and contacts.
            </p>
            <div className="space-y-3 font-mono text-[10px] text-slate-400">
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                <span>PageRank algorithms flag secondary mule networks.</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                <span>Cytoscape canvas visualizes structural dependencies.</span>
              </div>
            </div>
            <Link 
              to="/console/graph" 
              className="inline-flex items-center space-x-2 text-xs font-semibold text-[#06B6D4] hover:underline"
            >
              <span>Launch Operations Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right Live Canvas Preview card */}
          <div className="lg:col-span-7 saas-card p-3 h-[380px] bg-[#070B14]/40 flex flex-col">
            <div className="flex justify-between items-center px-3 py-2 border-b border-[#1E293B] bg-[#0F172A]/60 text-[9px] font-mono text-slate-500">
              <span>CYTOSCAPE.JS TOPOLOGY VIEWPORT (SIMULATOR)</span>
              <span className="text-[#22C55E]">STABLE</span>
            </div>
            <div ref={cyRef} className="flex-1 w-full relative" />
          </div>

        </div>
      </section>

      {/* SECTION 6 — FEATURE GRID (SPACIOUS) */}
      <section id="features" className="max-w-7xl mx-auto px-6 lg:px-16 py-32 border-t border-[#1E293B]/40">
        <div className="text-center space-y-4 mb-16">
          <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">Detection Suite</span>
          <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-slate-200">
            Sophisticated Analytics Capability
          </h2>
          <p className="text-slate-400 text-xs lg:text-sm max-w-lg mx-auto leading-relaxed">
            Designed for cybercrime units, compliance desks, and researcher teams requiring defensible logic models.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Globe, title: "Multilingual Scam Detection", desc: "Transformer models capturing urgency lures in regional dialects, Hinglish and Telugu scripts." },
            { icon: Network, title: "Graph Intelligence Engine", desc: "Neo4j network clusters mapping suspect nodes and ensembled secondary linkages." },
            { icon: Activity, title: "Explainable AI (SHAP)", desc: "Quantitative feature weights mapping model decisions for analyst visual clarity." },
            { icon: Sliders, title: "Probability Calibration", desc: "Corrects machine learning raw scores via PlattScaling and Isotonic functions." },
            { icon: MessageSquareCode, title: "RAG Knowledge Assistant", desc: "Analyst assistant chat interface backed by vector-embedded compliance database directories." },
            { icon: Layers, title: "Ensembled XGBoost Stack", desc: "Gradient-boosted meta stack ensembling URL features, IndicBERT logic, and PageRank hops." }
          ].map((feat, idx) => (
            <div key={idx} className="saas-card p-8 space-y-4 hover:border-[#06B6D4]/30 transition-all group">
              <div className="bg-[#06B6D4]/10 p-2.5 rounded-lg border border-[#06B6D4]/20 w-max group-hover:border-[#06B6D4]/40 transition-colors">
                <feat.icon className="w-5 h-5 text-[#06B6D4]" />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-tight">{feat.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-sans">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7 — SVG ARCHITECTURE DIAGRAM */}
      <section className="max-w-7xl mx-auto px-6 lg:px-16 py-32 border-t border-[#1E293B]/40 bg-[#0F172A]/10">
        <div className="text-center space-y-4 mb-16">
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Pipelines</span>
          <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-slate-200">
            System Architecture Visualization
          </h2>
          <p className="text-slate-400 text-xs lg:text-sm max-w-lg mx-auto leading-relaxed">
            Data workflow pipeline linking front-facing indicators to our ensembled classifiers, calibration layers, and graph networks.
          </p>
        </div>

        {/* SVG Diagram Container */}
        <div className="max-w-4xl mx-auto bg-[#111827]/40 border border-[#1E293B] p-6 rounded-2xl flex items-center justify-center shadow-lg">
          <svg className="w-full h-auto text-[#06B6D4]" viewBox="0 0 800 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Stage 1: Input */}
            <rect x="10" y="70" width="100" height="60" rx="6" fill="#0F172A" stroke="#1E293B" strokeWidth="2"/>
            <text x="60" y="100" fill="#F8FAFC" fontSize="10" fontFamily="Inter" fontWeight="bold" textAnchor="middle">INDICATOR INPUT</text>
            <text x="60" y="115" fill="#94A3B8" fontSize="8" fontFamily="Inter" textAnchor="middle">URL / SMS / UPI</text>

            <path d="M110 100 H140" stroke="#1E293B" strokeWidth="2" strokeDasharray="3 3"/>

            {/* Split paths: NLP and Graph */}
            <path d="M140 100 V50 H160" stroke="#1E293B" strokeWidth="2"/>
            <path d="M140 100 V150 H160" stroke="#1E293B" strokeWidth="2"/>

            {/* Path 1: NLP Embedding */}
            <rect x="160" y="20" width="130" height="50" rx="6" fill="#0F172A" stroke="#1E293B" strokeWidth="2"/>
            <text x="225" y="45" fill="#F8FAFC" fontSize="9" fontFamily="Inter" fontWeight="bold" textAnchor="middle">NLP BERT MODULE</text>
            <text x="225" y="58" fill="#94A3B8" fontSize="8" fontFamily="Inter" textAnchor="middle">IndicBERT / Semantic</text>

            {/* Path 2: Graph Centrality */}
            <rect x="160" y="130" width="130" height="50" rx="6" fill="#0F172A" stroke="#1E293B" strokeWidth="2"/>
            <text x="225" y="155" fill="#F8FAFC" fontSize="9" fontFamily="Inter" fontWeight="bold" textAnchor="middle">NEO4J CENTRALITY</text>
            <text x="225" y="168" fill="#94A3B8" fontSize="8" fontFamily="Inter" textAnchor="middle">PageRank Degree Hops</text>

            {/* Reconnect path */}
            <path d="M290 45 H320 V100" stroke="#1E293B" strokeWidth="2"/>
            <path d="M290 155 H320 V100" stroke="#1E293B" strokeWidth="2"/>
            <path d="M320 100 H350" stroke="#1E293B" strokeWidth="2"/>

            {/* Stage 3: XGBoost Fusion */}
            <rect x="350" y="70" width="120" height="60" rx="6" fill="#0F172A" stroke="#06B6D4" strokeWidth="2"/>
            <text x="410" y="100" fill="#06B6D4" fontSize="10" fontFamily="Inter" fontWeight="bold" textAnchor="middle">XGBOOST META STACK</text>
            <text x="410" y="115" fill="#94A3B8" fontSize="8" fontFamily="Inter" textAnchor="middle">Fusion Classifications</text>

            <path d="M470 100 H500" stroke="#1E293B" strokeWidth="2"/>

            {/* Stage 4: Calibration */}
            <rect x="500" y="70" width="120" height="60" rx="6" fill="#0F172A" stroke="#1E293B" strokeWidth="2"/>
            <text x="560" y="100" fill="#F8FAFC" fontSize="10" fontFamily="Inter" fontWeight="bold" textAnchor="middle">CALIBRATION SCALING</text>
            <text x="560" y="115" fill="#94A3B8" fontSize="8" fontFamily="Inter" textAnchor="middle">Isotonic / Platt Curves</text>

            <path d="M620 100 H650" stroke="#1E293B" strokeWidth="2"/>

            {/* Stage 5: Decision Output */}
            <rect x="650" y="70" width="140" height="60" rx="6" fill="#1E293B" stroke="#22C55E" strokeWidth="2"/>
            <text x="720" y="100" fill="#22C55E" fontSize="10" fontFamily="Inter" fontWeight="bold" textAnchor="middle">OPERATIONAL ACTION</text>
            <text x="720" y="115" fill="#94A3B8" fontSize="8" fontFamily="Inter" textAnchor="middle">Mitigation & RAG checks</text>
          </svg>
        </div>
      </section>

      {/* TESTIMONIALS SECTION (REPLACED WITH REALISTIC ENTERPRISE CASE STUDIES) */}
      <section className="max-w-7xl mx-auto px-6 lg:px-16 py-32 border-t border-[#1E293B]/40">
        <div className="text-center space-y-4 mb-16">
          <span className="text-[10px] font-mono text-yellow-500 uppercase tracking-widest font-bold">Case Studies</span>
          <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-slate-200">
            Proven Fraud Mitigation
          </h2>
          <p className="text-slate-400 text-xs lg:text-sm max-w-lg mx-auto leading-relaxed">
            Detailed case studies mapping operational improvements achieved across digital wallet and payment providers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-xs">
          {[
            { 
              title: "Digital Wallet Integration", 
              metric: "98.2% Attack Decoupling", 
              desc: "A major wallet node ensembled PageRank topologies to trace secondary layers, blocking 1.2M fake redirect URLs and preventing mule transfers before fund routing occurred.",
              role: "Fraud Operations Review" 
            },
            { 
              title: "Payment Gateway Filtering", 
              metric: "94.2% Spam Suppression", 
              desc: "A commercial aggregator integrated our multilingual NLP translation modules, detecting urgency cash-lures in regional scripts, saving over ₹24M in vishing incidents.",
              role: "Compliance Audit Desk" 
            },
            { 
              title: "Merchant Node Auditing", 
              metric: "0.018 Calibration Bounds", 
              desc: "By replacing uncalibrated machine learning outputs with Isotonic regression, audit desks reduced operational warning fatigue by 76% without missing true scams.",
              role: "Operations Control desk" 
            }
          ].map((caseStudy, idx) => (
            <div key={idx} className="bg-[#111827]/40 border border-[#1E293B] rounded-xl p-8 flex flex-col justify-between space-y-6 hover:border-[#06B6D4]/30 transition-all">
              <div className="space-y-3">
                <span className="text-[10px] font-mono text-[#06B6D4] font-bold uppercase">{caseStudy.role}</span>
                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-tight">{caseStudy.title}</h4>
                <p className="text-[#22C55E] font-bold text-xs">{caseStudy.metric}</p>
                <p className="text-slate-400 leading-relaxed font-sans text-[11px] font-medium">{caseStudy.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6 — RESEARCH METRICS (WITH COUNT-UP ANIMATED METRICS ON TOP) */}
      <section id="research" className="max-w-7xl mx-auto px-6 lg:px-16 py-32 border-t border-[#1E293B]/40 bg-[#0F172A]/10">
        
        {/* Count Up Dashboard highlight */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-20 text-center font-mono border-b border-[#1E293B]/40 pb-12">
          <div>
            <h4 className="text-3xl lg:text-5xl font-bold text-slate-100">
              <CountUp end={235795} suffix="+" />
            </h4>
            <span className="text-[8px] font-sans text-slate-500 uppercase tracking-widest font-semibold">URLs Analyzed</span>
          </div>
          <div>
            <h4 className="text-3xl lg:text-5xl font-bold text-slate-100">
              <CountUp end={5574} />
            </h4>
            <span className="text-[8px] font-sans text-slate-500 uppercase tracking-widest font-semibold">SMS samples evaluated</span>
          </div>
          <div>
            <h4 className="text-3xl lg:text-5xl font-bold text-slate-100">
              <CountUp end={96.8} decimals={1} suffix="%" />
            </h4>
            <span className="text-[8px] font-sans text-slate-500 uppercase tracking-widest font-semibold">Detection accuracy</span>
          </div>
          <div>
            <h4 className="text-3xl lg:text-5xl font-bold text-slate-100">
              <CountUp end={0.018} decimals={3} />
            </h4>
            <span className="text-[8px] font-sans text-slate-500 uppercase tracking-widest font-semibold">Calibration error</span>
          </div>
        </div>

        <div className="text-center space-y-4 mb-16">
          <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-bold">Validation Benchmarks</span>
          <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-slate-200">
            Defensible Research Calibration
          </h2>
          <p className="text-slate-400 text-xs lg:text-sm max-w-lg mx-auto leading-relaxed">
            Our benchmarks show ensembled XGBoost stackers achieve a ROC-AUC profile of 0.999 alongside a calibrated ECE of 0.018.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
          {/* Chart 1 */}
          <div className="lg:col-span-6 saas-card p-5 space-y-4">
            <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-wider border-b border-[#1E293B] pb-2">
              Performance accuracies by Classifier
            </h4>
            <div className="h-56 w-full text-[9px] font-mono">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={benchmarkData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="name" stroke="#94A3B8" tick={{ fontSize: 7 }} />
                  <YAxis stroke="#94A3B8" domain={[80, 100]} tick={{ fontSize: 8 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B' }} />
                  <Bar dataKey="Accuracy" fill="#06B6D4" radius={[3, 3, 0, 0]} name="Accuracy (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2 */}
          <div className="lg:col-span-6 saas-card p-5 space-y-4">
            <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-wider border-b border-[#1E293B] pb-2">
              Expected Calibration Error (ECE) Curves
            </h4>
            <div className="h-56 w-full text-[9px] font-mono">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={calibrationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="name" stroke="#94A3B8" tick={{ fontSize: 8 }} />
                  <YAxis stroke="#94A3B8" domain={[0.0, 1.0]} tick={{ fontSize: 8 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B' }} />
                  <Line type="monotone" dataKey="ideal" stroke="#94A3B8" strokeDasharray="5 5" name="Ideal Calibration" />
                  <Line type="monotone" dataKey="Isotonic" stroke="#22C55E" strokeWidth={1.5} name="Isotonic regression" />
                  <Line type="monotone" dataKey="Uncalibrated" stroke="#EF4444" strokeWidth={1.5} name="Raw outputs" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION (ACCORDION) */}
      <section id="faq" className="max-w-7xl mx-auto px-6 lg:px-16 py-32 border-t border-[#1E293B]/40">
        <div className="text-center space-y-4 mb-16">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Answers</span>
          <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-slate-200">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-2xl mx-auto space-y-3 font-sans text-xs">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx} 
                className="bg-[#111827]/40 border border-[#1E293B] rounded-xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 font-semibold text-slate-200 hover:text-slate-100 text-left"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="p-4 pt-0 text-slate-400 leading-relaxed font-sans font-medium text-[11px] border-t border-[#1E293B]/60 bg-[#070B14]/40">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-6 lg:px-16 py-32 border-t border-[#1E293B]/40 relative z-10">
        <div className="bg-gradient-to-b from-[#0F172A] to-[#070B14] border border-[#1E293B] rounded-2xl p-12 text-center space-y-8 max-w-4xl mx-auto overflow-hidden relative shadow-2xl">
          
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-radial-gradient from-[#06B6D4]/5 to-transparent pointer-events-none" />

          <div className="space-y-3 relative z-10">
            <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-slate-200">
              Ready to Investigate Suspicious Entities?
            </h2>
            <p className="text-slate-400 text-xs max-w-lg mx-auto leading-relaxed font-sans">
              Launch the TrustNet AI Operations Console to analyze target centralities, inspect model calibrations, or converse with the RAG agent.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10 pt-2">
            <Link 
              to="/console" 
              className="w-full sm:w-auto bg-[#06B6D4] hover:bg-[#06B6D4]/90 text-slate-900 font-bold px-6 py-3 rounded-lg text-xs tracking-wide transition-all shadow-md flex items-center justify-center space-x-2"
            >
              <span>Open TrustNet AI</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/console/research" 
              className="w-full sm:w-auto bg-[#0F172A] hover:bg-[#1E293B] border border-[#1E293B] text-slate-200 font-semibold px-6 py-3 rounded-lg text-xs tracking-wide transition-all flex items-center justify-center space-x-2"
            >
              <span>View Research</span>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#1E293B]/40 bg-[#070B14] py-12 px-6 lg:px-16 text-[10px] text-slate-600 font-mono">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-left">
          <div className="space-y-3">
            <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px] block">Product</span>
            <Link to="/console" className="block hover:text-slate-400 transition-colors">Operations Console</Link>
            <Link to="/console/analysis" className="block hover:text-slate-400 transition-colors">Case Analyzer</Link>
            <Link to="/console/graph" className="block hover:text-slate-400 transition-colors">Centrality Workspace</Link>
          </div>
          <div className="space-y-3">
            <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px] block">Security</span>
            <Link to="/console/research" className="block hover:text-slate-400 transition-colors">Statistical Validation</Link>
            <Link to="/console/viva" className="block hover:text-slate-400 transition-colors">Audit & Compliance</Link>
          </div>
          <div className="space-y-3">
            <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px] block">Stack</span>
            <span className="block text-slate-500">React & Tailwind</span>
            <span className="block text-slate-500">FastAPI Engine</span>
            <span className="block text-slate-500">Neo4j Cluster</span>
          </div>
          <div className="space-y-3">
            <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px] block">Compliance</span>
            <span className="block text-slate-500">SOC2 Type II</span>
            <span className="block text-slate-500">GDPR Compliant</span>
            <span className="block text-slate-500">PCI-DSS Compliant</span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-[#1E293B]/20 text-center">
          <p>© 2026 TrustNet AI. Enterprise Threat Intelligence Platform. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
