import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Database, Network } from 'lucide-react';

export const CommandCenterPreview: React.FC = () => {
  return (
    <section className="relative w-full py-40 overflow-hidden flex flex-col items-center">
      <div className="text-center relative z-20 mb-16">
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-white">
          <span className="block text-gray-500 font-light text-4xl mb-2">FROM DETECTION</span>
          TO INVESTIGATION.
        </h2>
        <p className="text-gray-400 font-light max-w-2xl mx-auto mb-10 text-lg">
          Seamlessly transition from automated detection into a deep-dive investigation environment. Monitor risk, explore graphs, and converse with the intelligence assistant.
        </p>
        
        <Link 
          to="/console" 
          className="group inline-flex items-center gap-3 px-8 py-4 rounded-full border border-teal-500/50 bg-teal-500/10 text-sm font-bold uppercase tracking-widest text-teal-400 hover:bg-teal-500 hover:text-black transition-colors backdrop-blur-md z-30 relative"
        >
          ENTER COMMAND CENTER <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Animated Feature Replacing the Floating Card */}
      <div className="relative w-full max-w-5xl h-[400px] flex items-center justify-center mt-10 perspective-1000">
        
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#2dd4bf_1px,transparent_1px),linear-gradient(to_bottom,#2dd4bf_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>

        {/* Central Animated Core */}
        <motion.div 
          style={{ transformStyle: "preserve-3d", rotateX: 60 }} 
          className="relative w-[300px] h-[300px] flex items-center justify-center z-10"
        >
          {/* Rotating Rings */}
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              className="absolute rounded-full border-2 border-teal-500/30"
              style={{ width: `${ring * 100}px`, height: `${ring * 100}px` }}
              animate={{ rotateZ: 360 }}
              transition={{ duration: 10 + ring * 5, repeat: Infinity, ease: "linear", direction: ring % 2 === 0 ? "reverse" : "normal" }}
            >
              {/* Ring Nodes */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-teal-400 rounded-full shadow-[0_0_10px_#2dd4bf]" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]" />
            </motion.div>
          ))}
          
          {/* Central Pulsing Sphere */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-16 h-16 bg-gradient-to-br from-teal-400 to-blue-600 rounded-full blur-[10px]"
          />
          <div className="absolute w-12 h-12 bg-black rounded-full border border-teal-500 shadow-[0_0_30px_#2dd4bf] flex items-center justify-center">
             <ShieldCheck className="w-5 h-5 text-teal-400" />
          </div>
        </motion.div>

        {/* Floating Data Packets feeding into the core */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-[1px] bg-gradient-to-r from-transparent via-teal-400 to-transparent"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: i % 2 === 0 ? '-10%' : '110%',
              }}
              animate={{
                x: i % 2 === 0 ? [0, 800] : [0, -800],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "linear"
              }}
            />
          ))}
        </div>

        {/* Connecting Lines / HUD Elements */}
        <div className="absolute w-full h-full pointer-events-none z-20 flex justify-between items-center px-10 md:px-32">
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             className="flex flex-col gap-2 items-center"
           >
             <div className="w-12 h-12 rounded-full border border-white/10 bg-black/50 backdrop-blur-md flex items-center justify-center">
               <Database className="w-5 h-5 text-gray-400" />
             </div>
             <span className="text-[10px] font-mono text-gray-500 tracking-widest">KNOWLEDGE GRAPH</span>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             className="flex flex-col gap-2 items-center"
           >
             <div className="w-12 h-12 rounded-full border border-white/10 bg-black/50 backdrop-blur-md flex items-center justify-center">
               <Network className="w-5 h-5 text-gray-400" />
             </div>
             <span className="text-[10px] font-mono text-gray-500 tracking-widest">THREAT TELEMETRY</span>
           </motion.div>
        </div>

      </div>
    </section>
  );
};
