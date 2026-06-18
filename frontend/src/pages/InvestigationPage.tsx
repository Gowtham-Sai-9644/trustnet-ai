import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Camera, 
  PhoneCall, 
  ShieldAlert, 
  ShieldCheck, 
  Info, 
  Clock, 
  Database,
  ArrowRight,
  Sliders,
  FolderOpen
} from 'lucide-react';
import { AppCard } from '../components/ui/AppCard';
import { AppPageHeader } from '../components/ui/AppPageHeader';
import { AppBadge } from '../components/ui/AppBadge';
import { motion, AnimatePresence } from 'framer-motion';

interface TimelineEvent {
  title: string;
  timestamp: string;
  description: string;
  type: 'INGEST' | 'SIGNAL' | 'CONNECTION' | 'CALIBRATION' | 'DISPATCH';
}

interface EvidenceFile {
  name: string;
  type: 'LOG' | 'SCREENSHOT' | 'TRANSCRIPT';
  size: string;
}

interface Case {
  id: string;
  target: string;
  targetType: 'UPI' | 'URL' | 'Phone';
  risk: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'ESCALATED' | 'RESOLVED';
  timeCreated: string;
  description: string;
  timeline: TimelineEvent[];
  evidence: EvidenceFile[];
}

const mockCases: Case[] = [
  {
    id: 'INC-94721',
    target: 'merchant-scam-address-24@ybl',
    targetType: 'UPI',
    risk: 'HIGH',
    status: 'ESCALATED',
    timeCreated: '2026-06-18 13:41:00',
    description: 'High-volume UPI merchant account linked to structured mule cluster and coercion redirection flows.',
    timeline: [
      { title: 'Initial Ingest', timestamp: '13:41:00', description: 'API Ingest Gateway registered merchant handle: merchant-scam-address-24@ybl.', type: 'INGEST' },
      { title: 'Signal Matches', timestamp: '13:41:15', description: 'India Scam Engine database match: Degree centrality centrality score exceeds threshold 12.', type: 'SIGNAL' },
      { title: 'Mule Connections', timestamp: '13:41:30', description: 'Discovered 2nd-order redirection transfer ring (4 adjacent nodes). PageRank: 0.0034.', type: 'CONNECTION' },
      { title: 'Calibrated Score', timestamp: '13:41:45', description: 'Stacked risk fusion probability calibrated at 98.4% with confidence interval ±1.5%.', type: 'CALIBRATION' },
      { title: 'Case Dispatched', timestamp: '13:42:00', description: 'Case marked CRITICAL and escalated to FIU (Financial Intelligence Unit) queue.', type: 'DISPATCH' }
    ],
    evidence: [
      { name: 'txn_log_fiu_94721.csv', type: 'LOG', size: '24 KB' },
      { name: 'mule_network_screenshot.png', type: 'SCREENSHOT', size: '1.2 MB' },
      { name: 'call_recording_transcript.txt', type: 'TRANSCRIPT', size: '15 KB' }
    ]
  },
  {
    id: 'INC-88342',
    target: 'https://lotto-rewards-claim.cfd',
    targetType: 'URL',
    risk: 'HIGH',
    status: 'RESOLVED',
    timeCreated: '2026-06-18 10:15:00',
    description: 'Phishing domain utilizing fake sweepstakes lottery theme to harvest net-banking credentials.',
    timeline: [
      { title: 'Initial Ingest', timestamp: '10:15:00', description: 'DNS query log ingested suspicious URL: lotto-rewards-claim.cfd.', type: 'INGEST' },
      { title: 'Signal Matches', timestamp: '10:15:20', description: 'Lexical model computed high entropy domain name & WHOIS registry patterns (0.94 probability).', type: 'SIGNAL' },
      { title: 'Mule Connections', timestamp: '10:15:40', description: 'Redirection routes trace to unindexed proxy registrar nameserver.', type: 'CONNECTION' },
      { title: 'Calibrated Score', timestamp: '10:16:00', description: 'Stacked prediction score calibrated at 92.1% under Isotonic calibration method.', type: 'CALIBRATION' },
      { title: 'Case Closed', timestamp: '10:16:20', description: 'Registrar blacklist issued. Redirect endpoint blocked successfully.', type: 'DISPATCH' }
    ],
    evidence: [
      { name: 'dns_whois_record.json', type: 'LOG', size: '4 KB' },
      { name: 'landing_page_clone.png', type: 'SCREENSHOT', size: '840 KB' }
    ]
  },
  {
    id: 'INC-71902',
    target: '+91 90876 54321',
    targetType: 'Phone',
    risk: 'MEDIUM',
    status: 'OPEN',
    timeCreated: '2026-06-18 15:22:00',
    description: 'Vishing call reports linking to SMS emergency utility suspension lures.',
    timeline: [
      { title: 'Initial Ingest', timestamp: '15:22:00', description: 'Ingested mobile telephony identifier +91 90876 54321.', type: 'INGEST' },
      { title: 'Signal Matches', timestamp: '15:22:30', description: 'Scanned national spam complaints database: 3 matching vishing cases resolved.', type: 'SIGNAL' },
      { title: 'Mule Connections', timestamp: '15:23:00', description: 'Linked to WhatsApp utility suspension bait texts (IndicBERT urgency match).', type: 'CONNECTION' },
      { title: 'Calibrated Score', timestamp: '15:23:30', description: 'Calibrated threat risk index evaluated at 64.2%. Status marked suspicious.', type: 'CALIBRATION' },
      { title: 'Case Queueing', timestamp: '15:24:00', description: 'Dispatched to primary analyst queue. Actionable review pending.', type: 'DISPATCH' }
    ],
    evidence: [
      { name: 'call_telephony_routing.log', type: 'LOG', size: '12 KB' },
      { name: 'WhatsApp_audio_transcription.txt', type: 'TRANSCRIPT', size: '8 KB' }
    ]
  }
];

