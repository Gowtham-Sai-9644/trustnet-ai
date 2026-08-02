import React from 'react';
import { motion } from 'framer-motion';
import { Database, Search, Cpu, ShieldCheck, ArrowDown } from 'lucide-react';

export const SolutionWorkflow: React.FC = () => {
  const steps = [
    { title: "Review Collection", icon: <Database />, desc: "Ingests raw text, ratings, and user metadata from e-commerce platforms." },
    { title: "Vector Embeddings", icon: <Search />, desc: "Transforms text into dense vector representations using advanced LLMs." },
    { title: "RAG + Reranking", icon: <Cpu />, desc: "Retrieves semantically similar historical reviews to detect coordinated spam rings." },
    { title: "Trust Score Engine", icon: <ShieldCheck />, desc: "Outputs a calibrated trust score from 0-100% with explainable evidence." }
  ];

  return (
    <section className="py-24 px-6 md:px-12 bg-slate-900 text-white relative overflow-hidden" id="solution">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            The Complete Intelligence Pipeline
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            We replace manual moderation with a deterministic, real-time AI pipeline built on modern vector databases and large language models.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-6">
          {steps.map((step, i) => (
            <React.Fragment key={i}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full max-w-2xl bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-2xl flex items-center space-x-6"
              >
                <div className="bg-blue-500/20 text-blue-400 p-4 rounded-xl border border-blue-500/30">
                  {step.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-100 mb-1">{step.title}</h3>
                  <p className="text-sm text-slate-400">{step.desc}</p>
                </div>
              </motion.div>
              
              {i < steps.length - 1 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  whileInView={{ opacity: 1, height: 'auto' }}
                  viewport={{ once: true }}
                  className="text-slate-600"
                >
                  <ArrowDown className="w-6 h-6 animate-bounce" />
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};
