import React from 'react';
import { Link, ScanSearch, ShieldCheck } from 'lucide-react';

export const HowToUse: React.FC = () => {
  return (
    <section className="py-24 px-6 md:px-12 w-full max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-landing-text mb-4">How it works.</h2>
        <p className="text-lg text-landing-muted max-w-2xl mx-auto">Verify any suspicious link, message, or image in three simple steps.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full relative">
        
        {/* Connecting Line */}
        <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-landing-border -translate-y-[60px] z-0" />

        {/* Step 1 */}
        <div className="flex flex-col items-center text-center p-8 bg-landing-card rounded-3xl border border-landing-border shadow-sm relative z-10 group hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20 group-hover:scale-110 transition-transform shadow-inner">
            <Link className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-landing-text mb-2">1. Input Data</h3>
          <p className="text-sm text-landing-muted leading-relaxed">Paste a URL, SMS message, email content, or upload a suspicious QR code.</p>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center text-center p-8 bg-landing-card rounded-3xl border border-landing-border shadow-sm relative z-10 group hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
          <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20 group-hover:scale-110 transition-transform shadow-inner">
            <ScanSearch className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-landing-text mb-2">2. AI Analysis</h3>
          <p className="text-sm text-landing-muted leading-relaxed">Our multi-modal engine dissects the content, checking lexical patterns and global threat databases.</p>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col items-center text-center p-8 bg-landing-card rounded-3xl border border-landing-border shadow-sm relative z-10 group hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
          <div className="w-16 h-16 bg-teal-500/10 rounded-2xl flex items-center justify-center mb-6 border border-teal-500/20 group-hover:scale-110 transition-transform shadow-inner">
            <ShieldCheck className="w-8 h-8 text-teal-600" />
          </div>
          <h3 className="text-xl font-bold text-landing-text mb-2">3. Trust Score</h3>
          <p className="text-sm text-landing-muted leading-relaxed">Get an instant, calibrated Trust Score with detailed evidence to make a safe decision.</p>
        </div>
      </div>
    </section>
  );
};
