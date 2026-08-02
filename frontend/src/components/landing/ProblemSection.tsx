import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingDown, Users } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  const stats = [
    { label: 'Revenue Lost Annually', value: '$152B', icon: <TrendingDown className="w-6 h-6" />, color: '#EF4444', bg: '#FFF0F0', border: '#FECACA' },
    { label: 'Fake Reviews Online',   value: '30.4%', icon: <AlertTriangle className="w-6 h-6" />, color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
    { label: 'Consumers Misled',      value: '82%',   icon: <Users className="w-6 h-6" />,         color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
  ];

  return (
    <section
      className="py-24 px-6 md:px-12 relative"
      style={{ background: 'rgba(255,255,255,0.45)', backdropFilter: 'blur(8px)', borderTop: '1px solid rgba(180,140,60,0.15)', borderBottom: '1px solid rgba(180,140,60,0.15)' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6" style={{ color: '#1C0D00', fontFamily: "'Outfit', sans-serif" }}>
            The Fake Review Epidemic
          </h2>
          <p className="text-lg" style={{ color: '#5C3D11' }}>
            Trust is the currency of the modern internet. Yet, almost a third of all online reviews are artificially generated,
            destroying consumer confidence and brand reputation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl flex flex-col items-center text-center hover:-translate-y-1 transition-transform"
              style={{ background: stat.bg, border: `1.5px solid ${stat.border}` }}
            >
              <div
                className="p-4 rounded-2xl mb-6"
                style={{ background: 'rgba(255,255,255,0.8)', color: stat.color, border: `1px solid ${stat.border}` }}
              >
                {stat.icon}
              </div>
              <h3 className="text-4xl font-extrabold mb-2" style={{ color: stat.color }}>{stat.value}</h3>
              <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: '#5C3D11', opacity: 0.7 }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
