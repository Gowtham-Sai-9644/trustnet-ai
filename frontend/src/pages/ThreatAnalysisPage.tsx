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

  const inputStyle = "w-full bg-app-bg border border-app-border rounded-xl px-3.5 py-2.5 text-xs text-app-text placeholder-slate-500 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30 transition-all font-sans";

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
          <AppCard className="p-5 space-y-5 border-l-4 border-l-[#3B82F6]">
            <div className="border-b border-app-border pb-3 flex justify-between items-center">
              <span className="font-sans font-bold text-xs text-app-text uppercase tracking-wider flex items-center space-x-2">
                <Fingerprint className="w-4 h-4 text-[#3B82F6]" />
                <span>Select Target Indicator</span>
              </span>
              <span className="text-[10px] font-mono text-app-muted uppercase font-semibold">1-Click Verification</span>
            </div>

            {/* Tabs Selector */}
            <div className="flex space-x-1 bg-app-bg p-1 rounded-xl border border-app-border text-xs font-mono font-bold">
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
                      ? 'bg-[#3B82F6] text-app-btn-text shadow'
                      : 'text-app-muted hover:text-app-text'
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
                  <label className="block text-[10px] font-mono text-app-muted uppercase tracking-wider font-semibold">Target Website URL</label>
                  <input
                    type="text"
                    name="url"
                    value={inputs.url}
                    onChange={handleInputChange}
                    placeholder="e.g. https://lotto-rewards-claim.cfd or https://sbi-verify-kyc.top"
                    className={inputStyle}
                  />
                  <p className="text-[10px] text-app-muted font-sans">
                    Checks domain age, WHOIS registrar reputation, SSL encryption, and typosquatting scam patterns.
                  </p>
                </div>
              )}

              {activeTab === 'upi' && (
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono text-app-muted uppercase tracking-wider font-semibold">UPI Payment Address (VPA)</label>
                  <input
                    type="text"
                    name="upi"
                    value={inputs.upi}
                    onChange={handleInputChange}
                    placeholder="e.g. merchant-scam-24@ybl or payout.refund@icici"
                    className={inputStyle}
                  />
                  <p className="text-[10px] text-app-muted font-sans">
                    Cross-references merchant handles against national financial intelligence fraud database.
                  </p>
                </div>
              )}

              {activeTab === 'phone' && (
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono text-app-muted uppercase tracking-wider font-semibold">Phone / WhatsApp Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={inputs.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. +91 90876 54321"
                    className={inputStyle}
                  />
                  <p className="text-[10px] text-app-muted font-sans">
                    Scans vishing call complaint registries and WhatsApp emergency suspension bait texts.
                  </p>
                </div>
              )}

              {activeTab === 'message' && (
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono text-app-muted uppercase tracking-wider font-semibold">Message Body / Lure Text</label>
                  <textarea
                    name="messageText"
                    rows={4}
                    value={inputs.messageText}
                    onChange={handleInputChange}
                    placeholder="e.g. Dear Customer, your electricity connection will be suspended today. Pay immediately to avoid disconnection..."
                    className={`${inputStyle} resize-none`}
                  />
                  <p className="text-[10px] text-app-muted font-sans">
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
            <div className="flex space-x-3 pt-3 border-t border-app-border">
              <button
                onClick={executeAnalysis}
                disabled={isLoading || isScanning}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] py-2.5 rounded-xl text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer border border-blue-400/30"
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
                className="bg-app-bg hover:bg-[#1E293B]/80 border border-app-border text-app-text px-5 py-2.5 rounded-xl text-xs font-mono font-medium flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </AppCard>

          {/* Progressive Scanning Steps Panel */}
          {isScanning && (
            <AppCard className="p-4 space-y-3 font-mono text-[10px] border border-[#3B82F6]/30 bg-app-bg">
              <span className="text-[#3B82F6] uppercase tracking-widest block border-b border-app-border pb-1.5 mb-2 font-bold flex items-center space-x-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#3B82F6]" />
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
                        isActive ? 'text-[#3B82F6] font-bold' : isCompleted ? 'text-app-muted' : 'text-slate-600'
                      }`}
                    >
                      <div className="mt-1 flex-shrink-0">
                        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#3B82F6] animate-ping' : isCompleted ? 'bg-slate-500' : 'bg-slate-700'}`} />
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
                  <span className="text-[10px] font-mono text-app-muted uppercase tracking-wider block font-semibold">
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
                      <span className="text-[9px] font-mono text-app-muted uppercase mt-0.5 font-bold">
                        {isHighRisk ? 'HIGH RISK' : 'LOW RISK'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-app-bg p-3 rounded-xl border border-app-border/60 text-[10px] text-app-text w-full leading-normal text-left font-sans">
                    <p className="font-semibold text-app-text mb-1">
                      Category: <span className="text-[#3B82F6] font-mono">{currentResult.scam_category}</span>
                    </p>
                    <p className="text-app-muted text-[10px]">
                      {currentResult.llm_explanation || 'Evaluation completed across threat detection models.'}
                    </p>
                  </div>
                </AppCard>

                {/* SHAP Attributions Breakdown */}
                <AppCard className="p-4 space-y-3">
                  <span className="text-[10px] font-mono text-app-muted uppercase tracking-wider block border-b border-app-border pb-2 font-semibold">
                    SHAP FEATURE RISK ATTRIBUTIONS
                  </span>

                  <div className="space-y-2.5 font-mono text-[10px]">
                    {Object.entries(currentResult.detection_evidence?.shap_values || {}).map(([key, val]) => (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between text-app-text">
                          <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                          <span className="font-bold text-[#3B82F6]">{((val as number) * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-app-bg h-1.5 rounded-full overflow-hidden border border-app-border">
                          <div 
                            className="bg-[#3B82F6] h-full rounded-full transition-all duration-700" 
                            style={{ width: `${Math.min(100, (val as number) * 100)}%` }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </AppCard>

                {/* Evidence Trace Hops */}
                {currentResult.detection_evidence?.evidence_trace?.length > 0 && (
                  <AppCard className="p-4 space-y-2 font-mono text-[9px]">
                    <span className="text-app-muted uppercase tracking-wider block border-b border-app-border pb-2 font-semibold">
                      EVIDENCE GRAPH TRACE HOPS
                    </span>
                    <div className="space-y-1.5 pt-1">
                      {currentResult.detection_evidence.evidence_trace.map((hop: string, idx: number) => (
                        <div key={idx} className="bg-app-bg p-2 rounded-lg border border-app-border text-app-text font-mono">
                          {hop}
                        </div>
                      ))}
                    </div>
                  </AppCard>
                )}
              </motion.div>
            ) : (
                              <AppCard className="relative p-6 flex flex-col items-center justify-center text-center space-y-4 min-h-[420px] text-app-muted overflow-hidden bg-gradient-to-b from-[#071225] to-[#050B18]">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_30%,transparent_100%)] opacity-30 pointer-events-none" />
                  
                  <div className="relative flex items-center justify-center w-20 h-20 mb-2">
                    <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-[ping_3s_ease-in-out_infinite]" />
                    <div className="absolute inset-2 rounded-full border border-blue-500/40 animate-[ping_2s_ease-in-out_infinite_0.5s]" />
                    <div className="w-14 h-14 bg-[#091A33] rounded-full border border-blue-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.2)] z-10">
                      <ShieldCheck className="w-6 h-6 text-blue-400 opacity-90" />
                    </div>
                  </div>
                  
                  <h4 className="text-xs font-mono font-bold text-blue-100 uppercase tracking-widest z-10 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]">
                    Awaiting Threat Ingestion
                  </h4>
                  <p className="text-[10px] text-blue-200/50 max-w-xs leading-relaxed font-sans z-10">
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



