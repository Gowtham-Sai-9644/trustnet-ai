import React from 'react';
import { motion } from 'framer-motion';

export const TrustedBy: React.FC = () => {
  const logos = [
    { name: 'Amazon', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
    { name: 'Shopify', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg' },
    { name: 'Walmart', url: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Walmart_logo.svg' },
    { name: 'eBay', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg' },
    { name: 'Stripe', url: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg' }
  ];

  return (
    <section className="py-12 border-b border-slate-200/50 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-8">
          Powering Review Integrity For Global Platforms
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {logos.map((logo, i) => (
            <motion.img 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              src={logo.url} 
              alt={`${logo.name} logo`} 
              className="h-6 md:h-8 object-contain hover:scale-105 transition-transform cursor-pointer"
            />
          ))}
        </div>
      </div>
    </section>
  );
};
