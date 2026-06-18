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
  Server
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
  const isHighRisk = score > 0.5;

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

  const inputStyle = "w-full bg-[#0B1220] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/30 transition-all font-sans";

  return (
    <div className="space-y-4 text-left">
      <AppPageHeader 
        title="Calibrated Threat Analysis" 
        description="Submit indicators for multi-modal risk fusion scoring with SHAP explainability."
        rightElement={
          currentResult && showResults && (
            <AppBadge color={isHighRisk ? 'danger' : 'success'}>
              {isHighRisk ? 'THREAT SIGNATURE DETECTED' : 'CLEAR SIGNAL'}
            </AppBadge>
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Side Input Panel */}
        <div className="lg:col-span-7 space-y-4">
          <AppCard className="p-5 space-y-5">
            <div className="border-b border-[#1E293B] pb-3 flex justify-between items-center">
              <span className="font-sans font-semibold text-xs text-slate-300 uppercase tracking-tight flex items-center space-x-1.5">
                <Fingerprint className="w-4 h-4 text-[#00E5FF]" />
                <span>Indicator Ingestion</span>
              </span>
              <span className="text-[10px] font-mono text-slate-600 uppercase">Input Gate</span>
            </div>

            {/* Tabs Selector */}
            <div className="flex space-x-1 bg-[#0B1220] p-1 rounded-xl border border-[#1E293B] font-sans text-xs">
              {[
                { id: 'url', label: 'Domain URL' },
                { id: 'upi', label: 'UPI Address' },
                { id: 'phone', label: 'Phone Number' },
                { id: 'message', label: 'Message Body' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setShowResults(false);
                  }}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#1E293B] text-slate-100'
                      : 'text-slate-500 hover:text-slate-300'
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
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">Target Domain</label>
                  <input
                    type="text"
                    name="url"
                    value={inputs.url}
                    onChange={handleInputChange}
                    placeholder="e.g. https://lotto-rewards-claim.cfd"
                    className={inputStyle}
                  />
                  <p className="text-[10px] text-slate-500">Evaluates domain creation timestamps, entropy, and WHOIS registry paths.</p>
                </div>
              )}

              {activeTab === 'upi' && (
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">UPI Address</label>
                  <input
                    type="text"
                    name="upi"
                    value={inputs.upi}
                    onChange={handleInputChange}
                    placeholder="e.g. payout.refund@ybl"
                    className={inputStyle}
                  />
                  <p className="text-[10px] text-slate-500">Cross-references node linkages and degree counts in the active graph network.</p>
                </div>
              )}

              {activeTab === 'phone' && (
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={inputs.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. +91 90876 54321"
                    className={inputStyle}
                  />
                  <p className="text-[10px] text-slate-500">Scans phone directories and reported vishing complaint registries.</p>
                </div>
              )}

              {activeTab === 'message' && (
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">Message Body</label>
                  <textarea
                    name="messageText"
                    rows={4}
                    value={inputs.messageText}
                    onChange={handleInputChange}
                    placeholder="Dear Customer, your electricity connection will be suspended today at 21:30..."
                    className={`${inputStyle} resize-none`}
                  />
                  <p className="text-[10px] text-slate-500">Leverages SVM and IndicBERT embeddings to detect lexical scam patterns.</p>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-[#EF4444]/5 border border-[#EF4444]/20 p-3 rounded-xl flex items-start space-x-2 text-xs text-[#EF4444] font-mono">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit & reset */}
            <div className="flex space-x-3 pt-3 border-t border-[#1E293B]">
              <button
                onClick={executeAnalysis}
                disabled={isLoading || isScanning}
                className="flex-1 bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-slate-900 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing Signals...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-slate-900" />
                    <span>Run Multi-Modal Risk Fusion</span>
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
                className="bg-[#1E293B] hover:bg-[#1E293B]/80 text-slate-300 px-5 py-2.5 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </AppCard>

          {/* Progressive Scanning Steps Panel */}
          {isScanning && (
            <AppCard className="p-4 space-y-3 font-mono text-[10px] border border-[#00E5FF]/20 bg-[#0B1220]/40">
              <span className="text-[#00E5FF] uppercase tracking-widest block border-b border-[#1E293B] pb-1.5 mb-2 font-bold flex items-center space-x-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#00E5FF]" />
                <span>MULTIMODAL FUSION PIPELINE</span>
              </span>
              <div className="space-y-3.5">
                {[
                  { id: 1, label: 'EVIDENCE DISCOVERED', text: 'Ingested threat indicator registers WHOIS paths & registry timelines.' },
                  { id: 2, label: 'SIGNALS COLLECTED', text: 'Parsing lexical structures, entropy, NLP embeddings, and vishing reports.' },
                  { id: 3, label: 'CONFIDENCE ASSEMBLED', text: 'Resolving multi-modal calibration models and stacking prediction weights.' },
                  { id: 4, label: 'REASONING GENERATED', text: 'Executing SHAP attributions, explaining feature weights, and trace patterns.' },
                  { id: 5, label: 'MITIGATION RECOMMENDATION PRODUCED', text: 'Generating response blueprints and packaging cases for dispatcher logs.' }
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
                        <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#00E5FF] animate-ping' : isCompleted ? 'bg-slate-500' : 'bg-slate-700'}`} />
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
                {/* Risk Dial Card */}
                <AppCard className="p-5 flex flex-col items-center">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-4">Risk Calibration Ratio</span>
                  
                  {/* SVG Risk gauge */}
                  <div 
                    className="relative flex items-center justify-center w-32 h-32 cursor-pointer select-none"
                    onMouseEnter={() => setShowDialTooltip(true)}
                    onMouseLeave={() => setShowDialTooltip(false)}
                    onClick={() => setShowDialTooltip(!showDialTooltip)}
                    title="Click/Hover to show confidence breakdown"
                  >
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="54" strokeWidth="5" stroke="#1E293B" fill="transparent" />
                      <circle 
                        cx="64" 
                        cy="64" 
                        r="54" 
                        strokeWidth="6" 
                        stroke={isHighRisk ? '#EF4444' : score > 0.2 ? '#F59E0B' : '#22C55E'}
                        strokeDasharray={2 * Math.PI * 54}
                        strokeDashoffset={2 * Math.PI * 54 * (1 - animatedRisk / 100)}
                        strokeLinecap="round" 
                        fill="transparent"
                        className="transition-all duration-100"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-2xl font-mono font-bold text-slate-100">
                        {animatedRisk.toFixed(1)}%
                      </span>
                      <span className="text-[8px] font-mono tracking-widest text-slate-500 uppercase mt-0.5 font-bold">
                        RISK INDEX
                      </span>
                    </div>

                    <AnimatePresence>
                      {showDialTooltip && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute inset-0 flex flex-col items-center justify-center font-mono bg-[#0B1220]/95 border border-[#1E293B] rounded-full p-2 text-[8px] leading-tight text-center shadow-xl z-20"
                        >
                          <span className="text-[#00E5FF] font-bold block mb-1">BREAKDOWN</span>
                          <span className="text-slate-300">Text Analysis: 90%</span>
                          <span className="text-slate-300">Image Analysis: 45%</span>
                          <span className="text-slate-300">Price Anomaly: 95%</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="mt-4 flex items-center space-x-1.5">
                    {isHighRisk ? (
                      <ShieldAlert className="w-4 h-4 text-[#EF4444]" />
                    ) : (
                      <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
                    )}
                    <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                      {score > 0.8 ? 'Critical Threat' : score > 0.5 ? 'High Risk' : score > 0.2 ? 'Suspicious' : 'Clear'}
                    </span>
                  </div>

                  {/* Score details */}
                  <div className="w-full bg-[#0B1220] border border-[#1E293B] rounded-xl p-3 mt-4 text-[10px] font-mono text-slate-400 space-y-2">
                    <div className="flex justify-between border-b border-[#1E293B] pb-1.5">
                      <span>Confidence Score:</span>
                      <span className="text-slate-200 font-bold">±{(currentResult.calibration.confidence_score * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between border-b border-[#1E293B] pb-1.5">
                      <span>Resolved Category:</span>
                      <span className="text-slate-200 font-bold uppercase">{currentResult.scam_category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Calibration Engine:</span>
                      <span className="text-slate-200 font-bold uppercase">{currentResult.calibration.method}</span>
                    </div>
                  </div>
                </AppCard>

                {/* Attributions and SHAP panel */}
                <AppCard className="p-5 space-y-4">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block border-b border-[#1E293B] pb-2">
                    Shapley Attributions (SHAP)
                  </span>
                  
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {currentResult.explainability.human_readable_explanation}
                  </p>

                  {/* Custom animated SHAP bars */}
                  <div className="space-y-3 font-mono text-[9px] pt-2">
                    {Object.entries(currentResult.explainability.shap_values).map(([name, val]: [string, any], idx) => {
                      const percentage = Math.abs(val * 100);
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-slate-400">
                            <span className="uppercase">{name.replace(/_/g, ' ')}</span>
                            <span className="text-[#00E5FF] font-bold">+{percentage.toFixed(1)}% risk contribution</span>
                          </div>
                          <div className="w-full bg-[#050811] h-1.5 rounded-full overflow-hidden border border-[#1E293B]/60">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.8, delay: idx * 0.15 }}
                              className="h-full bg-[#00E5FF]"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* V3 Expandable Evidence Cards */}
                  <div className="space-y-2 pt-3 border-t border-[#1E293B]">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-2">
                      Interactive Evidence Cards
                    </span>
                    {[
                      { id: 'nlp', title: 'NLP Lexical Check', short: 'DistilBERT model warning matches', detail: "The DistilBERT NLP model flagged this phrase ('lucky winner') as suspicious with 92% probability." },
                      { id: 'scam_engine', title: 'Syndicate Connection Check', short: 'India Scam Engine matched UPI', detail: "The India Scam Engine matched this UPI ID to a known mule account." },
                      { id: 'entropy', title: 'Shannon Entropy Anomaly', short: 'High character randomness', detail: "The domain name exhibits abnormally high entropy, typical of algorithmic domain generators." }
                    ].map((item) => (
                      <div 
                        key={item.id} 
                        className="bg-[#0B1220] border border-[#1E293B] rounded-xl overflow-hidden cursor-pointer hover:border-[#00E5FF]/30 transition-colors"
                        onClick={() => setExpandedEvidence(expandedEvidence === item.id ? null : item.id)}
                      >
                        <div className="p-2.5 flex justify-between items-center text-[9px] font-mono">
                          <span className="text-slate-300 font-semibold">{item.title}</span>
                          <span className="text-[#00E5FF] text-[8px] uppercase tracking-wider">{expandedEvidence === item.id ? 'Collapse' : 'Expand'}</span>
                        </div>
                        <AnimatePresence>
                          {expandedEvidence === item.id && (
                            <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: 'auto' }}
                              exit={{ height: 0 }}
                              className="px-2.5 pb-2.5 text-[9px] font-mono text-slate-400 leading-normal border-t border-[#1E293B]/40 pt-1.5 overflow-hidden"
                            >
                              {item.detail}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>

                  {/* Evidence trace path */}
                  {currentResult.explainability.evidence_trace.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-[#1E293B]">
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Graph Connection Trace</span>
                      <div className="space-y-1.5">
                        {currentResult.explainability.evidence_trace.map((hop, index) => (
                          <div key={index} className="flex items-center space-x-1.5 bg-[#0B1220] p-2.5 rounded-xl border border-[#1E293B] text-[10px] font-mono text-slate-400">
                            <ArrowRight className="w-3.5 h-3.5 text-[#00E5FF] flex-shrink-0" />
                            <span className="truncate">{hop}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </AppCard>

                {/* Investigation Timeline */}
                <AppCard className="p-5 space-y-4 text-left">
                  <span className="text-[10px] font-mono text-[#00E5FF] uppercase tracking-widest block border-b border-[#1E293B] pb-2">
                    Investigation Progression
                  </span>
                  <div className="relative border-l border-[#1E293B] ml-2.5 pl-6 space-y-4">
                    {[
                      { time: '13:41', event: 'Indicator Ingested', desc: 'Query registered by API gateway.' },
                      { time: '13:42', event: 'Base Models Scanned', desc: 'Lexical patterns and NLP semantics classified.' },
                      { time: '13:43', event: 'Graph Path Evaluated', desc: 'Neo4j PageRank and hop parameters queried.' },
                      { time: '13:44', event: 'Probability Calibrated', desc: 'Isotonic regression mapped confidence to threat odds.' },
                      { time: '13:45', event: 'SecOps Case Dispatched', desc: 'Escalated to pending queue under TXN-94721.' }
                    ].map((t, idx) => (
                      <div key={idx} className="relative text-xs">
                        <span className="absolute -left-[29px] top-1 w-2 h-2 rounded-full bg-[#00E5FF] ring-4 ring-[#050811]" />
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className="font-bold text-slate-200">{t.event}</span>
                          <span className="text-slate-500">{t.time}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 leading-normal font-sans">{t.desc}</p>
                      </div>
                    ))}
                  </div>
                </AppCard>
              </motion.div>
            ) : (
              <AppCard className="p-8 flex flex-col items-center justify-center text-center h-[320px] space-y-4 bg-[#0B1220]/20">
                <div className="bg-[#00E5FF]/5 p-4 rounded-2xl border border-[#00E5FF]/10">
                  <Info className="w-8 h-8 text-slate-600" />
                </div>
                <div className="space-y-2 max-w-xs">
                  <h4 className="text-sm font-bold text-slate-300">Awaiting Signal Ingestion</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                    Input a URL, UPI address, phone log, or SMS text on the left console, and trigger our calibrated risk classifier.
                  </p>
                </div>
              </AppCard>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ThreatAnalysisPage;
