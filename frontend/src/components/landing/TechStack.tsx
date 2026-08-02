import React from 'react';
import { motion } from 'framer-motion';

export const TechStack: React.FC = () => {
  const tech = [
    'React', 'FastAPI', 'Python', 'LangChain', 
    'OpenAI', 'Llama 3', 'FAISS', 'ChromaDB', 
    'PostgreSQL', 'XGBoost', 'BERT', 'Docker'
  ];

  return (
    <section className="py-24 px-6 md:px-12 bg-slate-900 overflow-hidden relative">
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h2 className="text-xl md:text-2xl font-semibold text-slate-300 mb-12">
          Powered by industry-standard AI & Data Infrastructure
        </h2>
        
        <div className="flex flex-wrap justify-center gap-4">
          {tech.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 px-6 py-3 rounded-full text-slate-300 font-mono text-sm shadow-sm hover:border-blue-500 hover:text-blue-400 transition-colors cursor-default"
            >
              {t}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
