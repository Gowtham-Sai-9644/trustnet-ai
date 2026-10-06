import React from 'react';
import { 
  Network, 
  ShieldCheck, 
  Cpu, 
  AlertTriangle
} from 'lucide-react';

export const GlobalPathNetwork: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden w-full h-full">
      {/* SVG Canvas for network paths */}
      <svg 
        className="w-full h-full opacity-65" 
        viewBox="0 0 1920 1080" 
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Neon Glow Filters */}
          <filter id="glow-cyan" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-blue" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-amber" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-red" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Embedded style block for path dashflow animations */}
        <style>{`
          @keyframes dashflow {
            to {
              stroke-dashoffset: -300;
            }
          }
          .animate-dashflow {
            animation: dashflow 12s linear infinite;
          }
          .animate-dashflow-reverse {
            animation: dashflow 18s linear infinite reverse;
          }
        `}</style>

        {/* ==================== PATHS IN THE GUTTERS ==================== */}

        {/* PATH 1: GNN CLASSIFIER ROUTE (Cyan theme, Left gutter vertical) */}
        <path 
          id="path-gnn" 
          d="M 110,-150 C 160,250 80,650 120,1200" 
          fill="none" 
          stroke="rgba(0, 229, 255, 0.08)" 
          strokeWidth="1.5" 
        />
        <path 
          d="M 110,-150 C 160,250 80,650 120,1200" 
          fill="none" 
          stroke="rgba(0, 229, 255, 0.35)" 
          strokeWidth="1" 
          strokeDasharray="10, 100" 
          className="animate-dashflow"
          filter="url(#glow-cyan)"
        />

        {/* PATH 2: ECE CALIBRATION ROUTE (Emerald theme, Left gutter vertical, reverse) */}
        <path 
          id="path-ece" 
          d="M 130,1200 C 60,700 160,350 100,-150" 
          fill="none" 
          stroke="rgba(16, 185, 129, 0.06)" 
          strokeWidth="1.5" 
        />
        <path 
          d="M 130,1200 C 60,700 160,350 100,-150" 
          fill="none" 
          stroke="rgba(16, 185, 129, 0.3)" 
          strokeWidth="1" 
          strokeDasharray="12, 120" 
          className="animate-dashflow-reverse"
          filter="url(#glow-blue)"
        />

        {/* PATH 3: EXPLAINABLE AI ROUTE (Amber theme, Right gutter vertical) */}
        <path 
          id="path-xai" 
          d="M 1790,-150 C 1740,250 1820,650 1780,1200" 
          fill="none" 
          stroke="rgba(245, 158, 11, 0.06)" 
          strokeWidth="1.5" 
        />
        <path 
          d="M 1790,-150 C 1740,250 1820,650 1780,1200" 
          fill="none" 
          stroke="rgba(245, 158, 11, 0.3)" 
          strokeWidth="1" 
          strokeDasharray="8, 90" 
          className="animate-dashflow"
          filter="url(#glow-amber)"
        />

        {/* PATH 4: UPI MULE ROUTE (Red theme, Right gutter vertical, reverse) */}
        <path 
          id="path-mule" 
          d="M 1810,1200 C 1760,700 1840,350 1800,-150" 
          fill="none" 
          stroke="rgba(239, 68, 68, 0.06)" 
          strokeWidth="1.5" 
        />
        <path 
          d="M 1810,1200 C 1760,700 1840,350 1800,-150" 
          fill="none" 
          stroke="rgba(239, 68, 68, 0.3)" 
          strokeWidth="1" 
          strokeDasharray="15, 140" 
          className="animate-dashflow-reverse"
          filter="url(#glow-red)"
        />

        {/* ==================== FAINT HORIZONTAL CROSS-CONNECTIONS ==================== */}

        <path 
          id="cross-cyan" 
          d="M 120,200 Q 960,100 1780,300" 
          fill="none" 
          stroke="rgba(0, 229, 255, 0.05)" 
          strokeWidth="1" 
          strokeDasharray="4, 12" 
        />
        <path 
          id="cross-blue" 
          d="M 120,800 C 500,600 1420,400 1780,200" 
          fill="none" 
          stroke="rgba(16, 185, 129, 0.04)" 
          strokeWidth="1" 
          strokeDasharray="5, 15" 
        />
        <path 
          id="cross-red" 
          d="M 120,500 Q 960,800 1780,600" 
          fill="none" 
          stroke="rgba(239, 68, 68, 0.04)" 
          strokeWidth="1" 
          strokeDasharray="6, 18" 
        />

        {/* Animated packet circles traveling across the page */}
        <circle r="2.5" fill="#3B82F6" filter="url(#glow-cyan)">
          <animateMotion dur="7s" repeatCount="indefinite">
            <mpath href="#cross-cyan" />
          </animateMotion>
        </circle>
        <circle r="2.5" fill="#10B981" filter="url(#glow-blue)">
          <animateMotion dur="9s" repeatCount="indefinite">
            <mpath href="#cross-blue" />
          </animateMotion>
        </circle>
        <circle r="2.5" fill="#EF4444" filter="url(#glow-red)">
          <animateMotion dur="8s" repeatCount="indefinite">
            <mpath href="#cross-red" />
          </animateMotion>
        </circle>


        {/* ==================== TELEMETRY CARDS ==================== */}

        {/* TELEMETRY CARD 1: GNN Classifier Node (Cyan, Left Gutter) */}
        <g>
          <animateMotion dur="42s" repeatCount="indefinite" rotate="0">
            <mpath href="#path-gnn" />
          </animateMotion>
          <foreignObject width="220" height="120" x="-110" y="-60" className="hidden lg:block">
            <div className="p-3 rounded-xl border border-cyan-500/20 bg-[#060c18]/98 backdrop-blur shadow-[0_0_20px_rgba(0,0,0,0.8)] flex flex-col justify-between h-full select-none text-left pointer-events-none">
              <div className="flex justify-between items-center border-b border-cyan-500/10 pb-1">
                <span className="flex items-center space-x-1.5 text-[8px] font-mono font-bold tracking-widest text-[#3B82F6]">
                  <Network className="w-3 h-3 text-[#3B82F6] animate-pulse" />
                  <span>NODE_GNN_v3</span>
                </span>
                <span className="relative flex h-1 w-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3B82F6] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1 w-1 bg-[#3B82F6]"></span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 py-1 text-[8px] font-mono text-app-muted">
                <div>DEGREE: <span className="text-app-text font-bold">14</span></div>
                <div>EDGES: <span className="text-app-text font-bold">89</span></div>
                <div>MODULARITY: <span className="text-app-text font-bold">0.65</span></div>
                <div>CENTRALITY: <span className="text-app-text font-bold">+5.84</span></div>
              </div>
              <div className="flex justify-between items-end border-t border-cyan-500/10 pt-1 mt-0.5">
                <div className="text-[10px] font-mono font-extrabold text-[#3B82F6] tracking-wide">
                  RISK: 94.2%
                </div>
                <div className="w-12 h-3 flex items-center justify-end">
                  <svg className="w-full h-full text-[#3B82F6]/30" viewBox="0 0 60 15">
                    <path d="M0,8 Q10,12 20,4 T40,10 T60,2" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
            </div>
          </foreignObject>
        </g>

        {/* TELEMETRY CARD 2: ECE Calibration Node (Emerald, Left Gutter, reverse motion) */}
        <g>
          <animateMotion dur="48s" repeatCount="indefinite" rotate="0">
            <mpath href="#path-ece" />
          </animateMotion>
          <foreignObject width="220" height="120" x="-110" y="-60" className="hidden lg:block">
            <div className="p-3 rounded-xl border border-blue-500/20 bg-[#060c18]/98 backdrop-blur shadow-[0_0_20px_rgba(0,0,0,0.8)] flex flex-col justify-between h-full select-none text-left pointer-events-none">
              <div className="flex justify-between items-center border-b border-blue-500/10 pb-1">
                <span className="flex items-center space-x-1.5 text-[8px] font-mono font-bold tracking-widest text-[#10B981]">
                  <ShieldCheck className="w-3 h-3 text-[#10B981]" />
                  <span>CALIB_ECE_MONITOR</span>
                </span>
                <span className="bg-blue-500/15 text-[#10B981] px-1 rounded text-[6px] font-bold border border-blue-500/20">STABLE</span>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 py-1 text-[8px] font-mono text-app-muted">
                <div>INGEST: <span className="text-app-text font-bold">1.4K/s</span></div>
                <div>CONFIDENCE: <span className="text-app-text font-bold">96%</span></div>
                <div>BIAS: <span className="text-app-text font-bold">-0.003</span></div>
                <div>DRIFT: <span className="text-app-text font-bold">NONE</span></div>
              </div>
              <div className="flex justify-between items-end border-t border-blue-500/10 pt-1 mt-0.5">
                <div className="text-[10px] font-mono font-extrabold text-[#10B981] tracking-wide">
                  ECE: 0.012
                </div>
                <span className="text-[6px] font-mono text-app-muted uppercase tracking-widest">CALIBRATED</span>
              </div>
            </div>
          </foreignObject>
        </g>

        {/* TELEMETRY CARD 3: Explainable AI Node (Amber, Right Gutter) */}
        <g>
          <animateMotion dur="45s" repeatCount="indefinite" rotate="0">
            <mpath href="#path-xai" />
          </animateMotion>
          <foreignObject width="220" height="120" x="-110" y="-60" className="hidden lg:block">
            <div className="p-3 rounded-xl border border-amber-500/20 bg-[#060c18]/98 backdrop-blur shadow-[0_0_20px_rgba(0,0,0,0.8)] flex flex-col justify-between h-full select-none text-left pointer-events-none">
              <div className="flex justify-between items-center border-b border-amber-500/10 pb-1">
                <span className="flex items-center space-x-1.5 text-[8px] font-mono font-bold tracking-widest text-[#F59E0B]">
                  <Cpu className="w-3 h-3 text-[#F59E0B]" />
                  <span>XAI_SHAPLEY_LOG</span>
                </span>
                <span className="relative flex h-1 w-1">
                  <span className="relative inline-flex rounded-full h-1 w-1 bg-[#F59E0B]"></span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 py-1 text-[8px] font-mono text-app-muted">
                <div>NLP SHAP: <span className="text-app-text font-bold">+0.78</span></div>
                <div>DGA SHAP: <span className="text-app-text font-bold">+0.64</span></div>
                <div>GNN SHAP: <span className="text-app-text font-bold">+0.42</span></div>
                <div>DRIFT: <span className="text-app-text font-bold">-0.004</span></div>
              </div>
              <div className="flex justify-between items-end border-t border-amber-500/10 pt-1 mt-0.5">
                <div className="text-[10px] font-mono font-extrabold text-[#F59E0B] tracking-wide">
                  ENTROPY: 0.841
                </div>
                <div className="w-12 h-2.5 bg-app-bg/60 rounded overflow-hidden flex items-center px-1">
                  <div className="h-1 bg-[#F59E0B] rounded-full w-4/5" />
                </div>
              </div>
            </div>
          </foreignObject>
        </g>

        {/* TELEMETRY CARD 4: UPI Mule Router Node (Red, Right Gutter, reverse motion) */}
        <g>
          <animateMotion dur="52s" repeatCount="indefinite" rotate="0">
            <mpath href="#path-mule" />
          </animateMotion>
          <foreignObject width="220" height="120" x="-110" y="-60" className="hidden lg:block">
            <div className="p-3 rounded-xl border border-red-500/20 bg-[#060c18]/98 backdrop-blur shadow-[0_0_20px_rgba(0,0,0,0.8)] flex flex-col justify-between h-full select-none text-left pointer-events-none">
              <div className="flex justify-between items-center border-b border-red-500/10 pb-1">
                <span className="flex items-center space-x-1.5 text-[8px] font-mono font-bold tracking-widest text-[#EF4444]">
                  <AlertTriangle className="w-3 h-3 text-[#EF4444]" />
                  <span>MULE_ROUTER_NODE</span>
                </span>
                <span className="bg-red-500/15 text-[#EF4444] px-1 rounded text-[6px] font-bold border border-red-500/20">ALERT</span>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 py-1 text-[8px] font-mono text-app-muted">
                <div>HOPS: <span className="text-app-text font-bold">4 DEPTH</span></div>
                <div>VOLUME: <span className="text-app-text font-bold">$12.4M</span></div>
                <div>ISOLATED: <span className="text-app-text font-bold">14 WTS</span></div>
                <div>PAGERANK: <span className="text-app-text font-bold">+5.84</span></div>
              </div>
              <div className="flex justify-between items-end border-t border-red-500/10 pt-1 mt-0.5">
                <div className="text-[10px] font-mono font-extrabold text-[#EF4444] tracking-wide">
                  MITIGATION: ON
                </div>
                <span className="text-[#EF4444] text-[7px] font-bold animate-pulse font-mono">CRITICAL</span>
              </div>
            </div>
          </foreignObject>
        </g>
      </svg>
    </div>
  );
};

export default GlobalPathNetwork;
