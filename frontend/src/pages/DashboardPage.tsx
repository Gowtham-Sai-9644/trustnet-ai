import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { 
  ShieldAlert, 
  Activity, 
  Cpu, 
  ChevronRight,
  Network,
  FileText,
  MessageSquareCode,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Radio,
  FolderOpen,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { researchService } from '../services/api';
import { AppCard } from '../components/ui/AppCard';
import { AppMetricCard } from '../components/ui/AppMetricCard';
import { AppTable } from '../components/ui/AppTable';
import { AppBadge } from '../components/ui/AppBadge';
import { AppPageHeader } from '../components/ui/AppPageHeader';

interface CaseRecord {
  id: string;
  category: string;
  score: number;
  status: 'Open' | 'Investigating' | 'Escalated' | 'Resolved';
  timestamp: string;
  assignee: string;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [dbStats, setDbStats] = useState<any>(null);
  const [activeCases, setActiveCases] = useState<CaseRecord[]>([]);
  const [quickScanInput, setQuickScanInput] = useState<string>('');

  // Seeded realistic operational dataset
  const initialCases: CaseRecord[] = [
    { id: 'TXN-94721', category: 'UPI Payment Scam', score: 0.98, status: 'Escalated', timestamp: '13:41', assignee: 'Gowtham Sai' },
    { id: 'TXN-88413', category: 'Investment Fraud', score: 0.87, status: 'Investigating', timestamp: '13:32', assignee: 'Gowtham Sai' },
    { id: 'TXN-72091', category: 'Marketplace Scam', score: 0.54, status: 'Open', timestamp: '13:15', assignee: 'Unassigned' },
    { id: 'TXN-69112', category: 'Fake Job Scam', score: 0.94, status: 'Escalated', timestamp: '12:50', assignee: 'Security Ops Team' },
    { id: 'TXN-54210', category: 'KYC Suspension Fraud', score: 0.76, status: 'Resolved', timestamp: '12:12', assignee: 'Security Ops Team' },
  ];

  useEffect(() => {
    setActiveCases(initialCases);
    
    const fetchStats = async () => {
      try {
        const data = await researchService.getGraphDashboard();
        setDbStats(data);
      } catch (err) {
        console.error("Failed loading dashboard summary metrics:", err);
      }
    };
    fetchStats();

    // Telemetry update simulation loop
    const interval = setInterval(() => {
      const categories = ['UPI Payment Scam', 'Investment Fraud', 'Marketplace Scam', 'Fake Job Scam', 'KYC Suspension Fraud'];
      const statuses: ('Open' | 'Investigating' | 'Escalated' | 'Resolved')[] = ['Open', 'Investigating', 'Escalated', 'Resolved'];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const randomScore = Number((0.4 + Math.random() * 0.59).toFixed(2));
      const randTxnId = `TXN-${94000 + Math.floor(Math.random() * 999)}`;
      
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      setActiveCases(prev => [
        { id: randTxnId, category: randomCategory, score: randomScore, status: randomStatus, timestamp: timeStr, assignee: 'Unassigned' },
        ...prev.slice(0, 4)
      ]);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Time series trends data
  const trendData = [
    { name: '00:00', 'UPI Scam': 65, 'Investment Scam': 40, 'KYC Fraud': 30 },
    { name: '04:00', 'UPI Scam': 72, 'Investment Scam': 45, 'KYC Fraud': 35 },
    { name: '08:00', 'UPI Scam': 115, 'Investment Scam': 80, 'KYC Fraud': 55 },
    { name: '12:00', 'UPI Scam': 290, 'Investment Scam': 190, 'KYC Fraud': 110 },
    { name: '16:00', 'UPI Scam': 340, 'Investment Scam': 210, 'KYC Fraud': 140 },
    { name: '20:00', 'UPI Scam': 180, 'Investment Scam': 110, 'KYC Fraud': 85 },
  ];

  // Classifier accuracies data
  const accuracyData = [
    { channel: 'Lexical URL', Accuracy: 95.2 },
    { channel: 'NLP Lures', Accuracy: 93.8 },
    { channel: 'Graph Hop', Accuracy: 96.5 },
    { channel: 'Fused AI Meta', Accuracy: 99.7 },
  ];

  const quickActions = [
    { title: 'Threat Analyzer', path: '/console/analysis', icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-500/10' },
    { title: 'Investigation Room', path: '/console/investigations', icon: FolderOpen, color: 'text-[#00E5FF]', bg: 'bg-[#00E5FF]/10' },
    { title: 'Report Incident', path: '/console/reports', icon: FileText, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { title: 'AI Analyst', path: '/console/assistant', icon: MessageSquareCode, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  const handleQuickScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickScanInput.trim()) return;
    navigate(`/console/analysis?query=${encodeURIComponent(quickScanInput.trim())}`);
  };

  return (
    <div className="space-y-4 text-left font-sans">
      {/* Page Header */}
      <AppPageHeader 
        title="Mission Control Cockpit" 
        description="Real-time multi-modal scam prevention dashboard and live security threat monitoring."
        rightElement={
          <div className="flex items-center space-x-2 bg-[#1E293B]/60 px-3 py-1.5 rounded-xl border border-[#1E293B] text-[10px] text-slate-300">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="font-mono font-semibold">Security Operations / Active</span>
          </div>
        }
      />

      {/* Human-Made Central Instant Scam Verification Bar */}
      <AppCard className="p-4 bg-gradient-to-r from-[#0B1220] via-[#111827] to-[#0B1220] border-[#00E5FF]/30 shadow-lg">
        <form onSubmit={handleQuickScan} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center space-x-2 text-[#00E5FF]">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider hidden sm:inline">Instant Scanner</span>
          </div>
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Paste any link, message text, phone number, or UPI handle to check instantly..."
              value={quickScanInput}
              onChange={(e) => setQuickScanInput(e.target.value)}
              className="w-full bg-[#050811] border border-[#1E293B] rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/30 transition-all font-mono"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-slate-900 font-mono font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5 active:scale-95 flex-shrink-0"
          >
            <span>Scan Threat</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </AppCard>

      {/* Operations Warning Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3.5 border border-[#EF4444]/30 rounded-xl bg-[#EF4444]/10 text-xs text-[#EF4444] font-medium gap-3">
        <div className="flex items-center space-x-2.5">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span><strong>Threat Escalation Notice:</strong> High-risk activity spike detected in merchant-scam-address-24@ybl. 3 critical case escalations pending review.</span>
        </div>
        <button 
          onClick={() => navigate('/console/investigations')}
          className="text-[10px] font-mono font-bold text-[#00E5FF] hover:underline flex-shrink-0 whitespace-nowrap cursor-pointer flex items-center space-x-1"
        >
          <span>Explore Case Details</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Dense Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AppMetricCard 
          title="Active Cases" 
          value="1,248" 
          changeText="+14.2% daily" 
          changeType="positive"
          sparklineType="growth"
          icon={Activity}
          iconColor="text-cyan-400"
          insightText="Urgent review recommended"
        />
        <AppMetricCard 
          title="Escalated Cases" 
          value="142" 
          changeText="+5 cases" 
          changeType="negative"
          sparklineType="down"
          icon={ShieldAlert}
          iconColor="text-[#EF4444]"
          insightText="Awaiting supervisor sign-off"
        />
        <AppMetricCard 
          title="Resolution Rate" 
          value="94.2%" 
          changeText="Stable trend" 
          changeType="neutral"
          sparklineType="flat"
          icon={CheckCircle2}
          iconColor="text-emerald-400"
          insightText="Average SLA: 4.8 minutes"
        />
        <AppMetricCard 
          title="Detection Accuracy" 
          value="99.7%" 
          changeText="Ensemble Fused Meta" 
          changeType="positive"
          sparklineType="growth"
          icon={Cpu}
          iconColor="text-purple-400"
          insightText="Isotonic model calibration"
        />
      </div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Charts and Cases */}
        <div className="lg:col-span-8 space-y-4 flex flex-col">
          
          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Detection trends */}
            <AppCard className="p-4 space-y-2">
              <span className="font-sans font-bold text-[10px] text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Radio className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>24-Hour Threat Activity Trend</span>
              </span>
              <div className="h-[140px] w-full text-[8px] font-mono">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorFraud" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.4} />
                    <XAxis dataKey="name" stroke="#94A3B8" tick={{ fontSize: 8 }} />
                    <YAxis stroke="#94A3B8" tick={{ fontSize: 8 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0B1220', borderColor: '#1E293B', fontSize: 9 }} />
                    <Area type="monotone" dataKey="UPI Scam" stroke="#00E5FF" strokeWidth={1.5} fillOpacity={1} fill="url(#colorFraud)" />
                    <Area type="monotone" dataKey="Investment Scam" stroke="#F59E0B" strokeWidth={1} fillOpacity={0} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </AppCard>

            {/* Accuracies comparison */}
            <AppCard className="p-4 space-y-2">
              <span className="font-sans font-bold text-[10px] text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span>Detection Model Accuracies (%)</span>
              </span>
              <div className="h-[140px] w-full text-[8px] font-mono">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={accuracyData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.4} />
                    <XAxis dataKey="channel" stroke="#94A3B8" tick={{ fontSize: 8 }} />
                    <YAxis stroke="#94A3B8" domain={[80, 100]} tick={{ fontSize: 8 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0B1220', borderColor: '#1E293B', fontSize: 9 }} />
                    <Bar dataKey="Accuracy" fill="#00E5FF" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </AppCard>
          </div>

          {/* Active Cases Table */}
          <AppCard className="p-4 space-y-3">
            <div className="flex justify-between items-center border-b border-[#1E293B]/60 pb-2">
              <span className="font-sans font-bold text-[10px] text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Live Security Investigations Queue</span>
              </span>
              <span className="text-[9px] font-mono text-slate-500">Updating Live</span>
            </div>
            
            <AppTable 
              keyExtractor={(row) => row.id}
              columns={[
                {
                  header: "Case ID",
                  render: (row) => <span className="font-mono font-bold text-slate-200">{row.id}</span>
                },
                {
                  header: "Scam Category",
                  render: (row) => <span className="font-medium text-slate-300">{row.category}</span>
                },
                {
                  header: "Threat Level",
                  render: (row) => (
                    <div className="flex items-center space-x-1.5">
                      <span className={`w-2 h-2 rounded-full ${row.score >= 0.8 ? 'bg-[#EF4444]' : row.score >= 0.5 ? 'bg-[#F59E0B]' : 'bg-[#00E5FF]'}`} />
                      <span className="font-mono text-slate-300 font-bold">{(row.score * 100).toFixed(0)}%</span>
                    </div>
                  )
                },
                {
                  header: "Status",
                  render: (row) => (
                    <AppBadge color={
                      row.status === 'Resolved' ? 'success' : 
                      row.status === 'Escalated' ? 'danger' : 
                      row.status === 'Investigating' ? 'warning' : 'muted'
                    }>
                      {row.status}
                    </AppBadge>
                  )
                },
                {
                  header: "Assigned Analyst",
                  render: (row) => <span className="text-slate-400 font-mono text-[10px]">{row.assignee}</span>
                },
                {
                  header: "Actions",
                  render: (row) => (
                    <button 
                      onClick={() => navigate('/console/investigations')}
                      className="text-[10px] text-[#00E5FF] font-semibold hover:underline cursor-pointer flex items-center space-x-0.5"
                    >
                      <span>Investigate</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )
                }
              ]}
              data={activeCases}
            />
          </AppCard>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-4">
          {/* Quick Shortcuts */}
          <AppCard className="p-4 space-y-2">
            <span className="font-sans font-bold text-[10px] text-slate-400 uppercase tracking-wider block border-b border-[#1E293B]/60 pb-2">
              Quick Security Actions
            </span>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(action.path)}
                  className="flex items-center space-x-2 bg-[#0B1220] p-2.5 rounded-xl border border-[#1E293B] hover:border-[#00E5FF]/40 transition-all text-left cursor-pointer active:scale-95"
                >
                  <div className={`${action.bg} p-1.5 rounded-lg`}>
                    <action.icon className={`w-3.5 h-3.5 ${action.color}`} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-200 truncate">{action.title}</span>
                </button>
              ))}
            </div>
          </AppCard>

          {/* System Health */}
          <AppCard className="p-4 space-y-2.5">
            <span className="font-sans font-bold text-[10px] text-slate-400 uppercase tracking-wider block border-b border-[#1E293B]/60 pb-2">
              Engine Health & Clusters
            </span>
            <div className="space-y-2 pt-1 font-mono text-[9px]">
              <div className="flex justify-between items-center bg-[#0B1220] p-2 rounded-xl border border-[#1E293B]">
                <span className="text-slate-400">PostgreSQL Database</span>
                <span className="text-[#22C55E] font-bold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                  <span>ONLINE</span>
                </span>
              </div>
              <div className="flex justify-between items-center bg-[#0B1220] p-2 rounded-xl border border-[#1E293B]">
                <span className="text-slate-400">Neo4j Fraud Graph</span>
                <span className="text-[#22C55E] font-bold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                  <span>STABLE</span>
                </span>
              </div>
              <div className="flex justify-between items-center bg-[#0B1220] p-2 rounded-xl border border-[#1E293B]">
                <span className="text-slate-400">ML Inference Engine</span>
                <span className="text-[#22C55E] font-bold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                  <span>READY</span>
                </span>
              </div>
            </div>
          </AppCard>

          {/* Integration Status */}
          <AppCard className="p-4 space-y-3">
            <span className="font-sans font-bold text-[10px] text-slate-400 uppercase tracking-wider block border-b border-[#1E293B]/60 pb-2">
              Intelligence Database Records
            </span>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-[#0B1220] border border-[#1E293B] rounded-xl p-2.5">
                <span className="text-[8px] text-slate-500 uppercase block font-mono">Total Entity Nodes</span>
                <span className="text-xs font-bold font-mono text-slate-200">{dbStats?.node_count ?? 12480}</span>
              </div>
              <div className="bg-[#0B1220] border border-[#1E293B] rounded-xl p-2.5">
                <span className="text-[8px] text-slate-500 uppercase block font-mono">Graph Relationships</span>
                <span className="text-xs font-bold font-mono text-slate-200">{dbStats?.edge_count ?? 18451}</span>
              </div>
            </div>
          </AppCard>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
