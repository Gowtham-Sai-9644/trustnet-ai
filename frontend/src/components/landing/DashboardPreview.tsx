import React from 'react';
import { motion } from 'framer-motion';

export const DashboardPreview: React.FC = () => {
  return (
    <section className="py-24 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Comprehensive Analytics
          </h2>
          <p className="text-slate-600 text-lg">
            Monitor real-time sentiment, trust score distributions, and reviewer network topologies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 h-80 flex flex-col justify-between shadow-sm">
             <div>
                <h3 className="font-bold text-slate-800 mb-1">Fake vs Genuine</h3>
                <p className="text-sm text-slate-500">Last 30 Days</p>
             </div>
             <div className="flex-1 mt-6 flex items-end space-x-4">
                <div className="w-1/2 bg-blue-500 rounded-t-lg relative group" style={{ height: '80%' }}>
                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">80%</div>
                </div>
                <div className="w-1/2 bg-amber-500 rounded-t-lg relative group" style={{ height: '20%' }}>
                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">20%</div>
                </div>
             </div>
             <div className="flex justify-between mt-4 text-xs font-semibold text-slate-500 uppercase">
                <span>Genuine</span>
                <span>Fake</span>
             </div>
          </div>
          
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 h-80 flex flex-col justify-between shadow-sm">
             <div>
                <h3 className="font-bold text-slate-800 mb-1">Trust Score Distribution</h3>
                <p className="text-sm text-slate-500">Across 1M+ Products</p>
             </div>
             {/* Abstract wave or bar visualization */}
             <div className="flex-1 mt-6 flex items-end justify-between space-x-1">
                {[20, 30, 45, 60, 80, 95, 85, 70, 50, 40, 25, 15].map((h, i) => (
                  <div key={i} className="flex-1 bg-emerald-400 rounded-t-sm hover:bg-emerald-500 transition-colors cursor-pointer" style={{ height: `${h}%` }} />
                ))}
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};
