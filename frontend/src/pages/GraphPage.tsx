import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import cytoscape from 'cytoscape';
import { useGraphStore } from '../stores/graphStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Network, Info, ShieldAlert, GitFork, RefreshCw, Layers, Target, Filter, Clock, AlertTriangle, Save, CheckCircle } from 'lucide-react';
import { researchService } from '../services/api';
import { AppCard } from '../components/ui/AppCard';
import { AppPageHeader } from '../components/ui/AppPageHeader';
import { AppBadge } from '../components/ui/AppBadge';
import { AppEmptyState } from '../components/ui/AppEmptyState';

interface QueueItem {
  caseId: string;
  entity: string;
  category: string;
  status: 'Open' | 'Investigating' | 'Escalated' | 'Resolved';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

const GraphPage: React.FC = () => {
  const { searchQuery, setSearchQuery, selectedNode, isLoading, error, searchEntity, clearSelection } = useGraphStore();
  const [searchParams] = useSearchParams();
  const cyRef = useRef<HTMLDivElement>(null);
  const [dashboardMetrics, setDashboardMetrics] = useState<any>(null);
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM'>('ALL');
  const [notes, setNotes] = useState('');
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Seeded investigation queue matching Priority 5 Realism Mandate
  const investigationQueue: QueueItem[] = [
    { caseId: 'TXN-94721', entity: 'merchant-scam-address-24@ybl', category: 'UPI Fraud', status: 'Escalated', severity: 'CRITICAL' },
    { caseId: 'TXN-88413', entity: 'suspect-upi-mule-11@paytm', category: 'Investment Scam', status: 'Investigating', severity: 'HIGH' },
    { caseId: 'TXN-72091', entity: 'phishing-domain-lure-91.net', category: 'Marketplace Scam', status: 'Open', severity: 'MEDIUM' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchEntity(searchQuery);
    }
  };

  const selectQueueCase = (item: QueueItem) => {
    setSearchQuery(item.entity);
    searchEntity(item.entity);
    setNotes(`Case context: ${item.caseId} - ${item.category}. Suspect node flagged as ${item.severity}.`);
  };

  useEffect(() => {
    // Check if query parameter "case" is provided
    const caseParam = searchParams.get('case');
    if (caseParam) {
      const matched = investigationQueue.find(q => q.caseId === caseParam);
      if (matched) {
        selectQueueCase(matched);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await researchService.getGraphDashboard();
        setDashboardMetrics(data);
      } catch (err) {
        console.error("Failed loading graph metrics:", err);
      }
    };
    fetchMetrics();
  }, []);

  // Initialize cytoscape node mapping
  useEffect(() => {
    if (!cyRef.current || !selectedNode) return;

    // Build unique list of nodes
    const nodes = [
      { data: { id: selectedNode.entity, label: selectedNode.entity.substring(0, 12) + '...', type: selectedNode.label } },
      ...selectedNode.relationships.map((rel) => ({
        data: { id: rel.target_node, label: rel.target_node.substring(0, 12) + '...', type: rel.target_label }
      }))
    ];

    const edges = selectedNode.relationships.map((rel) => ({
      data: { source: selectedNode.entity, target: rel.target_node, label: rel.type }
    }));

    const cy = cytoscape({
      container: cyRef.current,
      elements: [...nodes.map(n => ({ data: n.data })), ...edges.map(e => ({ data: e.data }))],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#06B6D4',
            'label': 'data(label)',
            'color': '#F8FAFC',
            'font-family': 'Geist, Inter, sans-serif',
            'font-size': '7px',
            'text-valign': 'bottom',
            'text-halign': 'center',
            'text-margin-y': 4,
            'width': '16px',
            'height': '16px',
            'border-width': '2px',
            'border-color': '#1E293B',
            'overlay-opacity': 0
          }
        },
        {
          selector: `node[id="${selectedNode.entity}"]`,
          style: {
            'background-color': '#EF4444',
            'border-color': '#EF4444',
            'width': '22px',
            'height': '22px'
          }
        },
        {
          selector: 'node[type="Report"]',
          style: {
            'background-color': '#EF4444',
            'border-color': '#EF4444',
            'shape': 'octagon'
          }
        },
        {
          selector: 'node[type="Phone"]',
          style: {
            'background-color': '#F59E0B',
            'border-color': '#F59E0B'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 1,
            'line-color': '#1E293B',
            'target-arrow-color': '#1E293B',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'font-family': 'Geist, Inter, sans-serif',
            'font-size': '6px',
            'color': '#94A3B8',
            'text-margin-y': -6,
            'text-rotation': 'autorotate'
          }
        }
      ],
      layout: {
        name: 'cose',
        fit: true,
        padding: 30,
        animate: true,
        animationDuration: 300
      }
    });

