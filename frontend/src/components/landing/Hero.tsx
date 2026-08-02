import React from 'react';
import { motion } from 'framer-motion';

/* ── Feed Items ── */
const FEED_ITEMS = [
  { id: 1, title: 'Fake Instagram Job', desc: 'Job offering scam detected', time: '10m ago', verified: true, alert: true, icon: '🕵️' },
  { id: 2, title: 'UPI Payment Scam', desc: 'Fake payment request', time: '18m ago', verified: true, alert: true, icon: '💸' },
  { id: 3, title: 'Phishing Website', desc: 'Credential harvesting site', time: '25m ago', verified: true, alert: true, icon: '🎣' },
  { id: 4, title: 'Fake Social Giveaway', desc: 'Prize scam detected', time: '32m ago', verified: true, alert: true, icon: '🎁' },
  { id: 5, title: 'Spam Call Campaign', desc: 'Robocall fraud detected', time: '45m ago', verified: true, alert: true, icon: '📞' },
];

/* ── Analytical Tools ── */
const ANALYTICAL_TOOLS = [
  { id: 1, title: 'Phishing Shield', desc: 'URL & Email Analysis', icon: '🛡️' },
  { id: 2, title: 'Scammer Trace', desc: 'Phone & Profile Origin', icon: '🕵️‍♂️' },
  { id: 3, title: 'Data Forgery Lab', desc: 'Job & Document Verification', icon: '📄' },
  { id: 4, title: 'Community Watch', desc: 'Real-time Reports', icon: '🌐' },
  { id: 5, title: 'Secure Social', desc: 'Profile Authenticity', icon: '✅' },
];



export const Hero: React.FC = () => {
  return (
    <section className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      
      {/* Background ambient accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-teal-100 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-amber-50 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10 flex flex-col items-center pt-48 md:pt-56">
        
        {/* ── Center: Title & Compass ── */}
        <div className="flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-6xl font-black text-landing-text tracking-tight mb-4">
            Deconstruct The Scam Web.<br/>
            <span className="text-landing-primary font-bold">Instantly verify with AI.</span>
          </h1>
          <p className="text-sm md:text-base text-landing-muted max-w-2xl mx-auto mb-16 font-medium">
            Analyze URLs, messages, QR codes, images and more.<br/>
            Powered by AI. Secured by Community.
          </p>
          
          {/* Dynamic Floating Image */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-full max-w-[500px] aspect-square flex items-center justify-center mx-auto"
          >
            <div className="absolute inset-0 bg-landing-primary/20 blur-[100px] rounded-full" />
            <img 
              src="/hero_ai_shield.jpg" 
              alt="AI Scam Detection Shield" 
              className="w-[80%] h-[80%] object-cover rounded-full shadow-2xl border-4 border-landing-border/50 relative z-10 mix-blend-screen"
            />
          </motion.div>
        </div>

      </div>
    </section>
  );
};
