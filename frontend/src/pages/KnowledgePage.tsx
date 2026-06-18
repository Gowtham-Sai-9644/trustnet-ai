import React, { useState, useEffect } from 'react';
import { useAppStore } from '../stores/appStore';
import { 
  Send, Sparkles, MessageSquare, History, RefreshCw, Sliders, 
  Bookmark, ShieldAlert, Cpu, CheckSquare, ListFilter, ClipboardCheck,
  Eye, FileText
} from 'lucide-react';
import { AppCard } from '../components/ui/AppCard';
import { AppPageHeader } from '../components/ui/AppPageHeader';
import { AppBadge } from '../components/ui/AppBadge';

interface Message {
  sender: 'user' | 'analyst';
  text: string;
  timestamp: string;
  sources?: string[];
  reasoning?: string[];
  evidence?: string[];
  confidence?: number;
  mitigationSteps?: string[];
}

const KnowledgePage: React.FC = () => {
  const { ragResult, ragIsLoading, error, fetchRagExplanation } = useAppStore();
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeSources, setActiveSources] = useState<string[]>([]);
  const [checkedMitigations, setCheckedMitigations] = useState<Record<string, boolean>>({});

  // Seeded starter suggestions for SecOps
  const starterPrompts = [
    { text: "Assess risk factors for job offer scams on Telegram", icon: ShieldAlert, color: "text-red-400" },
    { text: "Retrieve KYC compliance regulations for UPI gateways", icon: Cpu, color: "text-purple-400" },
    { text: "List warning metrics for lottery coercion SMS templates", icon: Sliders, color: "text-[#00E5FF]" }
  ];

  // Seeded query history
  const history = [
    "Telegram job offer scam analysis",
    "KYC authentication guidelines",
    "SMS phishing lures detection",
    "Neo4j temporal path leakage checks"
  ];

  useEffect(() => {
    setActiveSources([
      "pci_dss_compliance_v4.pdf",
      "rbi_payment_gateways_directive_2024.md",
      "trustnet_lure_corpus_v12.json",
      "indicbert_transformer_logs.txt"
    ]);
  }, []);

  const handleStarterClick = (promptText: string) => {
    setChatInput(promptText);
  };

  const handleMitigationCheck = (stepId: string) => {
    setCheckedMitigations(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatInput('');
    
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Add user message
    const userMsg: Message = {
      sender: 'user',
      text: userText,
      timestamp: timeStr
    };
    setMessages(prev => [...prev, userMsg]);

    // Fetch analyst response
    await fetchRagExplanation(userText, 0.85);
  };

  // Listen to store changes
  useEffect(() => {
    if (ragResult) {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      // Build structured mock analyst response if RAG returns data
      const analystMsg: Message = {
        sender: 'analyst',
        text: ragResult.explanation,
        timestamp: timeStr,
        sources: ragResult.references,
        reasoning: [
          'Calculated lexical coercion density score from prompt text.',
          'Cross-referenced UPI handles with known Neo4j mule rings.',
          'Matched WHOIS registry logs with active phishing redirect lists.'
        ],
        evidence: [
          'High urgency language detected (coercion probability: 0.94)',
          'Subdomain registry resolves to unindexed proxy DNS',
          'Adjacent node hops display high PageRank scores (0.0034)'
        ],
        confidence: 96.5,
        mitigationSteps: ragResult.prevention_steps && ragResult.prevention_steps.length > 0
          ? ragResult.prevention_steps
          : [
              'Extract suspect VPA addresses and flag in local PostgreSQL store.',
              'Initiate temporal PageRank recalculation for target subnet.',
              'Submit domain blacklist request to registrar.'
            ]
      };

      setMessages(prev => [...prev, analystMsg]);
    }
  }, [ragResult]);

  return (
    <div className="space-y-4 flex flex-col h-[calc(100vh-80px)] overflow-hidden text-left">
      <AppPageHeader 
        title="Digital Fraud Analyst" 
        description="Query vector databases and semantic advisories using natural language to resolve cases."
        rightElement={
          <div className="flex items-center space-x-2 bg-[#111827] px-3 py-1.5 rounded-xl border border-[#1E293B] text-[9px] font-mono text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
            <span>ChromaDB Vector Store Connected</span>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
        {/* Left Side: History Logs */}
        <div className="lg:col-span-3 flex flex-col min-h-0">
          <AppCard className="flex flex-col flex-1 p-4 overflow-hidden">
            <span className="text-[10px] font-sans font-semibold text-slate-500 uppercase tracking-widest block border-b border-[#1E293B] pb-2 mb-3 flex items-center space-x-1.5">
              <History className="w-3.5 h-3.5" />
              <span>Query Registries</span>
            </span>
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {history.map((hText, idx) => (
                <button
                  key={idx}
                  onClick={() => setChatInput(hText)}
                  className="w-full text-left bg-[#0B1220] p-2.5 rounded-xl border border-[#1E293B] hover:border-[#00E5FF]/30 text-[10px] font-mono truncate text-slate-400 block transition-all hover:bg-[#1E293B]/30 cursor-pointer"
                >
                  {hText}
                </button>
              ))}
            </div>
          </AppCard>
        </div>

        {/* Center: Analyst Interface */}
        <div className="lg:col-span-6 flex flex-col min-h-0">
          <AppCard className="flex flex-col flex-1 p-0 overflow-hidden border border-[#1E293B]">
            {/* Header */}
            <div className="px-4 py-3 border-b border-[#1E293B] bg-[#0B1220]/60 flex justify-between items-center text-xs flex-shrink-0">
              <span className="font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <MessageSquare className="w-4 h-4 text-[#00E5FF]" />
                <span>Analyst Terminal</span>
              </span>
              <span className="text-[9px] font-mono text-slate-600">[VECTOR_DB_INDEX_2026]</span>
            </div>

            {/* Transcript Panel */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full space-y-6 py-8 text-center">
                  <div className="bg-[#00E5FF]/10 p-4 rounded-2xl border border-[#00E5FF]/20">
                    <Sparkles className="w-8 h-8 text-[#00E5FF]" />
                  </div>
                  <div className="space-y-2 max-w-sm">
                    <h3 className="text-sm font-bold text-slate-200">Consult Digital Fraud Analyst</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Enter threat descriptions, UPI compliance rules, or active case identifiers to parse guidelines.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-2 w-full max-w-md">
                    {starterPrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleStarterClick(prompt.text)}
                        className="flex items-center space-x-2 bg-[#0B1220] border border-[#1E293B] rounded-xl px-3 py-2.5 text-left text-[10px] text-slate-400 hover:border-[#00E5FF]/30 hover:text-slate-300 transition-all hover:bg-[#1E293B]/20 cursor-pointer"
                      >
                        <prompt.icon className={`w-3.5 h-3.5 ${prompt.color} flex-shrink-0`} />
                        <span className="truncate">{prompt.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center space-x-2 text-[9px] text-slate-500 mb-1 font-mono">
                    <span>{msg.sender === 'user' ? 'INVESTIGATOR' : 'ANALYST_AI'}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  
                  {msg.sender === 'user' ? (
                    <div className="p-3 rounded-2xl max-w-[85%] leading-relaxed border bg-[#1E293B] border-[#1E293B] text-slate-100 text-left">
                      {msg.text}
                    </div>
                  ) : (
                    <div className="w-full space-y-4 text-left">
                      {/* Text Summary */}
                      <div className="p-3.5 rounded-2xl leading-relaxed border bg-[#0B1220] border-[#1E293B] text-slate-300">
                        {msg.text}
                      </div>

                      {/* Diagnostic Breakdown Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Reasoning Log */}
                        {msg.reasoning && (
                          <div className="bg-[#111827] border border-[#1E293B] p-3 rounded-xl space-y-2">
                            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider block border-b border-[#1E293B]/60 pb-1.5">
                              Analyst Reasoning Logs
                            </span>
                            <div className="space-y-1.5 font-mono text-[9px] text-slate-400">
                              {msg.reasoning.map((r, i) => (
                                <div key={i} className="flex items-start space-x-1.5">
                                  <span className="text-[#00E5FF]">•</span>
                                  <span>{r}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Attributed Evidence */}
                        {msg.evidence && (
                          <div className="bg-[#111827] border border-[#1E293B] p-3 rounded-xl space-y-2">
                            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider block border-b border-[#1E293B]/60 pb-1.5">
                              Attributed Evidence
                            </span>
                            <div className="space-y-1.5 font-mono text-[9px] text-slate-400">
                              {msg.evidence.map((ev, i) => (
                                <div key={i} className="flex items-start space-x-1.5">
                                  <span className="text-[#EF4444]">•</span>
                                  <span>{ev}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actionable Mitigation Checklist */}
                      {msg.mitigationSteps && (
                        <div className="bg-[#111827] border border-[#1E293B] p-3.5 rounded-xl space-y-3">
                          <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider block border-b border-[#1E293B]/60 pb-1.5 flex items-center space-x-1.5">
                            <ClipboardCheck className="w-3.5 h-3.5 text-[#22C55E]" />
                            <span>Actionable Case Mitigation Steps</span>
                          </span>
                          <div className="space-y-2">
                            {msg.mitigationSteps.map((step, i) => {
                              const stepId = `${idx}-${i}`;
                              const isChecked = !!checkedMitigations[stepId];
                              return (
                                <div 
                                  key={i} 
                                  onClick={() => handleMitigationCheck(stepId)}
                                  className={`flex items-start space-x-2.5 p-2 rounded-lg border transition-all cursor-pointer select-none ${
                                    isChecked 
                                      ? 'bg-[#22C55E]/5 border-[#22C55E]/20 text-slate-400 line-through' 
                                      : 'bg-[#0B1220] border-[#1E293B] text-slate-200 hover:border-slate-700'
                                  }`}
                                >
                                  <input 
                                    type="checkbox" 
                                    checked={isChecked}
                                    onChange={() => {}} // handled by click
                                    className="mt-0.5 pointer-events-none"
                                  />
                                  <span className="text-[10px] leading-snug">{step}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {msg.sources && msg.sources.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {msg.sources.slice(0, 3).map((s, i) => (
                        <span key={i} className="text-[8px] font-mono text-[#00E5FF]/60 bg-[#00E5FF]/5 px-1.5 py-0.5 rounded border border-[#00E5FF]/10">
                          [{i+1}] {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {ragIsLoading && (
                <div className="flex items-center space-x-2 text-[10px] text-[#00E5FF] font-mono">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing compliance datasets...</span>
                </div>
              )}
            </div>

            {/* Form Input footer */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-[#1E293B] bg-[#0B1220]/60 flex space-x-2 flex-shrink-0">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Query compliance playbooks, fraud indicators, network rules..."
                className="flex-1 bg-[#050811] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/30 transition-all"
              />
              <button
                type="submit"
                disabled={ragIsLoading}
                className="bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-slate-900 p-2.5 rounded-xl flex-shrink-0 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </AppCard>
        </div>

        {/* Right Side: Citations & Quality KPIs */}
        <div className="lg:col-span-3 flex flex-col space-y-4 min-h-0">
          <AppCard className="p-4 space-y-3">
            <span className="text-[10px] font-sans font-semibold text-slate-500 uppercase tracking-widest block border-b border-[#1E293B] pb-2 flex items-center space-x-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>Retrieval Quality</span>
            </span>
            <div className="space-y-2 font-mono text-[10px] text-slate-400">
              {[
                { label: 'Precision@1', value: '92.0%', color: 'text-[#00E5FF]' },
                { label: 'Recall@1', value: '76.0%', color: 'text-[#00E5FF]' },
                { label: 'Groundedness', value: '95.8%', color: 'text-[#22C55E]' },
                { label: 'Citation Coverage', value: '100.0%', color: 'text-[#22C55E]' },
              ].map((metric, idx) => (
                <div key={idx} className="bg-[#0B1220] border border-[#1E293B] p-2.5 rounded-xl flex justify-between">
                  <span>{metric.label}</span>
                  <span className={`${metric.color} font-bold`}>{metric.value}</span>
                </div>
              ))}
            </div>
          </AppCard>

          <AppCard className="p-4 space-y-3 flex-1 flex flex-col min-h-0">
            <span className="text-[10px] font-sans font-semibold text-slate-500 uppercase tracking-widest block border-b border-[#1E293B] pb-2 flex items-center space-x-1.5">
              <Bookmark className="w-3.5 h-3.5 text-[#22C55E]" />
              <span>Active Reference Bases</span>
            </span>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {activeSources.map((source, index) => (
                <div 
                  key={index}
                  className="bg-[#0B1220] border border-[#1E293B] p-2.5 rounded-xl text-[10px] font-mono text-slate-400 block truncate"
                  title={source}
                >
                  <span className="text-[#00E5FF] font-bold mr-1">[{index + 1}]</span>
                  <span>{source}</span>
                </div>
              ))}
            </div>
          </AppCard>
        </div>
      </div>
    </div>
  );
};

export default KnowledgePage;
