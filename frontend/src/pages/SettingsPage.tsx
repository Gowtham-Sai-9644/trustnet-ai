import React, { useState } from 'react';
import { 
  Key, 
  ShieldCheck, 
  Settings,
  Database,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import { AppCard } from '../components/ui/AppCard';
import { AppPageHeader } from '../components/ui/AppPageHeader';
import { AppBadge } from '../components/ui/AppBadge';

const SettingsPage: React.FC = () => {
  const [threshold, setThreshold] = useState<number>(0.65);
  const [confidence, setConfidence] = useState<number>(0.85);
  const [apiKey, setApiKey] = useState<string>('tn_live_902df3b8f1c84d7289b422a59a');
  const [syncInterval, setSyncInterval] = useState<number>(300);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <AppPageHeader 
        title="Settings" 
        description="Configure model thresholds, API credentials, and sync intervals."
        rightElement={
          saved ? <AppBadge color="success">Configuration Saved</AppBadge> : undefined
        }
      />

      <AppCard className="p-6 space-y-6">
        {/* Threshold sliders */}
        <div className="space-y-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block border-b border-[#1E293B] pb-2 flex items-center space-x-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#06B6D4]" />
            <span>Risk Thresholds</span>
          </span>
          <div className="space-y-4 bg-[#0F172A] p-4 rounded-xl border border-[#1E293B]">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-300">Alert Threat Threshold</span>
                <span className="font-mono text-[#06B6D4] font-bold">{(threshold * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.05"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-full h-1 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#06B6D4]"
              />
              <p className="text-[9px] text-slate-500">Flags cases as 'High Risk' when calibrated probability surpasses this boundary.</p>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-[#1E293B]">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-300">Min Calibration Confidence</span>
                <span className="font-mono text-[#06B6D4] font-bold">{(confidence * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="0.99"
                step="0.01"
                value={confidence}
                onChange={(e) => setConfidence(parseFloat(e.target.value))}
                className="w-full h-1 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-[#06B6D4]"
              />
              <p className="text-[9px] text-slate-500">Required statistical confidence margin before calibration validations activate.</p>
            </div>
          </div>
        </div>

        {/* API Key */}
        <div className="space-y-3">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block border-b border-[#1E293B] pb-2 flex items-center space-x-1.5">
            <Key className="w-3.5 h-3.5 text-[#06B6D4]" />
            <span>API Credentials</span>
          </span>
          <div className="bg-[#0F172A] p-4 rounded-xl border border-[#1E293B] space-y-1.5">
            <label className="block text-[10px] font-mono text-slate-400 uppercase">Bearer Token</label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-[#070B14] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4]/30 transition-all"
            />
          </div>
        </div>

        {/* Sync intervals */}
        <div className="space-y-3">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block border-b border-[#1E293B] pb-2 flex items-center space-x-1.5">
            <Database className="w-3.5 h-3.5 text-[#06B6D4]" />
            <span>Sync Configuration</span>
          </span>
          <div className="bg-[#0F172A] p-4 rounded-xl border border-[#1E293B] space-y-1.5">
            <label className="block text-[10px] font-mono text-slate-400 uppercase">Replication Cycle (seconds)</label>
            <div className="flex items-center space-x-3">
              <input
                type="number"
                value={syncInterval}
                onChange={(e) => setSyncInterval(parseInt(e.target.value) || 60)}
                className="w-28 bg-[#070B14] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4]/30 transition-all"
              />
              <span className="text-[10px] text-slate-500">Re-indexes PageRank and centrality weights.</span>
            </div>
          </div>
        </div>

        {/* Buttons footer */}
        <div className="flex space-x-3 pt-3 border-t border-[#1E293B]">
          <button
            onClick={handleSave}
            className="bg-[#06B6D4] hover:bg-[#06B6D4]/90 text-slate-900 px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all active:scale-95"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Save Configuration</span>
          </button>
          <button
            onClick={() => {
              setThreshold(0.65);
              setConfidence(0.85);
              setApiKey('tn_live_902df3b8f1c84d7289b422a59a');
              setSyncInterval(300);
            }}
            className="bg-[#1E293B] hover:bg-[#1E293B]/80 text-slate-300 px-5 py-2.5 rounded-xl text-xs font-medium flex items-center space-x-2 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Defaults</span>
          </button>
        </div>
      </AppCard>
    </div>
  );
};

export default SettingsPage;
