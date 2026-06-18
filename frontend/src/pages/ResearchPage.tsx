import React, { useState, useEffect } from 'react';
import { researchService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area 
} from 'recharts';
import { Database, Activity, ShieldAlert, Cpu, Award, RefreshCw, AlertTriangle, Play, CheckCircle } from 'lucide-react';
import { AppCard } from '../components/ui/AppCard';
import { AppPageHeader } from '../components/ui/AppPageHeader';
import { AppBadge } from '../components/ui/AppBadge';

interface ModelInfo {
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  f1: number;
  sparkline: number[];
  calibrationData: { ideal: number; actual: number }[];
  description: string;
  precision: number;
  recall: number;
  auc: number;
  drift: number;
}

const mockModels: ModelInfo[] = [
  {
    name: "DistilBERT Classifier (NLP)",
    status: 'ACTIVE',
    f1: 94.2,
    sparkline: [92, 93, 93.5, 94.2, 94.0, 94.2],
    calibrationData: [
      { ideal: 0, actual: 0.05 },
      { ideal: 25, actual: 23 },
      { ideal: 50, actual: 48 },
      { ideal: 75, actual: 76 },
      { ideal: 100, actual: 98 }
    ],
    description: "Evaluates conversational urgency indicators, coercion language structures, and lexical scam patterns in SMS payloads.",
    precision: 94.5,
    recall: 93.9,
    auc: 0.982,
    drift: 0.012
  },
  {
    name: "India Scam Engine (UPI Link)",
    status: 'ACTIVE',
    f1: 96.5,
    sparkline: [95, 95.2, 95.8, 96.0, 96.3, 96.5],
    calibrationData: [
      { ideal: 0, actual: 0.02 },
      { ideal: 25, actual: 26 },
      { ideal: 50, actual: 52 },
      { ideal: 75, actual: 74 },
      { ideal: 100, actual: 99 }
    ],
    description: "Cross-references UPI IDs, VPAs, and settlement banks against reported mule account registers and node counts.",
    precision: 96.8,
    recall: 96.2,
    auc: 0.991,
    drift: 0.008
  },
  {
    name: "VirusTotal API Connector (URL)",
    status: 'ACTIVE',
    f1: 98.1,
    sparkline: [97.8, 97.9, 98.0, 98.1, 98.1, 98.1],
    calibrationData: [
      { ideal: 0, actual: 0.01 },
      { ideal: 25, actual: 25 },
      { ideal: 50, actual: 50 },
      { ideal: 75, actual: 75 },
      { ideal: 100, actual: 100 }
    ],
    description: "Scans URL redirects, domain WHOIS records, and entropy values using ensembled threat intelligence aggregators.",
    precision: 98.4,
    recall: 97.8,
    auc: 0.998,
    drift: 0.002
  },
  {
    name: "Google Vision AI (OCR Check)",
    status: 'ACTIVE',
    f1: 89.4,
    sparkline: [88.2, 88.5, 89.0, 89.2, 89.1, 89.4],
    calibrationData: [
      { ideal: 0, actual: 0.08 },
      { ideal: 25, actual: 22 },
      { ideal: 50, actual: 45 },
      { ideal: 75, actual: 78 },
      { ideal: 100, actual: 92 }
    ],
    description: "Performs optical character recognition on uploaded screenshot attachments to parse scam messages from images.",
    precision: 90.1,
    recall: 88.7,
    auc: 0.942,
    drift: 0.024
  },
  {
    name: "Platform Risk Stacker (Ensemble)",
    status: 'ACTIVE',
    f1: 97.6,
    sparkline: [96.8, 97.0, 97.2, 97.5, 97.5, 97.6],
    calibrationData: [
      { ideal: 0, actual: 0.02 },
      { ideal: 25, actual: 24 },
      { ideal: 50, actual: 49 },
      { ideal: 75, actual: 76 },
      { ideal: 100, actual: 98 }
    ],
    description: "Fuses output logits from NLP, URL, and Graph PageRank models to predict overall threat levels.",
    precision: 97.9,
    recall: 97.3,
    auc: 0.995,
    drift: 0.005
  },
  {
    name: "Price Anomaly Engine (Behavior)",
    status: 'INACTIVE',
    f1: 84.1,
    sparkline: [85.0, 84.8, 84.5, 84.2, 84.1, 84.1],
    calibrationData: [
      { ideal: 0, actual: 0.12 },
      { ideal: 25, actual: 20 },
      { ideal: 50, actual: 42 },
      { ideal: 75, actual: 70 },
      { ideal: 100, actual: 85 }
    ],
    description: "Flags merchant transaction values that deviate significantly from average historical patterns.",
    precision: 85.2,
    recall: 83.0,
    auc: 0.910,
    drift: 0.045
  }
];

