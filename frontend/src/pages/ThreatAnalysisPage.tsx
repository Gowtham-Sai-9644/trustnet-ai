import React, { useState } from 'react';
import { useAppStore } from '../stores/appStore';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  Play, 
  RefreshCw, 
  ShieldCheck, 
  ShieldAlert, 
  AlertCircle, 
  Info,
  ArrowRight,
  Fingerprint,
  RotateCcw
} from 'lucide-react';
import { AppCard } from '../components/ui/AppCard';
import { AppPageHeader } from '../components/ui/AppPageHeader';
import { AppBadge } from '../components/ui/AppBadge';

const ThreatAnalysisPage: React.FC = () => {
  const { inputs, setInputs, currentResult, isLoading, error, runFusionAnalysis, clearInputs } = useAppStore();
  const [activeTab, setActiveTab] = useState<'url' | 'upi' | 'phone' | 'message'>('url');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputs({ [name]: value });
  };

  // Convert SHAP map to Recharts format
  const getShapData = () => {
    if (!currentResult || !currentResult.explainability.shap_values) return [];
    return Object.entries(currentResult.explainability.shap_values).map(([name, val]) => ({
      name: name.replace(/_/g, ' ').toUpperCase(),
      weight: val * 100
    }));
  };

  const score = currentResult?.calibration?.calibrated_probability ?? 0;
  const isHighRisk = score > 0.5;

  const inputStyle = "w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4]/30 transition-all";

  return (
    <div className="space-y-4">
      <AppPageHeader 
        title="Threat Analysis" 
        description="Submit indicators for multi-modal risk fusion scoring with SHAP explainability."
        rightElement={
          currentResult && (
            <AppBadge color={isHighRisk ? 'danger' : 'success'}>
              {isHighRisk ? 'THREAT DETECTED' : 'CLEAR'}
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
                <Fingerprint className="w-4 h-4 text-[#06B6D4]" />
                <span>Indicator Ingestion</span>
              </span>
              <span className="text-[10px] font-mono text-slate-600 uppercase">Input</span>
            </div>

            {/* Tabs Selector */}
            <div className="flex space-x-1 bg-[#0F172A] p-1 rounded-xl border border-[#1E293B] font-sans text-xs">
              {[
                { id: 'url', label: 'Domain URL' },
                { id: 'upi', label: 'UPI Address' },
                { id: 'phone', label: 'Phone' },
                { id: 'message', label: 'Message Body' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
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
                    placeholder="Dear Customer, your electricity connection will be suspended today at 21:30. Please call +919876543210 immediately..."
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
                onClick={runFusionAnalysis}
                disabled={isLoading}
                className="flex-1 bg-[#06B6D4] hover:bg-[#06B6D4]/90 text-slate-900 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all active:scale-[0.99] disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-slate-900" />
                    <span>Run Multi-Modal Risk Fusion</span>
                  </>
                )}
              </button>
              <button
                onClick={clearInputs}
                className="bg-[#1E293B] hover:bg-[#1E293B]/80 text-slate-300 px-5 py-2.5 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </AppCard>
        </div>

        {/* Right Side Scoring and SHAP Results */}
        <div className="lg:col-span-5 space-y-4">
          {currentResult ? (
            <div className="space-y-4">
              {/* Risk Dial Card */}
              <AppCard className="p-5 flex flex-col items-center">
                {currentResult.graph_available === false && (
                  <div className="w-full bg-[#F59E0B]/5 border border-[#F59E0B]/20 p-3.5 rounded-xl flex items-start space-x-2 text-xs text-[#F59E0B] font-sans mb-4 text-left">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-200">Graph Intelligence Offline</p>
                      <p className="text-[10px] text-slate-400 leading-normal">
                        Risk analysis completed using URL, NLP, Fusion, and Calibration models. Graph network enrichment is temporarily unavailable.
                      </p>
                    </div>
                  </div>
                )}
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-4">Risk Calibration</span>
                
                {/* SVG Risk gauge */}
                <div className="relative flex items-center justify-center w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="54" strokeWidth="5" stroke="#1E293B" fill="transparent" />
                    <circle 
                      cx="64" 
                      cy="64" 
                      r="54" 
                      strokeWidth="6" 
                      stroke={isHighRisk ? '#EF4444' : score > 0.2 ? '#F59E0B' : '#22C55E'}
                      strokeDasharray={2 * Math.PI * 54}
                      strokeDashoffset={2 * Math.PI * 54 * (1 - score)}
                      strokeLinecap="round" 
                      fill="transparent"
                      className="transition-all duration-700"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-mono font-bold text-slate-100">
                      {(score * 100).toFixed(1)}%
                    </span>
                    <span className="text-[8px] font-mono tracking-widest text-slate-500 uppercase mt-0.5 font-bold">
                      RISK INDEX
                    </span>
                  </div>
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
                <div className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl p-3 mt-4 text-[10px] font-mono text-slate-400 space-y-2">
                  <div className="flex justify-between border-b border-[#1E293B] pb-1.5">
                    <span>Confidence:</span>
                    <span className="text-slate-200 font-bold">±{(currentResult.calibration.confidence_score * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between border-b border-[#1E293B] pb-1.5">
                    <span>Category:</span>
                    <span className="text-slate-200 font-bold uppercase">{currentResult.scam_category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Method:</span>
                    <span className="text-slate-200 font-bold uppercase">{currentResult.calibration.method}</span>
                  </div>
                </div>
              </AppCard>

              {/* Attributions and SHAP panel */}
              <AppCard className="p-5 space-y-4">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block border-b border-[#1E293B] pb-2">
                  Evidence Attributions (SHAP)
                </span>
                
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {currentResult.explainability.human_readable_explanation}
                </p>

                <div className="h-44 w-full text-[9px] font-mono pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getShapData()} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                      <XAxis type="number" stroke="#94A3B8" tick={{ fontSize: 8 }} />
                      <YAxis dataKey="name" type="category" stroke="#94A3B8" tick={{ fontSize: 8 }} width={90} />
                      <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: 12, fontSize: 10 }} />
                      <Bar dataKey="weight" fill="#06B6D4" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Evidence trace path */}
                {currentResult.explainability.evidence_trace.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-[#1E293B]">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Graph Connection Trace</span>
                    <div className="space-y-1.5">
                      {currentResult.explainability.evidence_trace.map((hop, index) => (
                        <div key={index} className="flex items-center space-x-1.5 bg-[#0F172A] p-2.5 rounded-xl border border-[#1E293B] text-[10px] font-mono text-slate-400">
                          <ArrowRight className="w-3.5 h-3.5 text-[#06B6D4] flex-shrink-0" />
                          <span className="truncate">{hop}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </AppCard>

              {/* Investigation Timeline */}
              <AppCard className="p-5 space-y-4 text-left">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block border-b border-[#1E293B] pb-2">
                  Investigation Timeline
                </span>
                <div className="relative border-l border-[#1E293B] ml-2.5 pl-6 space-y-4">
                  {[
                    { time: '09:31', event: 'Indicator Submitted', desc: 'Indicator received from API ingestion gateway.' },
                    { time: '09:32', event: 'NLP Detection Triggered', desc: 'Message text evaluated via IndicBERT embeddings classifier.' },
                    { time: '09:33', event: 'Graph Relationships Found', desc: 'Neo4j neighbor nodes PageRank centralities queried.' },
                    { time: '09:34', event: 'Risk Escalated', desc: 'Calibrated Meta-Fusion probability exceeded threat threshold.' },
                    { time: '09:35', event: 'Investigation Opened', desc: 'Auto-allocated to pending case queue under TXN-94721.' }
                  ].map((t, idx) => (
                    <div key={idx} className="relative text-xs">
                      {/* Timeline dot */}
                      <span className="absolute -left-[29px] top-1 w-2 h-2 rounded-full bg-[#06B6D4] ring-4 ring-[#070B14]" />
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="font-bold text-slate-200">{t.event}</span>
                        <span className="text-slate-500">{t.time}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 leading-normal font-sans">{t.desc}</p>
                    </div>
                  ))}
                </div>
              </AppCard>
            </div>
          ) : (
            <AppCard className="p-8 flex flex-col items-center justify-center text-center h-[320px] space-y-4">
              <div className="bg-[#06B6D4]/5 p-4 rounded-2xl border border-[#06B6D4]/10">
                <Info className="w-8 h-8 text-slate-600" />
              </div>
              <div className="space-y-2 max-w-xs">
                <h4 className="text-sm font-bold text-slate-300">Submit an indicator to begin investigation</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Input URLs, UPI handles, phone numbers, or SMS messages on the left panel to run multi-modal risk fusion analysis.
                </p>
              </div>
            </AppCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThreatAnalysisPage;
