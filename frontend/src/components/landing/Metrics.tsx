import React from 'react';
import { motion } from 'framer-motion';

export const Metrics: React.FC = () => {
  const metrics = [
    { value: "98.4%", label: "Detection Accuracy" },
    { value: "4.2ms", label: "Response Time" },
    { value: "15M+", label: "Reviews Processed" },
    { value: "99.9%", label: "System Uptime" }
  ];

  return (
    <section className="py-24 px-6 md:px-12 bg-app-btn-bg text-app-btn-text" id="metrics">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {metrics.map((m, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center justify-center p-6 border border-slate-800 rounded-3xl bg-slate-800/30 backdrop-blur-sm"
            >
              <h3 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-purple-400 mb-2">
                {m.value}
              </h3>
              <p className="text-slate-400 font-medium uppercase tracking-wider text-xs">{m.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
