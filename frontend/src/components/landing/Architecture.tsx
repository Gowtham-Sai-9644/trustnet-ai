import React from 'react';
import { motion } from 'framer-motion';

export const Architecture: React.FC = () => {
  return (
    <section className="py-24 px-6 md:px-12 bg-app-card border border-app-border backdrop-blur-md" id="architecture">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-app-text tracking-tight mb-4">
            Built for Enterprise Scale.
          </h2>
          <p className="text-app-muted text-lg max-w-2xl mx-auto">
            A high-level look at how we process, embed, and analyze incoming data in milliseconds.
          </p>
        </div>

        <div className="bg-transparent border border-app-border rounded-3xl p-8 md:p-16 relative overflow-hidden">
          {/* Abstract Architecture Diagram */}
          <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 relative z-10">
             
             {/* Frontend */}
             <div className="w-full md:w-1/4 space-y-4">
                <div className="bg-app-card border border-app-border backdrop-blur-md border border-app-border shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-4 rounded-xl text-center font-bold text-slate-700">React Frontend</div>
             </div>
             
             <div className="h-8 md:h-0 w-0 md:w-8 border-l-2 md:border-l-0 md:border-t-2 border-dashed border-slate-300" />
             
             {/* Backend & DBs */}
             <div className="w-full md:w-2/4 space-y-4">
                <div className="bg-violet-50 border border-violet-200 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-6 rounded-xl text-center">
                  <span className="font-bold text-blue-900 block mb-4">FastAPI Backend Pipeline</span>
                  <div className="grid grid-cols-2 gap-4 text-sm font-medium">
                     <div className="bg-app-card border border-app-border backdrop-blur-md p-3 rounded-lg border border-violet-100 text-app-muted">Text Preprocessing</div>
                     <div className="bg-app-card border border-app-border backdrop-blur-md p-3 rounded-lg border border-violet-100 text-app-muted">Embedding Model</div>
                     <div className="bg-app-card border border-app-border backdrop-blur-md p-3 rounded-lg border border-violet-100 text-app-muted">Vector DB (FAISS)</div>
                     <div className="bg-app-card border border-app-border backdrop-blur-md p-3 rounded-lg border border-violet-100 text-app-muted">RAG Retriever</div>
                  </div>
                </div>
             </div>

             <div className="h-8 md:h-0 w-0 md:w-8 border-l-2 md:border-l-0 md:border-t-2 border-dashed border-slate-300" />

             {/* Output */}
             <div className="w-full md:w-1/4 space-y-4">
                <div className="bg-fuchsia-50 border border-purple-200 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-4 rounded-xl text-center font-bold text-purple-900 mb-2">LLM Engine</div>
                <div className="bg-emerald-50 border border-emerald-200 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-4 rounded-xl text-center font-bold text-emerald-900">Trust Score Output</div>
             </div>
             
          </div>
        </div>
      </div>
    </section>
  );
};
