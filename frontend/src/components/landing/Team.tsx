import React from 'react';

const developers = [
  { name: 'N.gowtham sai', role: 'Core Architect & SecOps' },
  { name: 'S.abhinav', role: 'AI & Data Engineering' },
  { name: 'S.yaasweja', role: 'Threat Intelligence' },
  { name: 'G.mahathi', role: 'Frontend & UI/UX' },
];

export const Team: React.FC = () => {
  return (
    <section className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center py-20 px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-landing-text mb-4">Meet the Developers.</h2>
        <p className="text-lg text-landing-muted max-w-2xl mx-auto">
          The team behind the world's most advanced Review Intelligence & Scam Detection Platform.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full">
        {developers.map((dev, idx) => (
          <div key={idx} className="bg-landing-card border border-landing-border p-6 rounded-2xl flex flex-col items-center text-center shadow-lg hover:-translate-y-2 transition-transform duration-300">
            <div className="w-20 h-20 bg-landing-surface rounded-full flex items-center justify-center mb-4 border border-landing-border/50 text-2xl shadow-inner">
              🧑‍💻
            </div>
            <h3 className="text-lg font-bold text-landing-text mb-1">{dev.name}</h3>
            <span className="text-xs font-mono text-landing-primary uppercase tracking-wider">{dev.role}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
