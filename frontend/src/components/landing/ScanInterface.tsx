import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Globe, Server, Phone, CreditCard, MessageSquare, QrCode, ArrowRight, Loader2, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SCAN_TYPES = [
  { id: 'url', icon: Link2, label: 'URL', placeholder: 'https://suspicious-link.com' },
  { id: 'domain', icon: Globe, label: 'Domain', placeholder: 'example-secure-login.com' },
  { id: 'ip', icon: Server, label: 'IP', placeholder: '192.168.1.1' },
  { id: 'phone', icon: Phone, label: 'Phone', placeholder: '+1 (555) 0123' },
  { id: 'upi', icon: CreditCard, label: 'UPI', placeholder: 'payment@bank' },
  { id: 'message', icon: MessageSquare, label: 'Message', placeholder: 'Paste suspicious message text...' },
  { id: 'qr', icon: QrCode, label: 'QR Code', placeholder: 'Upload QR image...' }
];

const SCAN_STAGES = [
  "CONNECTING TO TRUSTNET CORE...",
  "EXTRACTING FEATURES...",
  "ANALYZING SIGNALS...",
  "CHECKING THREAT INTELLIGENCE...",
  "GENERATING VERDICT..."
];

export const ScanInterface: React.FC = () => {
  const [activeType, setActiveType] = useState(SCAN_TYPES[0]);
  const [inputValue, setInputValue] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStage, setScanStage] = useState(0);
  const navigate = useNavigate();

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue) return;
    
    setIsScanning(true);
    let stage = 0;
    
    const interval = setInterval(() => {
      stage++;
      if (stage >= SCAN_STAGES.length) {
        clearInterval(interval);
        // Route to actual console, passing the input via state if needed, or just navigating
        navigate('/console/analysis');
      } else {
        setScanStage(stage);
      }
    }, 600);
  };

  return (
    <section className="relative w-full py-32 flex flex-col items-center">
      <div className="text-center mb-16 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Inspect Anything.</h2>
        <p className="text-gray-400 font-light">Interactive threat analysis. Start scanning now.</p>
      </div>

      <div className="w-full max-w-4xl mx-auto bg-black/40 border border-white/10 rounded-3xl backdrop-blur-xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        {/* Type Selector */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {SCAN_TYPES.map((type) => {
            const isActive = activeType.id === type.id;
            return (
              <button
                key={type.id}
                onClick={() => { setActiveType(type); setInputValue(''); setIsScanning(false); setScanStage(0); }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                  isActive 
                    ? 'bg-teal-500/20 text-teal-400 border border-teal-500/50' 
                    : 'bg-white/5 text-gray-500 border border-white/5 hover:bg-white/10 hover:text-app-text'
                }`}
              >
                <type.icon className="w-4 h-4" />
                {type.label}
              </button>
            );
          })}
        </div>

        {/* Input Area */}
        <div className="relative h-[200px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!isScanning ? (
              <motion.form
                key="input"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleScan}
                className="w-full max-w-2xl relative"
              >
                <div className="relative flex items-center">
                  <div className="absolute left-6 text-gray-500">
                    <activeType.icon className="w-6 h-6" />
                  </div>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={activeType.placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-16 pr-40 text-lg text-app-text placeholder-gray-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all font-mono"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue}
                    className="absolute right-3 bg-teal-500 text-app-btn-text px-6 py-3 rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-teal-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    Analyze <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="scanning"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full flex flex-col items-center justify-center"
              >
                <div className="w-24 h-24 relative flex items-center justify-center mb-8">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-2 border-t-teal-500 border-r-transparent border-b-teal-500/30 border-l-transparent rounded-full" />
                  <Search className="w-8 h-8 text-teal-500" />
                </div>
                
                <div className="h-6 overflow-hidden relative w-full text-center">
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={scanStage}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      className="text-sm font-mono tracking-widest text-teal-400 absolute w-full"
                    >
                      {SCAN_STAGES[scanStage]}
                    </motion.div>
                  </AnimatePresence>
                </div>
                
                {/* Progress bar */}
                <div className="w-64 h-1 bg-white/10 rounded-full mt-6 overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: `${((scanStage + 1) / SCAN_STAGES.length) * 100}%` }}
                    className="h-full bg-teal-500 shadow-[0_0_10px_#2dd4bf]"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};
