import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingDown, Users } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  const stats = [
    { label: "Revenue Lost Annually", value: "$152B", icon: <TrendingDown className="w-5 h-5 text-red-500" /> },
    { label: "Fake Reviews Online", value: "30.4%", icon: <AlertTriangle className="w-5 h-5 text-amber-500" /> },
    { label: "Consumers Misled", value: "82%", icon: <Users className="w-5 h-5 text-violet-500" /> }
  ];

  return (
    <section className="py-24 px-6 md:px-12 bg-app-card border border-app-border backdrop-blur-md relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-app-text tracking-tight mb-6">
            The Fake Review Epidemic
          </h2>
          <p className="text-lg text-app-muted">
            Trust is the currency of the modern internet. Yet, almost a third of all online reviews are artificially generated, destroying consumer confidence and brand reputation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-transparent border border-app-border p-8 rounded-3xl flex flex-col items-center text-center shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow"
            >
              <div className="bg-app-card border border-app-border backdrop-blur-md p-4 rounded-full border border-app-border shadow-[0_4px_20px_rgb(0,0,0,0.03)] mb-6">
                {stat.icon}
              </div>
              <h3 className="text-4xl font-extrabold text-app-text mb-2">{stat.value}</h3>
              <p className="text-sm font-medium text-app-muted opacity-70 uppercase tracking-wide">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
