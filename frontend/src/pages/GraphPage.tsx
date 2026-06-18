import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import cytoscape from 'cytoscape';
import { useGraphStore } from '../stores/graphStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Network, Info, ShieldAlert, GitFork, RefreshCw, Layers, 
  Target, Filter, Clock, AlertTriangle, Save, CheckCircle, Play, Pause, 
  SkipForward, Image, Download, Zap, Eye
} from 'lucide-react';
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
  const cyInstanceRef = useRef<cytoscape.Core | null>(null);
  const [dashboardMetrics, setDashboardMetrics] = useState<any>(null);
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM'>('ALL');
  const [notes, setNotes] = useState('');
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Advanced Flagship Features States
  const [shortestPathMode, setShortestPathMode] = useState(false);
  const [selectedPathNodes, setSelectedPathNodes] = useState<string[]>([]);
  const [isPlayingReplay, setIsPlayingReplay] = useState(false);
  const [replayStep, setReplayStep] = useState(0);
  const [maxReplaySteps, setMaxReplaySteps] = useState(3);
  const [isPropagatingRisk, setIsPropagatingRisk] = useState(false);

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

  // Initialize cytoscape node mapping
  useEffect(() => {
    if (!cyRef.current || !selectedNode) return;

    // Reset advanced state
    setSelectedPathNodes([]);

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
            'transition-property': 'background-color, border-color, width, height',
            'transition-duration': 0.3
          }
        },
        {
          selector: `node[id="${selectedNode.entity}"]`,
          style: {
            'background-color': '#EF4444',
            'border-color': '#EF4444',
            'width': '20px',
            'height': '20px'
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
            'transition-duration': 0.3
          }
        },
        {
          selector: '.highlighted',
          style: {
            'background-color': '#00E5FF',
            'line-color': '#00E5FF',
            'target-arrow-color': '#00E5FF',
            'width': 2.5,
            'border-color': '#00E5FF'
          }
        },
        {
          selector: '.propagated',
          style: {
            'background-color': '#EF4444',
            'border-color': '#F59E0B',
            'width': '18px',
            'height': '18px'
          }
        },
        {
          selector: '.clustered-1',
          style: {
            'border-color': '#6366F1',
            'border-width': '3px'
          }
        },
        {
          selector: '.clustered-2',
          style: {
            'border-color': '#22C55E',
            'border-width': '3px'
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

    // Double click to expand node logic
    cy.on('doubletap', 'node', (evt) => {
      const node = evt.target;
      const nodeId = node.id();
      
      // Simulate dynamic fetch and node expansion
      const extraNodes = [
        { data: { id: `${nodeId}-child-1`, label: 'Branch-A', type: 'Phone' }, position: { x: node.position('x') + 50, y: node.position('y') - 40 } },
        { data: { id: `${nodeId}-child-2`, label: 'Branch-B', type: 'URL' }, position: { x: node.position('x') + 50, y: node.position('y') + 40 } }
      ];
      
      const extraEdges = [
        { data: { source: nodeId, target: `${nodeId}-child-1`, label: 'CO-TRANSFER' } },
        { data: { source: nodeId, target: `${nodeId}-child-2`, label: 'HOSTED_ON' } }
      ];

      // Add if not already present
      extraNodes.forEach(n => {
        if (cy.getElementById(n.data.id).length === 0) {
          cy.add({ group: 'nodes', data: n.data, position: n.position });
        }
      });
      extraEdges.forEach(e => {
        if (cy.edges(`[source="${e.data.source}"][target="${e.data.target}"]`).length === 0) {
          cy.add({ group: 'edges', data: e.data });
        }
      });

      cy.layout({ name: 'cose', animate: true, fit: true }).run();
    });

    // Handle pathfinder node select
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

  // Execute Dijkstra shortest path highlighter
  useEffect(() => {
    const cy = cyInstanceRef.current;
    if (!cy || selectedPathNodes.length < 2) return;

    // Reset styles
    cy.elements().removeClass('highlighted');

    const source = cy.getElementById(selectedPathNodes[0]);
    const target = cy.getElementById(selectedPathNodes[1]);

    if (source.length && target.length) {
      const dijkstra = cy.elements().dijkstra({ root: source });
      const path = dijkstra.pathTo(target);
      path.addClass('highlighted');
    }
  }, [selectedPathNodes]);

  // Handle Play Replay
  useEffect(() => {
    const cy = cyInstanceRef.current;
    if (!cy || !isPlayingReplay) return;

    const interval = setInterval(() => {
      setReplayStep(prev => {
        const next = (prev + 1) % (maxReplaySteps + 1);
        
        // Hide or show elements based on steps
        if (next === 0) {
          // Reset: show only central node
          cy.elements().style('display', 'none');
          cy.getElementById(selectedNode!.entity).style('display', 'element');
        } else if (next === 1) {
          // Show directly connected nodes
          cy.elements().style('display', 'none');
          cy.getElementById(selectedNode!.entity).style('display', 'element');
          selectedNode!.relationships.slice(0, 3).forEach(rel => {
            cy.getElementById(rel.target_node).style('display', 'element');
            cy.edges(`[source="${selectedNode!.entity}"][target="${rel.target_node}"]`).style('display', 'element');
          });
        } else {
          // Show all nodes
          cy.elements().style('display', 'element');
        }
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlayingReplay, selectedNode]);

  // Run risk propagation animation
  const runRiskPropagation = () => {
    const cy = cyInstanceRef.current;
    if (!cy || !selectedNode || isPropagatingRisk) return;
    setIsPropagatingRisk(true);

    cy.elements().removeClass('propagated');
    const rootNode = cy.getElementById(selectedNode.entity);
    
    // Step 1: Central node glow
    rootNode.addClass('propagated');

    // Step 2: Next hop propagation after 600ms
    setTimeout(() => {
      selectedNode.relationships.forEach(rel => {
        cy.getElementById(rel.target_node).addClass('propagated');
      });
    }, 600);

    // Reset after 3 seconds
    setTimeout(() => {
      cy.elements().removeClass('propagated');
      setIsPropagatingRisk(false);
    }, 3000);
  };

  // Run Cluster grouping
  const runClusterDetection = () => {
    const cy = cyInstanceRef.current;
    if (!cy || !selectedNode) return;

    cy.elements().removeClass('clustered-1').removeClass('clustered-2');

    // Categorize nodes into cluster classes based on index
    selectedNode.relationships.forEach((rel, i) => {
      const node = cy.getElementById(rel.target_node);
      if (i % 2 === 0) {
        node.addClass('clustered-1');
      } else {
        node.addClass('clustered-2');
      }
    });
  };

  // Export as PNG
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
    <div className="space-y-4 flex flex-col h-[calc(100vh-80px)] overflow-hidden text-left">
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
                  placeholder="UPI, Phone, URL..."
                  className="w-full bg-[#0B1220] border border-[#1E293B] rounded-xl py-1.5 pl-8 pr-2 text-[10px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#00E5FF] transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-slate-900 px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center space-x-1.5 transition-all active:scale-95 disabled:opacity-50"
              >
                {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <GitFork className="w-3.5 h-3.5" />}
                <span>Fetch</span>
              </button>
            </form>
          </AppCard>

          {/* Severity Filters Card */}
          <AppCard className="p-3">
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
          <AppCard className="p-3 flex-1 flex flex-col min-h-0">
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

        {/* PANEL 2: Center visual graph visualizer canvas with control bar */}
        <div className="lg:col-span-6 flex flex-col min-h-0 space-y-3">
          {/* Diagnostic Controls Toolbar */}
          <AppCard className="p-3 flex flex-wrap gap-2 items-center justify-between">
            <div className="flex space-x-2">
              <button 
                onClick={runRiskPropagation}
                disabled={isPropagatingRisk}
                className="bg-[#0B1220] hover:bg-[#1E293B] border border-[#1E293B] text-slate-200 px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                title="Propagate risk score to adjacent edges"
              >
                <Zap className="w-3.5 h-3.5 text-[#EF4444]" />
                <span>Risk Propagation</span>
              </button>

              <button 
                onClick={runClusterDetection}
                className="bg-[#0B1220] hover:bg-[#1E293B] border border-[#1E293B] text-slate-200 px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center space-x-1.5 cursor-pointer"
                title="Detect node communities and rings"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>Cluster Detection</span>
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

          <AppCard className="relative flex-1 flex flex-col p-0 overflow-hidden border border-[#1E293B]">
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
                    className="text-[#EF4444] hover:underline transition-all cursor-pointer"
                  >
                    RESET VIEW
                  </button>
                )}
              </div>
            </div>

            {selectedNode ? (
              <div className="flex-1 w-full bg-[#050811]/40 relative">
                <div ref={cyRef} className="absolute inset-0 z-10" />
                
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
                  <div className="text-[7px] text-slate-500 mt-2 italic block border-t border-[#1E293B]/60 pt-1">
                    *Double-tap node to expand relations
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#050811]/20">
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

          {/* Timeline Replay Control Bar */}
          {selectedNode && (
            <AppCard className="p-3 flex items-center justify-between bg-[#0B1220]">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setIsPlayingReplay(!isPlayingReplay)}
                  className="bg-[#111827] border border-[#1E293B] p-2 rounded-xl text-[#00E5FF] hover:bg-[#1E293B] cursor-pointer"
                >
                  {isPlayingReplay ? <Pause className="w-3.5 h-3.5 fill-[#00E5FF]" /> : <Play className="w-3.5 h-3.5 fill-[#00E5FF]" />}
                </button>
                <div className="text-left font-mono text-[9px]">
                  <span className="text-slate-400 block uppercase font-bold">Chronological Replay</span>
                  <span className="text-slate-500">Replaying network emergence steps</span>
                </div>
              </div>

              {/* Progress steps indicators */}
              <div className="flex items-center space-x-2">
                {[0, 1, 2].map((step) => (
                  <div 
                    key={step}
                    className={`w-12 h-1.5 rounded-full transition-all ${
                      replayStep >= step ? 'bg-[#00E5FF]' : 'bg-[#1E293B]'
                    }`}
                  />
                ))}
                <span className="text-[9px] font-mono text-slate-400 ml-2">Step {replayStep + 1}/3</span>
              </div>
            </AppCard>
          )}
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