const driftHistoryData = [
  { day: 'Day 1', DistilBERT: 0.001, IndiaScam: 0.002, VisionAI: 0.005 },
  { day: 'Day 5', DistilBERT: 0.003, IndiaScam: 0.003, VisionAI: 0.008 },
  { day: 'Day 10', DistilBERT: 0.006, IndiaScam: 0.004, VisionAI: 0.012 },
  { day: 'Day 15', DistilBERT: 0.008, IndiaScam: 0.006, VisionAI: 0.015 },
  { day: 'Day 20', DistilBERT: 0.010, IndiaScam: 0.007, VisionAI: 0.019 },
  { day: 'Day 25', DistilBERT: 0.011, IndiaScam: 0.008, VisionAI: 0.022 },
  { day: 'Day 30', DistilBERT: 0.012, IndiaScam: 0.008, VisionAI: 0.024 }
];

const shapAnalysisData = [
  { feature: 'UPI Degree', impact: 0.38 },
  { feature: 'Lexical Entropy', impact: 0.28 },
  { feature: 'Redirection Hops', impact: 0.18 },
  { feature: 'Domain Age', impact: 0.11 },
  { feature: 'Registry Match', impact: 0.05 }
];

export const ResearchPage: React.FC = () => {
  const [selectedModelIdx, setSelectedModelIdx] = useState<number>(0);
  const [experiments, setExperiments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const activeModel = mockModels[selectedModelIdx];

  useEffect(() => {
    const fetchExp = async () => {
      try {
        setIsLoading(true);
        const data = await researchService.getExperiments();
        setExperiments(data);
      } catch (err) {
        console.error("Failed loading experiments dataset:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExp();
  }, []);

  // Render pure SVG sparkline
  const renderSparkline = (points: number[]) => {
    const width = 80;
    const height = 24;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const ratioX = width / (points.length - 1);
    const ratioY = (height - 4) / (max - min || 1);

    const pathData = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${i * ratioX} ${height - 2 - (p - min) * ratioY}`)
      .join(' ');

    return (
      <svg width={width} height={height} className="overflow-visible">
        <path d={pathData} fill="none" stroke="#00E5FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

  // Render miniature calibration curve SVG
  const renderMiniCalibration = (data: { ideal: number; actual: number }[]) => {
    const size = 50;
    const pointsIdeal = data.map((d) => `${(d.ideal / 100) * size},${size - (d.ideal / 100) * size}`).join(' ');
    const pointsActual = data.map((d) => `${(d.ideal / 100) * size},${size - (d.actual / 100) * size}`).join(' ');

    return (
      <svg width={size} height={size} className="border border-[#1E293B] bg-[#050811] overflow-visible">
        {/* Ideal diagonal */}
        <polyline points={pointsIdeal} fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" strokeDasharray="2 2" />
        {/* Actual calibration */}
        <polyline points={pointsActual} fill="none" stroke="#6366F1" strokeWidth="1.5" />
      </svg>
    );
  };

  return (
    <div className="space-y-4 text-left font-sans">
      <AppPageHeader 
        title="ML Observability & Model Registry" 
        description="Monitor classifier calibration curves, model drift statistics, feature importance weights, and registered experiments."
      />

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockModels.map((model, idx) => {
          const isSelected = selectedModelIdx === idx;
          const isActive = model.status === 'ACTIVE';
          return (
            <div
              key={idx}
              onClick={() => setSelectedModelIdx(idx)}
              className={`bg-[#0B1220] border rounded-2xl p-4 flex flex-col justify-between h-[155px] cursor-pointer transition-all ${
                isSelected 
                  ? 'border-[#00E5FF] shadow-lg shadow-cyan-500/5' 
                  : 'border-[#1E293B] hover:border-slate-800'
              }`}
            >
              {/* Card Header */}
              <div className="flex justify-between items-start">
                <div className="min-w-0">
                  <h4 className="text-[11px] font-bold text-slate-200 uppercase tracking-wide truncate">
                    {model.name}
                  </h4>
                  <span className="text-[8px] font-mono text-slate-500 uppercase mt-0.5 block">MODEL ID: RF-ENG-V{idx + 1}</span>
                </div>
                <AppBadge color={isActive ? 'success' : 'muted'} className="scale-75 origin-right">
                  {model.status}
                </AppBadge>
              </div>

              {/* F1 Score & Sparkline */}
              <div className="flex justify-between items-center py-2">
                <div className="text-left">
                  <span className="text-[8px] font-mono text-slate-500 uppercase block leading-none">F1-Score</span>
                  <span className="text-2xl font-bold font-mono text-slate-100">{model.f1}%</span>
                </div>
                {renderSparkline(model.sparkline)}
              </div>

              {/* Card Footer: Calibration indicator */}
              <div className="border-t border-[#1E293B] pt-2 flex justify-between items-center text-[9px] font-mono text-slate-400">
                <span>Calibration Curve:</span>
                {renderMiniCalibration(model.calibrationData)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Hand: Drift Monitor & Technical metrics */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Model Drift Monitor */}
          <AppCard className="p-5">
            <div className="flex justify-between items-center border-b border-[#1E293B] pb-3 mb-4">
              <span className="font-semibold text-xs text-slate-300 uppercase tracking-tight flex items-center space-x-1.5">
                <Activity className="w-4 h-4 text-[#00E5FF] animate-pulse" />
                <span>Model Drift Monitor (Past 30 Days)</span>
              </span>
              <span className="text-[9px] font-mono text-[#00E5FF] bg-[#00E5FF]/5 border border-[#00E5FF]/15 px-2 py-0.5 rounded">
                CALIBRATED DRIFT OK
              </span>
            </div>

            <div className="w-full h-64 text-xs font-mono">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={driftHistoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="day" stroke="#94A3B8" tick={{ fontSize: 9 }} />
                  <YAxis stroke="#94A3B8" tick={{ fontSize: 9 }} domain={[0, 0.03]} />
                  <Tooltip contentStyle={{ backgroundColor: '#0B1220', borderColor: '#1E293B' }} />
                  <Legend wrapperStyle={{ fontSize: 9 }} />
                  <Line type="monotone" dataKey="DistilBERT" stroke="#00E5FF" strokeWidth={1.5} dot={{ r: 2 }} />
                  <Line type="monotone" dataKey="IndiaScam" stroke="#6366F1" strokeWidth={1.5} dot={{ r: 2 }} />
                  <Line type="monotone" dataKey="VisionAI" stroke="#EF4444" strokeWidth={1.5} dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </AppCard>

          {/* Model specific Details tab */}
          <AppCard className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="md:col-span-2 space-y-3">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block border-b border-[#1E293B] pb-1.5">
                Technical Details: {activeModel.name}
              </span>
              <p className="text-slate-400 leading-relaxed font-sans">{activeModel.description}</p>
              
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-[#050811] p-3 rounded-xl border border-[#1E293B] font-mono text-[9px] space-y-1">
                  <span className="text-slate-500 block">PRECISION RATE</span>
                  <span className="text-slate-200 font-bold text-sm block">{activeModel.precision}%</span>
                </div>
                <div className="bg-[#050811] p-3 rounded-xl border border-[#1E293B] font-mono text-[9px] space-y-1">
                  <span className="text-slate-500 block">RECALL RATE</span>
                  <span className="text-slate-200 font-bold text-sm block">{activeModel.recall}%</span>
                </div>
                <div className="bg-[#050811] p-3 rounded-xl border border-[#1E293B] font-mono text-[9px] space-y-1">
                  <span className="text-slate-500 block">ROC-AUC SCORE</span>
                  <span className="text-slate-200 font-bold text-sm block">{activeModel.auc}</span>
                </div>
                <div className="bg-[#050811] p-3 rounded-xl border border-[#1E293B] font-mono text-[9px] space-y-1">
                  <span className="text-slate-500 block">30D CONCEPT DRIFT</span>
                  <span className={`font-bold text-sm block ${activeModel.drift > 0.02 ? 'text-[#EF4444]' : 'text-[#22C55E]'}`}>
                    {activeModel.drift * 100}%
                  </span>
                </div>
              </div>
            </div>

            {/* SVG based Feature Importance */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block border-b border-[#1E293B] pb-1.5">
                SHAP Feature Weights
              </span>
              <div className="space-y-3 font-mono text-[9px] pt-1">
                {shapAnalysisData.map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span className="uppercase">{item.feature}</span>
                      <span className="text-[#00E5FF] font-bold">+{item.impact * 100}%</span>
                    </div>
                    <div className="w-full bg-[#050811] h-1 rounded-full overflow-hidden">
                      <div className="h-full bg-[#00E5FF]" style={{ width: `${item.impact * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AppCard>
        </div>

        {/* Right Hand: Experiment registry list */}
        <div className="lg:col-span-4 space-y-4">
          <AppCard className="p-5 flex flex-col h-full min-h-[460px]">
            <span className="font-sans font-semibold text-xs text-slate-300 uppercase tracking-tight border-b border-[#1E293B] pb-3 mb-4 flex items-center space-x-1.5">
              <Database className="w-4 h-4 text-[#00E5FF]" />
              <span>Experiment Registry Runs</span>
            </span>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-left">
              {experiments.length === 0 && isLoading ? (
                <div className="flex flex-col items-center justify-center h-48 space-y-2 text-slate-500 font-mono text-[10px]">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#00E5FF]" />
                  <span>Ingesting experiments...</span>
                </div>
              ) : experiments.length === 0 ? (
                <div className="text-slate-500 font-mono text-[9px] text-center py-12">
                  No active ML experiments registered.
                </div>
              ) : (
                experiments.map((exp: any) => (
                  <div key={exp.experiment_id} className="bg-[#0B1220] p-3 rounded-xl border border-[#1E293B] space-y-2 font-mono text-[10px]">
                    <div className="flex justify-between items-start">
                      <span className="text-slate-200 font-bold truncate max-w-[130px]">{exp.name}</span>
                      <span className="text-[8px] bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/15 px-1.5 py-0.5 rounded font-bold uppercase">
                        {exp.category.replace('_', ' ').replace('test', 'metrics').toUpperCase()}
                      </span>
                    </div>
                    <div className="text-[9px] text-slate-500 space-y-1">
                      <div className="flex justify-between">
                        <span>Accuracy score:</span>
                        <span className="text-slate-300 font-bold">{(exp.metrics.accuracy * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>F1 benchmark:</span>
                        <span className="text-[#22C55E] font-bold">{(exp.metrics.f1_score * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between border-t border-[#1E293B]/40 pt-1 mt-1 text-[8px]">
                        <span>Timestamp:</span>
                        <span className="text-slate-600">{new Date(exp.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </AppCard>
        </div>
      </div>
    </div>
  );
};

export default ResearchPage;
