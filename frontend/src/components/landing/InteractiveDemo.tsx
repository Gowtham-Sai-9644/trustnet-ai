import React from 'react';
import { motion } from 'framer-motion';
import { Play, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const InteractiveDemo: React.FC = () => {
  return (
    <section className="py-24 px-6 md:px-12 bg-app-card border border-app-border backdrop-blur-md border-y border-app-border" id="demo">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-app-text tracking-tight mb-4">
            Try it yourself.
          </h2>
          <p className="text-app-muted text-lg">
            Experience the multi-modal fusion pipeline in real-time.
          </p>
        </div>

        <div className="bg-transparent border border-app-border rounded-2xl p-8 md:p-12 shadow-[0_4px_20px_rgb(0,0,0,0.03)] text-center">
           <ShieldAlert className="w-12 h-12 text-violet-500 mx-auto mb-6" />
           <h3 className="text-2xl font-bold text-app-text mb-4">Interactive Scanning Engine</h3>
           <p className="text-app-muted mb-8 max-w-xl mx-auto">
             Our live demo environment allows you to ingest mock product reviews, query the vector database, and visualize the SHAP explainability values directly in your browser.
           </p>
           <Link to="/console" className="inline-flex items-center space-x-2 bg-violet-600 hover:bg-blue-700 text-app-btn-text px-8 py-4 rounded-xl font-semibold transition-colors shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
             <Play className="w-5 h-5" />
             <span>Launch Full Interactive Console</span>
           </Link>
        </div>
      </div>
    </section>
  );
};
