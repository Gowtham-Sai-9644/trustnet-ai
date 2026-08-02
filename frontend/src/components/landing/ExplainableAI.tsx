import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, FileSearch } from 'lucide-react';

export const ExplainableAI: React.FC = () => {
  const [expandedId, setExpandedId] = useState<number | null>(0);

  const explanations = [
    { id: 0, title: "Duplicate review detected", detail: "This exact phrasing was found in 14 other reviews posted across 3 different products on the same day." },
    { id: 1, title: "Promotional language", detail: "NLP sentiment analysis flagged highly unnatural, overly enthusiastic keywords typical of sponsored or compensated reviews." },
    { id: 2, title: "Suspicious reviewer behavior", detail: "The user account was created 2 hours before posting, and has reviewed 5 unrelated products within 10 minutes." }
  ];

  return (
    <section className="py-24 px-6 md:px-12 bg-transparent border-y border-app-border">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <div className="bg-fuchsia-100 text-fuchsia-600 p-3 rounded-xl inline-block mb-6">
            <FileSearch className="w-6 h-6" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-app-text tracking-tight mb-6">
            We don't just guess. <br/>We explain.
          </h2>
          <p className="text-app-muted text-lg mb-8">
            Black-box models are unacceptable for enterprise compliance. TrustNet AI uses SHAP (SHapley Additive exPlanations) and RAG to provide human-readable evidence for every single prediction it makes.
          </p>
        </div>

        <div className="space-y-4">
          {explanations.map((exp) => (
            <div 
              key={exp.id} 
              className={`border rounded-2xl overflow-hidden bg-app-card border border-app-border backdrop-blur-md transition-colors cursor-pointer ${expandedId === exp.id ? 'border-purple-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)]' : 'border-app-border hover:border-slate-300'}`}
              onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
            >
              <div className="p-5 flex justify-between items-center">
                <span className="font-semibold text-app-text">{exp.title}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${expandedId === exp.id ? 'rotate-180' : ''}`} />
              </div>
              <AnimatePresence>
                {expandedId === exp.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-5 pb-5 pt-1 border-t border-app-border text-app-muted"
                  >
                    {exp.detail}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