export const InvestigationPage: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<Case>(mockCases[0]);
  const [currentStep, setCurrentStep] = useState<number>(4); // default final step
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(1);

  // Auto-play timeline loop
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= selectedCase.timeline.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 3000 / playSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playSpeed, selectedCase]);

  // Reset steps when case changes
  const handleCaseSelect = (c: Case) => {
    setSelectedCase(c);
    setCurrentStep(c.timeline.length - 1);
    setIsPlaying(false);
  };

  const getStatusColor = (status: Case['status']) => {
    if (status === 'RESOLVED') return 'success';
    if (status === 'ESCALATED') return 'danger';
    return 'warning';
  };

  const getStepIconColor = (type: TimelineEvent['type'], isPassed: boolean) => {
    if (!isPassed) return 'bg-[#1E293B] border-slate-600 text-slate-500';
    if (type === 'INGEST') return 'bg-[#0B1220] border-[#00E5FF] text-[#00E5FF]';
    if (type === 'SIGNAL') return 'bg-[#0B1220] border-[#F59E0B] text-[#F59E0B]';
    if (type === 'CONNECTION') return 'bg-[#0B1220] border-[#6366F1] text-[#6366F1]';
    if (type === 'CALIBRATION') return 'bg-[#0B1220] border-[#22C55E] text-[#22C55E]';
    return 'bg-[#EF4444] border-[#EF4444] text-slate-100';
  };

  return (
    <div className="space-y-4 text-left font-sans">
      <AppPageHeader 
        title="Investigation Replay Room" 
        description="Verify timelines, play back telemetry events, and audit evidence trails for past cases."
        rightElement={
          <div className="flex items-center space-x-2">
            <AppBadge color={getStatusColor(selectedCase.status)}>
              CASE {selectedCase.status}
            </AppBadge>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Case Ingestion List */}
        <div className="lg:col-span-3 space-y-4">
          <AppCard className="p-4 flex flex-col h-[540px]">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block border-b border-[#1E293B] pb-2 mb-3 flex items-center space-x-2">
              <FolderOpen className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>INCIDENT DIRECTORY</span>
            </span>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {mockCases.map((c) => {
                const isActive = selectedCase.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => handleCaseSelect(c)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all text-left ${
                      isActive 
                        ? 'bg-[#1E293B] border-[#00E5FF]/40 shadow-md' 
                        : 'bg-[#0B1220] border-[#1E293B] hover:border-[#1E293B]/80'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-[#00E5FF]' : 'text-slate-300'}`}>
                        {c.id}
                      </span>
                      <AppBadge color={getStatusColor(c.status)} className="scale-75 origin-right">
                        {c.status}
                      </AppBadge>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 truncate mb-1.5">{c.target}</div>
                    <div className="flex justify-between text-[8px] font-mono text-slate-500">
                      <span>TYPE: {c.targetType}</span>
                      <span>RISK: {c.risk}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </AppCard>
        </div>

        {/* Center: Replay Scrubber and Event timeline */}
        <div className="lg:col-span-6 space-y-4">
          <AppCard className="p-5 flex flex-col justify-between h-[540px]">
            <div className="space-y-4 flex-1">
              {/* Header Details */}
              <div className="border-b border-[#1E293B] pb-3 text-left">
                <span className="text-[9px] font-mono text-slate-500 uppercase">ACTIVE CASE METADATA</span>
                <h3 className="text-sm font-bold text-slate-200 mt-1 flex items-center space-x-2">
                  <span>{selectedCase.id}:</span>
                  <span className="text-slate-400 font-mono text-xs">{selectedCase.target}</span>
                </h3>
                <p className="text-[10px] text-slate-400 mt-1 leading-normal font-sans">{selectedCase.description}</p>
              </div>

              {/* Event timeline replay display */}
              <div className="relative border-l border-[#1E293B] ml-4 pl-6 space-y-6 py-2 min-h-[300px]">
                {selectedCase.timeline.map((step, idx) => {
                  const isPassed = currentStep >= idx;
                  const isActive = currentStep === idx;
                  return (
                    <motion.div 
                      key={idx}
                      className={`relative text-xs transition-opacity duration-300 ${
                        isPassed ? 'opacity-100' : 'opacity-25'
                      }`}
                    >
                      {/* Node Bullet */}
                      <span 
                        className={`absolute -left-[33px] top-0.5 w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center font-mono text-[9px] font-bold ${getStepIconColor(step.type, isPassed)}`}
                      >
                        {idx + 1}
                      </span>

                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className={`font-bold ${isActive ? 'text-[#00E5FF]' : 'text-slate-200'}`}>
                          {step.title}
                        </span>
                        <span className="text-slate-500">{step.timestamp}</span>
                      </div>
                      <p className="text-[9px] text-slate-400 mt-1 font-mono tracking-tight leading-relaxed">{step.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Playback Controls & Scrubber */}
            <div className="border-t border-[#1E293B] pt-4 space-y-3">
              {/* Scrubber track */}
              <div className="flex items-center space-x-3 text-[9px] font-mono text-slate-400">
                <span>1</span>
                <input 
                  type="range"
                  min="0"
                  max={selectedCase.timeline.length - 1}
                  value={currentStep}
                  onChange={(e) => {
                    setCurrentStep(Number(e.target.value));
                    setIsPlaying(false);
                  }}
                  className="flex-1 accent-[#00E5FF] bg-[#050811] h-1 rounded-full cursor-pointer appearance-none border border-[#1E293B]"
                />
                <span>{selectedCase.timeline.length}</span>
              </div>

              {/* Controls bar */}
              <div className="flex justify-between items-center">
                <div className="flex space-x-1">
                  {[1, 2, 5].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setPlaySpeed(speed)}
                      className={`px-2 py-1 rounded font-mono text-[9px] border cursor-pointer ${
                        playSpeed === speed 
                          ? 'bg-[#00E5FF]/15 border-[#00E5FF]/30 text-[#00E5FF]' 
                          : 'bg-[#111827] border-[#1E293B] text-slate-500'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>

                <div className="flex items-center space-x-2.5">
                  <button
                    onClick={() => {
                      setCurrentStep(prev => Math.max(0, prev - 1));
                      setIsPlaying(false);
                    }}
                    disabled={currentStep === 0}
                    className="p-2 rounded-xl bg-[#111827] border border-[#1E293B] hover:border-slate-700 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4 text-slate-300" />
                  </button>
                  <button
                    onClick={() => {
                      if (currentStep === selectedCase.timeline.length - 1) {
                        setCurrentStep(0);
                        setIsPlaying(true);
                      } else {
                        setIsPlaying(prev => !prev);
                      }
                    }}
                    className="p-2.5 rounded-xl bg-[#00E5FF] text-slate-900 hover:bg-[#00E5FF]/90 cursor-pointer"
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 fill-slate-900" />
                    ) : (
                      <Play className="w-4 h-4 fill-slate-900" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setCurrentStep(prev => Math.min(selectedCase.timeline.length - 1, prev + 1));
                      setIsPlaying(false);
                    }}
                    disabled={currentStep === selectedCase.timeline.length - 1}
                    className="p-2 rounded-xl bg-[#111827] border border-[#1E293B] hover:border-slate-700 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </button>
                </div>

                <span className="text-[9px] font-mono text-slate-500">
                  STEP {currentStep + 1} OF {selectedCase.timeline.length}
                </span>
              </div>
            </div>
          </AppCard>
        </div>

        {/* Right: Evidence Locker Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <AppCard className="p-4 flex flex-col h-[540px]">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block border-b border-[#1E293B] pb-2 mb-3 flex items-center space-x-2">
              <Database className="w-3.5 h-3.5 text-[#22C55E]" />
              <span>EVIDENCE LOCKER</span>
            </span>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-left">
              {selectedCase.evidence.map((file, idx) => (
                <div
                  key={idx}
                  className="bg-[#0B1220] border border-[#1E293B] p-3 rounded-xl flex items-center justify-between hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="bg-[#111827] p-2 rounded-lg border border-[#1E293B]">
                      {file.type === 'LOG' && <FileText className="w-4 h-4 text-[#00E5FF]" />}
                      {file.type === 'SCREENSHOT' && <Camera className="w-4 h-4 text-[#6366F1]" />}
                      {file.type === 'TRANSCRIPT' && <PhoneCall className="w-4 h-4 text-[#F59E0B]" />}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[10px] font-mono text-slate-300 truncate font-semibold">
                        {file.name}
                      </h4>
                      <span className="text-[8px] font-mono text-slate-500 block uppercase">{file.size} • {file.type}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                </div>
              ))}
            </div>
            
            <div className="bg-[#050811] p-3.5 rounded-xl border border-[#1E293B]/60 text-[9px] font-mono text-slate-500 mt-4 leading-normal text-left">
              <Info className="w-3.5 h-3.5 text-[#00E5FF] mb-1.5" />
              <span>All evidence files are cryptographically hashed and signed to maintain court-admissible audit integrity chains.</span>
            </div>
          </AppCard>
        </div>
      </div>
    </div>
  );
};

export default InvestigationPage;
