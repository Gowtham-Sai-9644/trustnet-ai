import React, { useState, useEffect } from 'react';
import { useAppStore } from '../stores/appStore';
import { 
  Play, 
  RefreshCw, 
  ShieldCheck, 
  ShieldAlert, 
  AlertCircle, 
  Info,
  ArrowRight,
  Fingerprint,
  RotateCcw,
  Zap,
  CheckCircle,
  Database,
  Sliders,
  Server,
  AlertTriangle,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { AppCard } from '../components/ui/AppCard';
import { AppPageHeader } from '../components/ui/AppPageHeader';
import { AppBadge } from '../components/ui/AppBadge';
import { motion, AnimatePresence } from 'framer-motion';

const ThreatAnalysisPage: React.FC = () => {
  const { inputs, setInputs, currentResult, isLoading, error, runFusionAnalysis, clearInputs } = useAppStore();
  const [activeTab, setActiveTab] = useState<'url' | 'upi' | 'phone' | 'message'>('url');
  
  // Custom progressive scan states
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [animatedRisk, setAnimatedRisk] = useState(0);
  
  // V3 Interactive Dial and Evidence States
  const [showDialTooltip, setShowDialTooltip] = useState(false);
  const [expandedEvidence, setExpandedEvidence] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputs({ [name]: value });
  };

  const executeAnalysis = async () => {
    if (!inputs.url && !inputs.phone && !inputs.upi && !inputs.messageText) {
      return;
    }
    
    setIsScanning(true);
    setScanStep(1);
    setShowResults(false);
    setAnimatedRisk(0);

    // Progressive check animation
    setTimeout(() => setScanStep(2), 600);
    setTimeout(() => setScanStep(3), 1200);
    setTimeout(() => setScanStep(4), 1800);
    setTimeout(() => setScanStep(5), 2400);

    // Call store
    await runFusionAnalysis();

    setTimeout(() => {
      setIsScanning(false);
      setShowResults(true);
    }, 2800);
  };

  const score = currentResult?.calibration?.calibrated_probability ?? 0;
  const isHighRisk = score >= 0.55;

  useEffect(() => {
    let timer: any;
    if (showResults && currentResult) {
      let start = 0;
      const target = score * 100;
      const duration = 1500; // ms
      const steps = 60;
      const increment = target / steps;
      const intervalTime = duration / steps;
      
      timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setAnimatedRisk(target);
          clearInterval(timer);
        } else {
          setAnimatedRisk(start);
        }
      }, intervalTime);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [showResults, currentResult, score]);

  const inputStyle = "w-full bg-[#050811] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/30 transition-all font-sans";

  return (
    <div className="space-y-4 text-left font-sans">
      <AppPageHeader 
        title="Threat Analysis Scanner" 
        description="Run deep multi-modal AI risk verification on any URL, UPI address, phone number, or message lure."
        rightElement={
          currentResult && showResults && (
            <AppBadge color={isHighRisk ? 'danger' : 'success'}>
              {isHighRisk ? 'HIGH-RISK SCAM DETECTED' : 'SAFE & VERIFIED SIGNAL'}
            </AppBadge>
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Side Input Panel */}
        <div className="lg:col-span-7 space-y-4">
          <AppCard className="p-5 space-y-5 border-l-4 border-l-[#00E5FF]">
            <div className="border-b border-[#1E293B] pb-3 flex justify-between items-center">
              <span className="font-sans font-bold text-xs text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                <Fingerprint className="w-4 h-4 text-[#00E5FF]" />
                <span>Select Target Indicator</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">1-Click Verification</span>
            </div>

            {/* Tabs Selector */}
            <div className="flex space-x-1 bg-[#050811] p-1 rounded-xl border border-[#1E293B] text-xs font-mono font-bold">
              {[
                { id: 'url', label: 'Domain Link' },
                { id: 'upi', label: 'UPI Handle' },
                { id: 'phone', label: 'Phone Number' },
                { id: 'message', label: 'SMS / Lure Text' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setShowResults(false);
                  }}
                  className={`flex-1 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#00E5FF] text-slate-900 shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Input fields based on active tab */}
            <div className="space-y-4 min-h-[140px] flex flex-col justify-center">
              {activeTab === 'url' && (
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Target Website URL</label>
                  <input
                    type="text"
                    name="url"
                    value={inputs.url}
                    onChange={handleInputChange}
                    placeholder="e.g. https://lotto-rewards-claim.cfd or https://sbi-verify-kyc.top"
                    className={inputStyle}
                  />
                  <p className="text-[10px] text-slate-500 font-sans">
                    Checks domain age, WHOIS registrar reputation, SSL encryption, and typosquatting scam patterns.
                  </p>
                </div>
              )}

              {activeTab === 'upi' && (
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">UPI Payment Address (VPA)</label>
                  <input
                    type="text"
                    name="upi"
                    value={inputs.upi}
                    onChange={handleInputChange}
                    placeholder="e.g. merchant-scam-24@ybl or payout.refund@icici"
                    className={inputStyle}
                  />
                  <p className="text-[10px] text-slate-500 font-sans">
                    Cross-references merchant handles against national financial intelligence fraud database.
                  </p>
                </div>
              )}

              {activeTab === 'phone' && (
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Phone / WhatsApp Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={inputs.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. +91 90876 54321"
                    className={inputStyle}
                  />
                  <p className="text-[10px] text-slate-500 font-sans">
                    Scans vishing call complaint registries and WhatsApp emergency suspension bait texts.
                  </p>
                </div>
              )}

              {activeTab === 'message' && (
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Message Body / Lure Text</label>
                  <textarea
                    name="messageText"
                    rows={4}
                    value={inputs.messageText}
                    onChange={handleInputChange}
                    placeholder="e.g. Dear Customer, your electricity connection will be suspended today. Pay immediately to avoid disconnection..."
                    className={`${inputStyle} resize-none`}
                  />
                  <p className="text-[10px] text-slate-500 font-sans">
                    Uses AI Natural Language Processing to detect coercive urgency, lottery claims, or fake KYC lures.
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 p-3 rounded-xl flex items-start space-x-2 text-xs text-[#EF4444] font-mono">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit & reset */}
            <div className="flex space-x-3 pt-3 border-t border-[#1E293B]">
              <button
                onClick={executeAnalysis}
                disabled={isLoading || isScanning}
                className="flex-1 bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-slate-900 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer shadow-md"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Signals...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-slate-900" />
                    <span>Run Multi-Modal Scam Scan</span>
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  clearInputs();
                  setShowResults(false);
                  setIsScanning(false);
                  setScanStep(0);
                }}
                className="bg-[#050811] hover:bg-[#1E293B]/80 border border-[#1E293B] text-slate-300 px-5 py-2.5 rounded-xl text-xs font-mono font-medium flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </AppCard>

          {/* Progressive Scanning Steps Panel */}
          {isScanning && (
            <AppCard className="p-4 space-y-3 font-mono text-[10px] border border-[#00E5FF]/30 bg-[#050811]">
              <span className="text-[#00E5FF] uppercase tracking-widest block border-b border-[#1E293B] pb-1.5 mb-2 font-bold flex items-center space-x-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#00E5FF]" />
                <span>AI THREAT ANALYSIS IN PROGRESS</span>
              </span>
              <div className="space-y-3">
                {[
                  { id: 1, label: 'EVIDENCE DISCOVERY', text: 'Inspecting WHOIS paths, domain age & certificate authenticity.' },
                  { id: 2, label: 'SIGNAL CORRELATION', text: 'Scanning NLP lures, financial registries & complaint databases.' },
                  { id: 3, label: 'CONFIDENCE CALIBRATION', text: 'Combining multi-modal risk models with isotonic calibration.' },
                  { id: 4, label: 'SHAP EXPLAINABILITY', text: 'Extracting feature weights and human-readable risk indicators.' },
                  { id: 5, label: 'FINAL REPORT GENERATED', text: 'Synthesizing threat breakdown and defence recommendations.' }
                ].map((step) => {
                  const isActive = scanStep === step.id;
                  const isCompleted = scanStep > step.id;
                  return (
                    <div 
                      key={step.id} 
                      className={`flex items-start space-x-2.5 transition-colors ${
                        isActive ? 'text-[#00E5FF] font-bold' : isCompleted ? 'text-slate-500' : 'text-slate-600'
                      }`}
                    >
                      <div className="mt-1 flex-shrink-0">
                        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#00E5FF] animate-ping' : isCompleted ? 'bg-slate-500' : 'bg-slate-700'}`} />
                      </div>
                      <div>
                        <span className="font-bold uppercase tracking-wider text-[9px] block mb-0.5">{step.label}</span>
                        <span className="text-[9px] leading-relaxed">{step.text}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </AppCard>
          )}
        </div>

        {/* Right Side Scoring and SHAP Results */}
        <div className="lg:col-span-5 space-y-4">
          <AnimatePresence mode="wait">
            {showResults && currentResult ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Threat Dial Gauge Card */}
                <AppCard className="p-5 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-semibold">
                    CALIBRATED RISK PROBABILITY
                  </span>

                  {/* Circular Risk Progress Dial */}
                  <div className="relative w-40 h-40 flex items-center justify-center my-2">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        className="stroke-[#1E293B]"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        className={`transition-all duration-1000 ${
                          isHighRisk ? 'stroke-[#EF4444]' : 'stroke-[#22C55E]'
                        }`}
                        strokeWidth="8"
                        strokeDasharray={251.2}
                        strokeDashoffset={251.2 - (251.2 * animatedRisk) / 100}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className={`text-3xl font-bold font-mono ${isHighRisk ? 'text-[#EF4444]' : 'text-[#22C55E]'}`}>
                        {animatedRisk.toFixed(1)}%
                      </span>
                      <span className="text-[9px] font-mono text-slate-500 uppercase mt-0.5 font-bold">
                        {isHighRisk ? 'HIGH RISK' : 'LOW RISK'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#050811] p-3 rounded-xl border border-[#1E293B]/60 text-[10px] text-slate-300 w-full leading-normal text-left font-sans">
                    <p className="font-semibold text-slate-200 mb-1">
                      Category: <span className="text-[#00E5FF] font-mono">{currentResult.scam_category}</span>
                    </p>
                    <p className="text-slate-400 text-[10px]">
                      {currentResult.explainability?.human_readable_explanation || 'Evaluation completed across threat detection models.'}
                    </p>
                  </div>
                </AppCard>

                {/* SHAP Attributions Breakdown */}
                <AppCard className="p-4 space-y-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block border-b border-[#1E293B] pb-2 font-semibold">
                    SHAP FEATURE RISK ATTRIBUTIONS
                  </span>

                  <div className="space-y-2.5 font-mono text-[10px]">
                    {Object.entries(currentResult.explainability?.shap_values || {}).map(([key, val]) => (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between text-slate-300">
                          <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                          <span className="font-bold text-[#00E5FF]">{((val as number) * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-[#050811] h-1.5 rounded-full overflow-hidden border border-[#1E293B]">
                          <div 
                            className="bg-[#00E5FF] h-full rounded-full transition-all duration-700" 
                            style={{ width: `${Math.min(100, (val as number) * 100)}%` }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </AppCard>

                {/* Evidence Trace Hops */}
                {currentResult.explainability?.evidence_trace?.length > 0 && (
                  <AppCard className="p-4 space-y-2 font-mono text-[9px]">
                    <span className="text-slate-400 uppercase tracking-wider block border-b border-[#1E293B] pb-2 font-semibold">
                      EVIDENCE GRAPH TRACE HOPS
                    </span>
                    <div className="space-y-1.5 pt-1">
                      {currentResult.explainability.evidence_trace.map((hop: string, idx: number) => (
                        <div key={idx} className="bg-[#050811] p-2 rounded-lg border border-[#1E293B] text-slate-300 font-mono">
                          {hop}
                        </div>
                      ))}
                    </div>
                  </AppCard>
                )}
              </motion.div>
            ) : (
              <AppCard className="p-6 flex flex-col items-center justify-center text-center space-y-3 min-h-[420px] text-slate-500">
                <ShieldCheck className="w-12 h-12 text-slate-600 opacity-40" />
                <h4 className="text-xs font-mono font-bold text-slate-300 uppercase">
                  Awaiting Threat Ingestion
                </h4>
                <p className="text-[10px] text-slate-400 max-w-xs leading-relaxed font-sans">
                  Enter a URL domain, UPI handle, phone number, or message lure on the left panel and click "Run Multi-Modal Scam Scan".
                </p>
              </AppCard>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ThreatAnalysisPage;
