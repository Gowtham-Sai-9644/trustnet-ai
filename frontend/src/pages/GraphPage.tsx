import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import cytoscape from 'cytoscape';
import { useGraphStore } from '../stores/graphStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Network, Info, ShieldAlert, GitFork, RefreshCw, Layers, 
  Target, Filter, Clock, AlertTriangle, Save, CheckCircle, Play, Pause, 
  Image, Download, Zap, Radio, Sliders, ArrowRight
} from 'lucide-react';
import { researchService } from '../services/api';
import { AppCard } from '../components/ui/AppCard';
import { AppPageHeader } from '../components/ui/AppPageHeader';
import { AppBadge } from '../components/ui/AppBadge';
import { AppEmptyState } from '../components/ui/AppEmptyState';
import { CinematicBackground } from '../components/ui/CinematicBackground';

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
  const cyInstanceRef = useRef<cytoscape.Core | null>(null);
  const [dashboardMetrics, setDashboardMetrics] = useState<any>(null);
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM'>('ALL');
  const [notes, setNotes] = useState('');
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Advanced V2 Playback Engine
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoveryStep, setDiscoveryStep] = useState(0);
  const [selectedPathNodes, setSelectedPathNodes] = useState<string[]>([]);
  const [isPlayingReplay, setIsPlayingReplay] = useState(false);
  const [replayStep, setReplayStep] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 5>(1); // Speed multiplier

  // Chronological timeline step mappings
  const timelineSteps = [
    { label: 'Message Ingested', time: '13:41:00', desc: 'Suspect threat message text received by gateway.' },
    { label: 'Phone Identified', time: '13:41:12', desc: 'Extracted phone coordinates linked to vishing databases.' },
    { label: 'UPI Linked', time: '13:41:30', desc: 'Resolved active UPI address transfer logs.' },
    { label: 'Mule Matched', time: '13:42:02', desc: 'Neo4j link analysis matched high-degree centralities.' },
    { label: 'Risk Calibrated', time: '13:43:10', desc: 'Isotonic Meta-Fusion stack resolved score index.' },
    { label: 'Case Escalated', time: '13:45:00', desc: 'Dispatched incident report to active SOC queue.' }
  ];

  // Seeded investigation queue
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
    setSelectedPathNodes([]);
    setReplayStep(0);
  };

  useEffect(() => {
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

  // Initialize cytoscape node mapping with V2 styling
  useEffect(() => {
    if (!cyRef.current || !selectedNode) return;

    const nodes = [
      { data: { id: selectedNode.entity, label: selectedNode.entity.substring(0, 10) + '...', type: selectedNode.label, originalLabel: selectedNode.entity } },
      ...selectedNode.relationships.map((rel) => ({
        data: { id: rel.target_node, label: rel.target_node.substring(0, 10) + '...', type: rel.target_label, originalLabel: rel.target_node }
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
            'background-color': '#00E5FF',
            'label': 'data(label)',
            'color': '#F8FAFC',
            'font-family': 'Geist Mono, Geist, Inter, sans-serif',
            'font-size': '6px',
            'text-valign': 'bottom',
            'text-halign': 'center',
            'text-margin-y': 4,
            'width': '14px',
            'height': '14px',
            'border-width': '1.5px',
            'border-color': '#1E293B',
            'overlay-opacity': 0,
            'transition-property': 'background-color, border-color, border-width, width, height',
            'transition-duration': 0.35
          }
        },
        {
          selector: `node[id="${selectedNode.entity}"]`,
          style: {
            'background-color': '#EF4444',
            'border-color': '#EF4444',
            'width': '18px',
            'height': '18px'
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
            'font-size': '5px',
            'color': '#94A3B8',
            'text-margin-y': -5,
            'text-rotation': 'autorotate',
            'transition-property': 'line-color, width',
            'transition-duration': 0.35
          }
        },
        {
          selector: '.highlighted',
          style: {
            'background-color': '#00E5FF',
            'line-color': '#00E5FF',
            'target-arrow-color': '#00E5FF',
            'width': 2,
            'border-color': '#00E5FF'
          }
        },
        {
          selector: '.propagated',
          style: {
            'background-color': '#EF4444',
            'border-color': '#EF4444',
            'border-width': '4px',
            'width': '18px',
            'height': '18px'
          }
        },
        {
          selector: '.pulse-halo',
          style: {
            'border-color': '#EF4444',
            'border-width': '4px',
            'width': '22px',
            'height': '22px'
          }
        },
        {
          selector: '.clustered',
          style: {
            'border-color': '#6366F1',
            'border-width': '2.5px'
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

    // Double tap to expand node
    cy.on('doubletap', 'node', (evt) => {
      const node = evt.target;
      const nodeId = node.id();
      
      const extraNodes = [
        { data: { id: `${nodeId}-hop1`, label: 'Mule-Link-A', type: 'Phone' } },
        { data: { id: `${nodeId}-hop2`, label: 'Mule-Link-B', type: 'URL' } }
      ];
      
      const extraEdges = [
        { data: { source: nodeId, target: `${nodeId}-hop1`, label: 'HOP_ROUTE' } },
        { data: { source: nodeId, target: `${nodeId}-hop2`, label: 'HOP_LINK' } }
      ];

      extraNodes.forEach(n => {
        if (cy.getElementById(n.data.id).length === 0) cy.add({ group: 'nodes', data: n.data });
      });
      extraEdges.forEach(e => {
        if (cy.edges(`[source="${e.data.source}"][target="${e.data.target}"]`).length === 0) {
          cy.add({ group: 'edges', data: e.data });
        }
      });

      cy.layout({ name: 'cose', animate: true, fit: true }).run();
    });

    // Pathfinder node selector
    cy.on('tap', 'node', (evt) => {
      const nodeId = evt.target.id();
      setSelectedPathNodes(prev => {
        if (prev.includes(nodeId)) {
          return prev.filter(id => id !== nodeId);
        }
        if (prev.length >= 2) {
          return [prev[1], nodeId];
        }
        return [...prev, nodeId];
      });
    });

    cyInstanceRef.current = cy;

    return () => {
      cy.destroy();
      cyInstanceRef.current = null;
    };
  }, [selectedNode]);

  // Periodic halo pulse animation loop
  useEffect(() => {
    const cy = cyInstanceRef.current;
    if (!cy) return;

    const interval = setInterval(() => {
      cy.elements('.propagated, node[type="ScamEntity"]').toggleClass('pulse-halo');
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedNode]);

  // Dijkstra pathfinder execution
  useEffect(() => {
    const cy = cyInstanceRef.current;
    if (!cy || selectedPathNodes.length < 2) return;

    cy.elements().removeClass('highlighted');
    const source = cy.getElementById(selectedPathNodes[0]);
    const target = cy.getElementById(selectedPathNodes[1]);

    if (source.length && target.length) {
      const dijkstra = cy.elements().dijkstra({ root: source });
      const path = dijkstra.pathTo(target);
      path.addClass('highlighted');
    }
  }, [selectedPathNodes]);

  // V2 Signature Fraud Ring Discovery Loop (6 Steps)
  const runFraudRingDiscovery = () => {
    const cy = cyInstanceRef.current;
    if (!cy || !selectedNode || isDiscovering) return;

    setIsDiscovering(true);
    setDiscoveryStep(1);

    // Step 1: Initial Scan (show only seed node)
    cy.elements().style('display', 'none');
    const root = cy.getElementById(selectedNode.entity);
    root.style('display', 'element');

    const intervalTime = 1500;

    // Step 2: Entity Discovery (fade in direct nodes)
    setTimeout(() => {
      setDiscoveryStep(2);
      root.neighborhood().style('display', 'element');
    }, intervalTime);

    // Step 3: Graph Expansion (show all hops)
    setTimeout(() => {
      setDiscoveryStep(3);
      cy.elements().style('display', 'element');
    }, intervalTime * 2);

    // Step 4: Relationship Detection (Highlight paths)
    setTimeout(() => {
      setDiscoveryStep(4);
      cy.edges().addClass('highlighted');
    }, intervalTime * 3);

    // Step 5: Risk Propagation (glow nodes red)
    setTimeout(() => {
      setDiscoveryStep(5);
      cy.nodes().addClass('propagated');
    }, intervalTime * 4);

    // Step 6: Cluster Highlight / Fraud Ring Exposed
    setTimeout(() => {
      setDiscoveryStep(6);
      cy.nodes().addClass('clustered');
    }, intervalTime * 5);

    // Reset sequence after 10 seconds
    setTimeout(() => {
      setIsDiscovering(false);
      setDiscoveryStep(0);
      cy.elements().removeClass('highlighted').removeClass('propagated').removeClass('clustered');
      cy.elements().style('display', 'element');
    }, intervalTime * 7);
  };

  // Replay timeline player effect
  useEffect(() => {
    const cy = cyInstanceRef.current;
    if (!cy || !isPlayingReplay || !selectedNode) return;

    const baseInterval = 3000;
    const intervalTime = baseInterval / playbackSpeed;

    const interval = setInterval(() => {
      setReplayStep(prev => {
        const next = (prev + 1) % timelineSteps.length;
        
        // Dynamic visibility logic based on step indices
        cy.elements().style('display', 'none');
        cy.getElementById(selectedNode.entity).style('display', 'element');
        
        if (next >= 1) {
          // Show phone
          cy.elements('node[type="Phone"]').style('display', 'element');
          cy.edges(`[target="phone"]`).style('display', 'element');
        }
        if (next >= 2) {
          // Show UPI
          cy.elements('node[type="UPI"]').style('display', 'element');
          cy.edges(`[target="upi1"]`).style('display', 'element');
        }
        if (next >= 3) {
          // Show complete network
          cy.elements().style('display', 'element');
        }
        if (next >= 4) {
          cy.nodes().addClass('propagated');
        } else {
          cy.nodes().removeClass('propagated');
        }

        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isPlayingReplay, selectedNode, playbackSpeed]);

  const filteredQueue = investigationQueue.filter(item => 
    riskFilter === 'ALL' || item.severity === riskFilter
  );

  const handleSaveNotes = () => {
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const handleExportPNG = () => {
    const cy = cyInstanceRef.current;
    if (!cy) return;
    const pngBase64 = cy.png({ full: true, bg: '#050811' });
    const link = document.createElement('a');
    link.href = pngBase64;
    link.download = `TrustNet-Forensic-${selectedNode?.entity || 'graph'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const cy = cyInstanceRef.current;
    if (!cy) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cy.json()));
    const link = document.createElement('a');
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `TrustNet-Export-${selectedNode?.entity || 'graph'}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRiskScore = (node: any) => {
    if (!node) return 0;
    if (node.entity.includes('24@ybl')) return 98;
    if (node.entity.includes('mule-11')) return 87;
    return 54;
  };

  const discoveryStepsLabels = [
    'INITIAL SCAN: Ingesting core UPI/phone signature',
    'ENTITY DISCOVERY: Fetching adjacent coordinates',
    'GRAPH EXPANSION: Branching 2nd-order hop registers',
    'RELATIONSHIP DETECTION: Tracing transactional loops',
    'RISK PROPAGATION: Projecting cascade centralities',
    'FRAUD RING EXPOSURE: Mule ring isolated successfully'
  ];

  return (
    <div className="space-y-4 flex flex-col h-[calc(100vh-80px)] overflow-hidden text-left relative z-10">
      
      {/* Background grid canvas layer */}
      <CinematicBackground />

      {/* Header Panel */}
      <AppPageHeader 
        title="Graph Intelligence Workspace" 
        description="Graph network forensics dashboard. Inspect suspicious node paths and Mule account centralities."
        rightElement={
          <div className="flex items-center space-x-2 font-mono text-[9px] text-slate-400 bg-[#111827] border border-[#1E293B] px-3 py-1 rounded-xl">
            <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-pulse" />
            <span>Graph Registry Active: {dashboardMetrics?.node_count ?? 12480} Nodes</span>
          </div>
        }
      />

      {/* Main 3-Panel Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0 relative z-10">
        
        {/* PANEL 1: Left Investigator Column */}
        <div className="lg:col-span-3 flex flex-col space-y-3 min-h-0 overflow-y-auto">
          {/* Quick Search Card */}
          <AppCard className="p-3 bg-[#111827]/85 backdrop-blur-md">
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
                  placeholder="UPI, Phone, URL..."
                  className="w-full bg-[#0B1220] border border-[#1E293B] rounded-xl py-1.5 pl-8 pr-2 text-[10px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#00E5FF] transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-slate-900 px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center space-x-1.5 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <GitFork className="w-3.5 h-3.5" />}
                <span>Fetch</span>
              </button>
            </form>
          </AppCard>

          {/* Severity Filters Card */}
          <AppCard className="p-3 bg-[#111827]/85 backdrop-blur-md">
            <span className="text-[9px] font-mono font-semibold text-slate-500 uppercase tracking-wider block mb-2 flex items-center space-x-1.5">
              <Filter className="w-3 h-3 text-[#00E5FF]" />
              <span>Filter Severity</span>
            </span>
            <div className="flex gap-1">
              {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'] as const).map(level => (
                <button
                  key={level}
                  onClick={() => setRiskFilter(level)}
                  className={`text-[8px] font-mono font-bold px-2 py-1 rounded-lg border transition-all flex-1 text-center cursor-pointer ${
                    riskFilter === level 
                      ? 'bg-[#00E5FF]/15 text-[#00E5FF] border-[#00E5FF]/30' 
                      : 'bg-[#0B1220] text-slate-500 border-[#1E293B] hover:border-slate-600'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </AppCard>

          {/* Investigation Queue */}
          <AppCard className="p-3 flex-1 flex flex-col min-h-0 bg-[#111827]/85 backdrop-blur-md">
            <span className="text-[9px] font-mono font-semibold text-slate-500 uppercase tracking-wider block border-b border-[#1E293B] pb-2 mb-2 flex items-center space-x-1.5">
              <Target className="w-3.5 h-3.5 text-[#EF4444]" />
              <span>Active Case Queue</span>
            </span>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredQueue.map((item) => {
                const isSelected = selectedNode?.entity === item.entity;
                return (
                  <button 
                    key={item.caseId}
                    onClick={() => selectQueueCase(item)}
                    className={`w-full text-left bg-[#0B1220] p-2.5 rounded-xl border transition-all hover:bg-[#1E293B]/30 space-y-1.5 text-xs cursor-pointer ${
                      isSelected ? 'border-[#00E5FF]/60 bg-[#1E293B]/40' : 'border-[#1E293B]'
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

        {/* PANEL 2: Center visual graph visualizer canvas */}
        <div className="lg:col-span-6 flex flex-col min-h-0 space-y-3">
          {/* Diagnostic Controls Toolbar */}
          <AppCard className="p-3 flex flex-wrap gap-2 items-center justify-between bg-[#111827]/85 backdrop-blur-md">
            <div className="flex space-x-2">
              <button 
                onClick={runFraudRingDiscovery}
                disabled={isDiscovering || !selectedNode}
                className="bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 border border-[#00E5FF]/30 text-[#00E5FF] px-4 py-1.5 rounded-xl text-[10px] font-bold flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                title="Run Signature Fraud Ring Discovery sequence"
              >
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>Run Discovery Mode</span>
              </button>
            </div>

            <div className="flex space-x-2">
              <button 
                onClick={handleExportPNG}
                className="bg-[#0B1220] hover:bg-[#1E293B] border border-[#1E293B] text-slate-200 p-2 rounded-xl text-[10px] font-bold cursor-pointer"
                title="Export Snapshot Image"
              >
                <Image className="w-3.5 h-3.5 text-emerald-400" />
              </button>
              <button 
                onClick={handleExportJSON}
                className="bg-[#0B1220] hover:bg-[#1E293B] border border-[#1E293B] text-slate-200 p-2 rounded-xl text-[10px] font-bold cursor-pointer"
                title="Export Graph JSON"
              >
                <Download className="w-3.5 h-3.5 text-[#00E5FF]" />
              </button>
            </div>
          </AppCard>

          <AppCard className="relative flex-1 flex flex-col p-0 overflow-hidden border border-[#1E293B] bg-[#111827]/80 backdrop-blur-md">
            <div className="px-4 py-2.5 border-b border-[#1E293B] bg-[#0B1220]/80 flex justify-between items-center text-xs flex-shrink-0">
              <span className="font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Network className="w-4 h-4 text-[#00E5FF]" />
                <span>Forensic Topology Visualizer</span>
              </span>
              <div className="flex items-center space-x-3 text-[9px] font-mono">
                {selectedPathNodes.length > 0 && (
                  <span className="text-amber-400">Pathfinder: {selectedPathNodes.join(' ➔ ')}</span>
                )}
                {selectedNode && (
                  <button 
                    onClick={clearSelection} 
                    className="text-[#EF4444] hover:underline transition-all cursor-pointer font-bold"
                  >
                    RESET VIEW
                  </button>
                )}
              </div>
            </div>

            {selectedNode ? (
              <div className="flex-1 w-full bg-[#050811]/20 relative">
                <div ref={cyRef} className="absolute inset-0 z-10" />
                
                {/* Discovery Overlay status block */}
                {isDiscovering && (
                  <div className="absolute top-3 right-3 z-20 bg-[#EF4444]/90 text-slate-100 p-3 rounded-xl border border-[#EF4444]/30 shadow-2xl text-[9px] font-mono space-y-1.5 max-w-[240px]">
                    <span className="font-bold border-b border-slate-100/30 pb-1 block uppercase tracking-wider">Discovery Sequence</span>
                    <p className="text-[8px] leading-snug">{discoveryStepsLabels[discoveryStep - 1]}</p>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5, 6].map(s => (
                        <div 
                          key={s} 
                          className={`w-2 h-2 rounded-full ${discoveryStep >= s ? 'bg-slate-100' : 'bg-slate-100/30'}`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Graph overlay legend */}
                <div className="absolute bottom-3 left-3 z-20 bg-[#0B1220]/90 p-2.5 border border-[#1E293B] rounded-xl text-[9px] font-mono text-slate-400 space-y-1 select-none max-w-[180px]">
                  <span className="font-bold text-slate-200 block border-b border-[#1E293B] pb-1 uppercase tracking-wide">Topology Code</span>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                    <span>Scam Target / Ingest</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                    <span>Mule Contact / Phone</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#00E5FF]" />
                    <span>Associated Hops</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#050811]/10">
                <AppEmptyState
                  title="No Forensic Topology Projected"
                  description="Select a case from the active queue or enter an address to trace hops."
                  icon={Layers}
                  actionText="Select Priority Case"
                  onAction={() => selectQueueCase(investigationQueue[0])}
                />
              </div>
            )}
          </AppCard>

          {/* Timeline Replay Control Bar & Scrubber */}
          {selectedNode && (
            <AppCard className="p-3.5 flex flex-col space-y-3 bg-[#0B1220]/90 backdrop-blur-md border border-[#1E293B]">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setIsPlayingReplay(!isPlayingReplay)}
                    className="bg-[#111827] border border-[#1E293B] p-2 rounded-xl text-[#00E5FF] hover:bg-[#1E293B] cursor-pointer"
                  >
                    {isPlayingReplay ? <Pause className="w-3.5 h-3.5 fill-[#00E5FF]" /> : <Play className="w-3.5 h-3.5 fill-[#00E5FF]" />}
                  </button>
                  <div className="text-left font-mono text-[9px]">
                    <span className="text-slate-400 block uppercase font-bold">Chronological Replay Scrubber</span>
                    <span className="text-slate-500">Replaying target entity link sequence</span>
                  </div>
                </div>

                {/* Playback speed selector */}
                <div className="flex items-center space-x-1 bg-[#111827] p-1 rounded-lg border border-[#1E293B] font-mono text-[8px] text-slate-400">
                  <span className="px-1.5 font-bold uppercase text-[7px] text-slate-500">Speed:</span>
                  {([1, 2, 5] as const).map(speed => (
                    <button
                      key={speed}
                      onClick={() => setPlaybackSpeed(speed)}
                      className={`px-1.5 py-0.5 rounded cursor-pointer ${playbackSpeed === speed ? 'bg-[#00E5FF]/20 text-[#00E5FF] font-bold' : ''}`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrubber slider bar */}
              <div className="flex items-center space-x-3 w-full font-mono text-[8px] text-slate-500">
                <span>0% START</span>
                <input 
                  type="range"
                  min={0}
                  max={timelineSteps.length - 1}
                  value={replayStep}
                  onChange={(e) => setReplayStep(Number(e.target.value))}
                  className="flex-1 accent-[#00E5FF] cursor-pointer bg-[#111827] h-1 rounded-full border-none focus:outline-none"
                />
                <span>100% DISPATCHED</span>
              </div>

              {/* Display text of active scrubber step */}
              <div className="bg-[#111827]/40 border border-[#1E293B]/60 p-2.5 rounded-lg text-[9px] font-mono text-left flex justify-between items-center">
                <div>
                  <span className="text-slate-200 font-bold block">{timelineSteps[replayStep].label} ({timelineSteps[replayStep].time})</span>
                  <span className="text-slate-500 text-[8px] leading-normal">{timelineSteps[replayStep].desc}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#00E5FF] flex-shrink-0 ml-3" />
              </div>
            </AppCard>
          )}
        </div>

        {/* PANEL 3: Right Suspect Metadata Details */}
        <div className="lg:col-span-3 flex flex-col min-h-0 overflow-y-auto">
          <AppCard className="p-4 flex-1 flex flex-col space-y-4 bg-[#111827]/85 backdrop-blur-md">
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
                    <span className="font-mono font-bold text-slate-200 block break-all bg-[#0B1220] p-2.5 border border-[#1E293B] rounded-xl text-[11px]">
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
                    <div className="bg-[#0B1220] border border-[#1E293B] rounded-xl p-2.5">
                      <span className="text-slate-500 uppercase block text-[8px] mb-0.5">PageRank</span>
                      <span className="text-slate-200 font-bold text-[10px]">{selectedNode.pagerank.toFixed(5)}</span>
                    </div>
                    <div className="bg-[#0B1220] border border-[#1E293B] rounded-xl p-2.5">
                      <span className="text-slate-500 uppercase block text-[8px] mb-0.5">Degree Centrality</span>
                      <span className="text-slate-200 font-bold text-[10px]">{selectedNode.degree_centrality}</span>
                    </div>
                  </div>

                  {/* Historical Incidents */}
                  <div className="bg-[#0B1220] border border-[#1E293B] rounded-xl p-3 space-y-2">
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
                    </div>
                  </div>

                  {/* Connected Entities */}
                  <div className="space-y-2 flex-1 min-h-0 flex flex-col">
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wide block border-b border-[#1E293B]/60 pb-1">
                      Connected Nodes ({selectedNode.relationships.length})
                    </span>
                    <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-[120px]">
                      {selectedNode.relationships.map((rel, idx) => (
                        <div key={idx} className="bg-[#0B1220] p-2 rounded-lg border border-[#1E293B] text-[9px] font-mono flex justify-between items-center">
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
                      className="w-full bg-[#0B1220] border border-[#1E293B] rounded-xl p-2.5 text-[10px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#00E5FF] h-[55px] resize-none font-sans"
                    />
                    <div className="flex justify-between items-center">
                      <button
                        onClick={handleSaveNotes}
                        className="bg-[#0B1220] hover:bg-[#1E293B] text-slate-200 border border-[#1E293B] px-3 py-1.5 rounded-xl text-[9px] font-bold flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Save className="w-3 h-3 text-[#00E5FF]" />
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
                            <CheckCircle className="w-3.5 h-3.5" />
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
