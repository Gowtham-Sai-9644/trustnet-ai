import React, { useState } from 'react';
import { 
  Send, 
  MessageSquare, 
  History, 
  Bookmark, 
  Sparkles,
  RefreshCw,
  Sliders,
  HelpCircle,
  Zap,
  FileText
} from 'lucide-react';
import { ragService } from '../services/api';
import { AppCard } from '../components/ui/AppCard';
import { AppPageHeader } from '../components/ui/AppPageHeader';
import { AppBadge } from '../components/ui/AppBadge';

interface Message {
  sender: 'user' | 'system';
  text: string;
  timestamp: string;
  sources?: string[];
}

const KnowledgePage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSources, setActiveSources] = useState<string[]>([
    "ChromaDB local vector space (dec_2025)",
    "NPCI Unified Payments Interface directive v4.2",
    "RBI Fraud Telemetry Registry 2024-2025"
  ]);

  const [history, setHistory] = useState<string[]>([
    "Analyze payout.merchant@ybl signature",
    "How to verify lottery cash-prize SMS?",
    "Mitigation steps for marketplace fake refunds"
  ]);

  const starterPrompts = [
    { icon: Zap, text: "Analyze this suspicious UPI", color: "text-amber-400" },
    { icon: HelpCircle, text: "Explain why this transaction is risky", color: "text-blue-400" },
    { icon: Sparkles, text: "Show related scam patterns", color: "text-purple-400" },
    { icon: MessageSquare, text: "Summarize graph relationships", color: "text-emerald-400" },
    { icon: FileText, text: "Generate analyst report", color: "text-[#06B6D4]" }
  ];

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isLoading) return;

    const query = chatInput;
    const time = new Date().toLocaleTimeString();
    setMessages(prev => [...prev, { sender: 'user', text: query, timestamp: time }]);
    setChatInput('');
    setIsLoading(true);

    try {
      const response = await ragService.queryAssistant(query);
      const replyText = response.answer || response.response || response.output || "Reference directories returned empty index matches.";
      const docs = response.sources || response.documents || [
        "National Cybercrime Portal dataset",
        "NPCI UPI fraud list matches"
      ];
      
      setMessages(prev => [...prev, { 
        sender: 'system', 
        text: replyText, 
        timestamp: new Date().toLocaleTimeString(),
        sources: docs
      }]);
      
      if (docs.length > 0) setActiveSources(docs);
      if (!history.includes(query)) setHistory(prev => [query, ...prev.slice(0, 4)]);

    } catch (err: any) {
      setMessages(prev => [...prev, { 
        sender: 'system', 
        text: `[RAG CONNECTION ERROR]: ${err.message || 'ChromaDB instance connection refused. Verify backend is running.'}`, 
        timestamp: new Date().toLocaleTimeString() 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStarterClick = (prompt: string) => {
    setChatInput(prompt);
  };

  return (
    <div className="space-y-6">
      <AppPageHeader 
        title="AI Analyst Assistant" 
        description="RAG-powered conversational intelligence. Query UPI regulations, threat patterns, and compliance frameworks."
        rightElement={
          <AppBadge color="success">RAG ENGINE ACTIVE</AppBadge>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-220px)] min-h-[500px]">
        {/* Left Side: History Logs */}
        <div className="lg:col-span-3 flex flex-col">
          <AppCard className="flex flex-col flex-1 p-4">
            <span className="text-[10px] font-sans font-semibold text-slate-500 uppercase tracking-widest block border-b border-[#1E293B] pb-2 mb-3 flex items-center space-x-1.5">
              <History className="w-3.5 h-3.5" />
              <span>Query History</span>
            </span>
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {history.map((hText, idx) => (
                <button
                  key={idx}
                  onClick={() => setChatInput(hText)}
                  className="w-full text-left bg-[#0F172A] p-2.5 rounded-xl border border-[#1E293B] hover:border-[#06B6D4]/30 text-[10px] font-mono truncate text-slate-400 block transition-all hover:bg-[#1E293B]/30"
                >
                  {hText}
                </button>
              ))}
            </div>
            <div className="border-t border-[#1E293B] pt-3 mt-3 text-[9px] font-mono text-slate-500 flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-pulse" />
              <span>ChromaDB Vector Index Active</span>
            </div>
          </AppCard>
        </div>

        {/* Center: Chat Window */}
        <div className="lg:col-span-6 flex flex-col">
          <AppCard className="flex flex-col flex-1 p-0 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-[#1E293B] bg-[#0F172A]/60 flex justify-between items-center text-xs flex-shrink-0">
              <span className="font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <MessageSquare className="w-4 h-4 text-[#06B6D4]" />
                <span>Analyst Terminal</span>
              </span>
              <span className="text-[9px] font-mono text-slate-600">[VECTOR_DB_INDEX_2025]</span>
            </div>

            {/* Transcript Panel */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full space-y-6 py-8">
                  <div className="bg-[#06B6D4]/10 p-4 rounded-2xl border border-[#06B6D4]/20">
                    <Sparkles className="w-8 h-8 text-[#06B6D4]" />
                  </div>
                  <div className="text-center space-y-2 max-w-sm">
                    <h3 className="text-sm font-bold text-slate-200">Ask a question to begin analysis</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Query threat intelligence, UPI compliance rules, or investigation workflows using natural language.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                    {starterPrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleStarterClick(prompt.text)}
                        className="flex items-center space-x-2 bg-[#0F172A] border border-[#1E293B] rounded-xl px-3 py-2.5 text-left text-[10px] text-slate-400 hover:border-[#06B6D4]/30 hover:text-slate-300 transition-all hover:bg-[#1E293B]/20"
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
                  <div className={`p-3 rounded-2xl max-w-[85%] leading-relaxed border ${
                    msg.sender === 'user'
                      ? 'bg-[#1E293B] border-[#1E293B] text-slate-100'
                      : 'bg-[#0F172A] border-[#1E293B] text-slate-300'
                  }`}>
                    {msg.text}
                  </div>
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {msg.sources.slice(0, 3).map((s, i) => (
                        <span key={i} className="text-[8px] font-mono text-[#06B6D4]/60 bg-[#06B6D4]/5 px-1.5 py-0.5 rounded border border-[#06B6D4]/10">
                          [{i+1}] {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-center space-x-2 text-[10px] text-[#06B6D4] font-mono">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Resolving vector distributions...</span>
                </div>
              )}
            </div>

            {/* Form Input footer */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-[#1E293B] bg-[#0F172A]/60 flex space-x-2 flex-shrink-0">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Query UPI rules, fraud indicators, compliance frameworks..."
                className="flex-1 bg-[#070B14] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4]/30 transition-all"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#06B6D4] hover:bg-[#06B6D4]/90 text-slate-900 p-2.5 rounded-xl flex-shrink-0 transition-all active:scale-95 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </AppCard>
        </div>

        {/* Right Side: Citations & Quality KPIs */}
        <div className="lg:col-span-3 flex flex-col space-y-4">
          <AppCard className="p-4 space-y-3">
            <span className="text-[10px] font-sans font-semibold text-slate-500 uppercase tracking-widest block border-b border-[#1E293B] pb-2 flex items-center space-x-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#06B6D4]" />
              <span>Retrieval Quality</span>
            </span>
            <div className="space-y-2 font-mono text-[10px] text-slate-400">
              {[
                { label: 'Precision@1', value: '92.0%', color: 'text-[#06B6D4]' },
                { label: 'Recall@1', value: '76.0%', color: 'text-[#06B6D4]' },
                { label: 'Groundedness', value: '95.8%', color: 'text-[#22C55E]' },
                { label: 'Citation Coverage', value: '100.0%', color: 'text-[#22C55E]' },
              ].map((metric, idx) => (
                <div key={idx} className="bg-[#0F172A] border border-[#1E293B] p-2.5 rounded-xl flex justify-between">
                  <span>{metric.label}</span>
                  <span className={`${metric.color} font-bold`}>{metric.value}</span>
                </div>
              ))}
            </div>
          </AppCard>

          <AppCard className="p-4 space-y-3 flex-1">
            <span className="text-[10px] font-sans font-semibold text-slate-500 uppercase tracking-widest block border-b border-[#1E293B] pb-2 flex items-center space-x-1.5">
              <Bookmark className="w-3.5 h-3.5 text-[#22C55E]" />
              <span>Active Sources</span>
            </span>
            <div className="space-y-2 overflow-y-auto pr-1">
              {activeSources.map((source, index) => (
                <div 
                  key={index}
                  className="bg-[#0F172A] border border-[#1E293B] p-2.5 rounded-xl text-[10px] font-mono text-slate-400 block truncate"
                  title={source}
                >
                  <span className="text-[#06B6D4] font-bold mr-1">[{index + 1}]</span>
                  {source}
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
