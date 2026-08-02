import React from 'react';
import { motion } from 'framer-motion';
import { Chrome, Globe, Mic, Image, ShoppingCart, Code } from 'lucide-react';

export const FutureScope: React.FC = () => {
  const scope = [
    { title: "Browser Extension", icon: <Chrome className="w-6 h-6 text-violet-500" /> },
    { title: "Multilingual Support", icon: <Globe className="w-6 h-6 text-emerald-500" /> },
    { title: "Voice Reviews Analysis", icon: <Mic className="w-6 h-6 text-purple-500" /> },
    { title: "Image & Video Review Checking", icon: <Image className="w-6 h-6 text-rose-500" /> },
    { title: "AI Shopping Assistant", icon: <ShoppingCart className="w-6 h-6 text-amber-500" /> },
    { title: "Enterprise API", icon: <Code className="w-6 h-6 text-slate-700" /> }
  ];

  return (
    <section className="py-24 px-6 md:px-12 bg-app-card border border-app-border backdrop-blur-md">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-app-text tracking-tight mb-4">
            The Future of Trust
          </h2>
          <p className="text-app-muted text-lg max-w-2xl mx-auto">
            We are continuously evolving the TrustNet AI ecosystem to cover every vector of digital commerce.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {scope.map((s, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 border border-app-border rounded-2xl bg-transparent hover:bg-app-card border border-app-border backdrop-blur-md hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all group cursor-default"
            >
              <div className="bg-app-card border border-app-border backdrop-blur-md p-3 rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] inline-block mb-4 border border-app-border group-hover:scale-110 transition-transform">
                {s.icon}
              </div>
              <h3 className="font-semibold text-app-text">{s.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