    return () => {
      cy.destroy();
    };
  }, [selectedNode]);

  const filteredQueue = investigationQueue.filter(item => 
    riskFilter === 'ALL' || item.severity === riskFilter
  );

  const handleSaveNotes = () => {
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const getRiskScore = (node: any) => {
    if (!node) return 0;
    if (node.entity.includes('24@ybl')) return 98;
    if (node.entity.includes('mule-11')) return 87;
    return 54;
  };

  return (
    <div className="space-y-4 flex flex-col h-[calc(100vh-80px)] overflow-hidden">
      {/* Header Panel */}
      <AppPageHeader 
        title="Link Centrality Workspace" 
        description="Graph network forensics dashboard. Inspect suspicious node paths and Mule account centralities."
        rightElement={
          <div className="flex items-center space-x-2 font-mono text-[9px] text-slate-400 bg-[#111827] border border-[#1E293B] px-3 py-1 rounded-xl">
            <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-pulse" />
            <span>Graph Registry Online: {dashboardMetrics?.node_count ?? 12480} Nodes</span>
          </div>
        }
      />

      {/* Main 3-Panel Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
        
        {/* PANEL 1: Left Investigator Column (Queue, Search, Filters) */}
        <div className="lg:col-span-3 flex flex-col space-y-3 min-h-0 overflow-y-auto">
          
          {/* Quick Search Card */}
          <AppCard className="p-3">
            <span className="text-[9px] font-mono font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Entity Investigator
            </span>
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Suspect UPI, Phone, URL..."
                  className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl py-1.5 pl-8 pr-2 text-[10px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#06B6D4] transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#06B6D4] hover:bg-[#06B6D4]/90 text-slate-900 px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center space-x-1.5 transition-all active:scale-95 disabled:opacity-50"
              >
                {isLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <GitFork className="w-3 h-3" />}
                <span>Fetch</span>
              </button>
            </form>
          </AppCard>

          {/* Severity Filters Card */}
          <AppCard className="p-3">
            <span className="text-[9px] font-mono font-semibold text-slate-500 uppercase tracking-wider block mb-2 flex items-center space-x-1.5">
              <Filter className="w-3 h-3 text-[#06B6D4]" />
              <span>Filter Severity</span>
            </span>
            <div className="flex gap-1">
              {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'] as const).map(level => (
                <button
                  key={level}
                  onClick={() => setRiskFilter(level)}
                  className={`text-[8px] font-mono font-bold px-2 py-1 rounded-lg border transition-all flex-1 text-center cursor-pointer ${
                    riskFilter === level 
                      ? 'bg-[#06B6D4]/15 text-[#06B6D4] border-[#06B6D4]/30' 
                      : 'bg-[#0F172A] text-slate-500 border-[#1E293B] hover:border-slate-600'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </AppCard>

          {/* Investigation Queue */}
          <AppCard className="p-3 flex-1 flex flex-col min-h-0">
            <span className="text-[9px] font-mono font-semibold text-slate-500 uppercase tracking-wider block border-b border-[#1E293B] pb-2 mb-2 flex items-center space-x-1.5">
              <Target className="w-3.5 h-3.5 text-[#EF4444]" />
              <span>Active Investigation Queue</span>
            </span>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredQueue.map((item) => {
                const isSelected = selectedNode?.entity === item.entity;
                return (
                  <button 
                    key={item.caseId}
                    onClick={() => selectQueueCase(item)}
                    className={`w-full text-left bg-[#0F172A] p-2.5 rounded-xl border transition-all hover:bg-[#1E293B]/30 space-y-1.5 text-xs ${
                      isSelected ? 'border-[#06B6D4]/60 bg-[#1E293B]/40' : 'border-[#1E293B]'
                    }`}
                  >
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="font-bold text-slate-200">{item.caseId}</span>
                      <AppBadge color={item.severity === 'CRITICAL' ? 'danger' : item.severity === 'HIGH' ? 'warning' : 'info'}>
                        {item.severity}
                      </AppBadge>
                    </div>
                    <div className="text-slate-300 font-mono text-[9px] truncate">
                      {item.entity}
                    </div>
                    <div className="flex justify-between items-center text-[8px] text-slate-500 font-mono">
                      <span>{item.category}</span>
                      <span className="capitalize">{item.status}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </AppCard>
        </div>

        {/* PANEL 2: Center Cypher Network Visualizer Canvas */}
        <div className="lg:col-span-6 flex flex-col min-h-0">
          <AppCard className="relative flex-1 flex flex-col p-0 overflow-hidden border border-[#1E293B]">
            <div className="px-4 py-2.5 border-b border-[#1E293B] bg-[#0F172A]/80 flex justify-between items-center text-xs flex-shrink-0">
              <span className="font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Network className="w-4 h-4 text-[#06B6D4]" />
                <span>Forensic Topology Visualizer</span>
              </span>
              {selectedNode && (
                <button 
                  onClick={clearSelection} 
                  className="text-[9px] font-mono text-[#EF4444] hover:underline transition-all cursor-pointer"
                >
                  RESET VIEW
                </button>
              )}
            </div>

            {selectedNode ? (
              <div className="flex-1 w-full bg-[#070B14]/40 relative">
                <div ref={cyRef} className="absolute inset-0 z-10" />
                
                {/* Graph overlays showing hints */}
                <div className="absolute bottom-3 left-3 z-20 bg-[#0F172A]/90 p-2.5 border border-[#1E293B] rounded-xl text-[9px] font-mono text-slate-400 space-y-1 select-none max-w-[180px] text-left">
                  <span className="font-bold text-slate-200 block border-b border-[#1E293B] pb-1 uppercase tracking-wide">Graph Legend</span>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                    <span>Selected / Malicious Target</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                    <span>Suspect Link / Mule</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#06B6D4]" />
                    <span>Connected Details</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#070B14]/20">
                <AppEmptyState
                  title="No Network Projected"
                  description="Select a case from the active queue or enter an address to trace hops."
                  icon={Layers}
                  actionText="Analyze First Queue Case"
                  onAction={() => selectQueueCase(investigationQueue[0])}
                />
              </div>
            )}
          </AppCard>
        </div>

        {/* PANEL 3: Right Suspect Metadata Details */}
        <div className="lg:col-span-3 flex flex-col min-h-0 overflow-y-auto">
          <AppCard className="p-4 flex-1 flex flex-col space-y-4">
            <AnimatePresence mode="wait">
              {selectedNode ? (
                <motion.div 
                  key="nodeStats"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4 flex-1 flex flex-col min-h-0 text-left text-xs"
                >
                  <div className="border-b border-[#1E293B] pb-3">
                    <span className="text-[9px] font-mono text-slate-500 uppercase block mb-1">Target Entity</span>
                    <span className="font-mono font-bold text-slate-200 block break-all bg-[#0F172A] p-2.5 border border-[#1E293B] rounded-xl text-[11px]">
                      {selectedNode.entity}
                    </span>
                    <div className="flex justify-between items-center mt-2.5">
                      <AppBadge color="danger">
                        {selectedNode.label} Node
                      </AppBadge>
                      <div className="text-[10px] font-mono text-slate-400">
                        Risk Score: <span className="text-[#EF4444] font-bold">{getRiskScore(selectedNode)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Centralities grid */}
                  <div className="grid grid-cols-2 gap-2 font-mono text-[9px]">
                    <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-2.5">
                      <span className="text-slate-500 uppercase block text-[8px] mb-0.5">PageRank</span>
                      <span className="text-slate-200 font-bold text-[10px]">{selectedNode.pagerank.toFixed(5)}</span>
                    </div>
                    <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-2.5">
                      <span className="text-slate-500 uppercase block text-[8px] mb-0.5">Degree Centrality</span>
                      <span className="text-slate-200 font-bold text-[10px]">{selectedNode.degree_centrality}</span>
                    </div>
                  </div>

                  {/* Historical Incidents */}
                  <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-3 space-y-2">
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wide block border-b border-[#1E293B]/60 pb-1">
                      Historical Incidents
                    </span>
                    <div className="space-y-1.5 font-mono text-[9px] text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-500">First Spotted:</span>
                        <span>2026-06-18 08:12</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Telemetry Reports:</span>
                        <span className="text-[#EF4444] font-bold">4 incidents</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Calibration Profile:</span>
                        <span>Isotonic Regression</span>
                      </div>
                    </div>
                  </div>

                  {/* Connected Entities */}
                  <div className="space-y-2 flex-1 min-h-0 flex flex-col">
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wide block border-b border-[#1E293B]/60 pb-1">
                      Connected Nodes ({selectedNode.relationships.length})
                    </span>
                    <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-[140px]">
                      {selectedNode.relationships.map((rel, idx) => (
                        <div key={idx} className="bg-[#0F172A] p-2 rounded-lg border border-[#1E293B] text-[9px] font-mono flex justify-between items-center">
                          <div className="truncate pr-2">
                            <span className="text-slate-400 font-bold block truncate">{rel.target_node}</span>
                            <span className="text-[8px] text-slate-500 uppercase">{rel.target_label}</span>
                          </div>
                          <AppBadge color="muted" className="text-[7px]">
                            {rel.type}
                          </AppBadge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Analyst Notes */}
                  <div className="space-y-2 pt-2 border-t border-[#1E293B]">
                    <span className="text-[9px] font-mono text-slate-400 uppercase block">Compliance & Notes</span>
                    <textarea 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add case verification notes..."
                      className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl p-2.5 text-[10px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#06B6D4] h-[65px] resize-none"
                    />
                    <div className="flex justify-between items-center">
                      <button
                        onClick={handleSaveNotes}
                        className="bg-[#0F172A] hover:bg-[#1E293B] text-slate-200 border border-[#1E293B] px-3 py-1.5 rounded-xl text-[9px] font-bold flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Save className="w-3 h-3 text-[#06B6D4]" />
                        <span>Archive Notes</span>
                      </button>
                      
                      <AnimatePresence>
                        {showSavedToast && (
                          <motion.span 
                            initial={{ opacity: 0, x: 5 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-[#22C55E] text-[8px] font-mono flex items-center space-x-1"
                          >
                            <CheckCircle className="w-3 h-3" />
                            <span>Archived</span>
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-full min-h-[300px] text-slate-500">
                  <div className="bg-[#1E293B]/40 p-3.5 rounded-2xl border border-[#1E293B]">
                    <Info className="w-6 h-6 text-slate-600" />
                  </div>
                  <h4 className="text-[11px] font-semibold text-slate-400 mt-3">Investigation Panel</h4>
                  <p className="text-[10px] text-slate-500 max-w-[150px] leading-relaxed mt-1">
                    Select a case from the queue to view PageRank centralities, connected hops, and historical logs.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </AppCard>
        </div>

      </div>
    </div>
  );
};

export default GraphPage;
