import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Network, Phone, Globe, CreditCard, Link2, UserX } from 'lucide-react';

const NODES = [
  { id: 'scammer', icon: UserX, label: 'SCAMMER', x: 50, y: 50, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  { id: 'phone', icon: Phone, label: 'PHONE', x: 20, y: 20, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  { id: 'upi', icon: CreditCard, label: 'UPI', x: 80, y: 20, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  { id: 'domain', icon: Globe, label: 'DOMAIN', x: 20, y: 80, color: 'text-teal-500', bg: 'bg-teal-500/10', border: 'border-teal-500/30' },
  { id: 'url', icon: Link2, label: 'URL', x: 80, y: 80, color: 'text-teal-500', bg: 'bg-teal-500/10', border: 'border-teal-500/30' },
];

const EDGES = [
  { from: 'scammer', to: 'phone', label: 'USES' },
  { from: 'scammer', to: 'upi', label: 'LINKED TO' },
  { from: 'phone', to: 'domain', label: 'REPORTED WITH' },
  { from: 'domain', to: 'url', label: 'CONNECTED TO' },
  { from: 'upi', to: 'url', label: 'SHARES SIGNAL' },
];

export const GraphIntelligence: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [40, 10]);
  const rotateZ = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  return (
    <section ref={containerRef} className="relative w-full py-32 overflow-hidden flex flex-col items-center">
      <div className="text-center mb-16 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
          <Network className="w-4 h-4 text-purple-400" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-purple-400">Graph Intelligence</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Relational Investigation.</h2>
        <p className="text-gray-400 font-light max-w-2xl mx-auto">
          Threats do not exist in isolation. TrustNet maps the relationships between scammers, phones, UPI IDs, and infrastructure to expose entire fraud rings.
        </p>
      </div>

      <div className="w-full max-w-5xl h-[600px] relative perspective-1000">
        <motion.div 
          style={{ rotateX, rotateZ, transformStyle: "preserve-3d" }}
          className="w-full h-full relative"
        >
          {/* Edges */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ transform: "translateZ(-1px)" }}>
            {EDGES.map((edge, i) => {
              const fromNode = NODES.find(n => n.id === edge.from)!;
              const toNode = NODES.find(n => n.id === edge.to)!;
              return (
                <g key={i}>
                  <line 
                    x1={`${fromNode.x}%`} y1={`${fromNode.y}%`} 
                    x2={`${toNode.x}%`} y2={`${toNode.y}%`} 
                    stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4"
                  />
                  {/* Moving data packet */}
                  <motion.circle
                    r="3"
                    fill="#a855f7"
                    animate={{
                      cx: [`${fromNode.x}%`, `${toNode.x}%`],
                      cy: [`${fromNode.y}%`, `${toNode.y}%`]
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.5, ease: "linear" }}
                    style={{ filter: "drop-shadow(0 0 8px #a855f7)" }}
                  />
                  {/* Edge Label */}
                  <text 
                    x={`${(fromNode.x + toNode.x) / 2}%`} 
                    y={`${(fromNode.y + toNode.y) / 2}%`} 
                    fill="rgba(255,255,255,0.4)" 
                    fontSize="10" 
                    fontFamily="monospace"
                    textAnchor="middle"
                    dy="-5"
                  >
                    {edge.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Nodes */}
          {NODES.map((node, i) => (
            <motion.div
              key={node.id}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.2, type: "spring" }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2`}
              style={{ left: `${node.x}%`, top: `${node.y}%`, transformStyle: "preserve-3d" }}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${node.bg} ${node.border} border backdrop-blur-md relative group`}>
                <node.icon className={`w-8 h-8 ${node.color}`} />
                {/* Node pulse */}
                <motion.div 
                  animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                  className={`absolute inset-0 rounded-2xl ${node.border} border`}
                />
              </div>
              <span className="text-[10px] font-mono tracking-widest bg-black/50 px-2 py-1 rounded border border-white/10">{node.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
