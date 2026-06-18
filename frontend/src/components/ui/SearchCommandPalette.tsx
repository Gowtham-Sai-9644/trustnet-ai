import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Network, ShieldAlert, Cpu, Terminal, X, CornerDownLeft } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';

interface SearchCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchCommandPalette: React.FC<SearchCommandPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { setInputs } = useAppStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when palette opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle global key binds when open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredActions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredActions.length) % filteredActions.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        triggerAction(filteredActions[selectedIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, query, selectedIndex]);

  // Define static quick navigation paths
  const staticNavigations = [
    { label: 'Go to Mission Control Cockpit', path: '/console', icon: Cpu, type: 'NAV' },
    { label: 'Go to Graph Intelligence Workspace', path: '/console/graph', icon: Network, type: 'NAV' },
    { label: 'Go to Threat Analysis Console', path: '/console/analysis', icon: ShieldAlert, type: 'NAV' },
    { label: 'Go to Digital Fraud Analyst Assistant', path: '/console/assistant', icon: Terminal, type: 'NAV' }
  ];

  // Dynamic actions based on query input
  const getDynamicActions = () => {
    if (!query.trim()) return [];
    
    // Auto-detect type
    let indicatorType: 'url' | 'upi' | 'phone' | 'messageText' = 'url';
    if (query.includes('@')) indicatorType = 'upi';
    else if (/^\+?[0-9\s-]{8,15}$/.test(query)) indicatorType = 'phone';
    
    return [
      {
        label: `Search "${query}" as Entity (Graph Workspace)`,
        type: 'GRAPH_SEARCH',
        icon: Network,
        execute: () => {
          setInputs({ [indicatorType]: query });
          navigate('/console/graph');
        }
      },
      {
        label: `Analyze "${query}" as Threat (Threat Analyzer)`,
        type: 'THREAT_ANALYSIS',
        icon: ShieldAlert,
        execute: () => {
          setInputs({ [indicatorType]: query });
          navigate('/console/analysis');
        }
      }
    ];
  };

  const filteredActions = query.trim() 
    ? getDynamicActions() 
    : staticNavigations;

  const triggerAction = (action: any) => {
    if (!action) return;
    onClose();
    if (action.execute) {
      action.execute();
    } else if (action.path) {
      navigate(action.path);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#050811]/70 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className="w-full max-w-xl bg-[#0B1220] border border-[#1E293B] rounded-2xl shadow-2xl overflow-hidden relative z-10 flex flex-col font-sans"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3 border-b border-[#1E293B]">
              <Search className="w-4 h-4 text-slate-500 mr-3 flex-shrink-0" />
              <input 
                ref={inputRef}
                type="text" 
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Type indicator (UPI, Phone, URL) or select navigation..." 
                className="w-full bg-transparent border-none text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:ring-0"
              />
              <button 
                onClick={onClose}
                className="text-slate-500 hover:text-slate-300 transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Actions List */}
            <div className="max-h-64 overflow-y-auto p-2 space-y-1">
              {filteredActions.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs font-mono">
                  No matching operations discovered.
                </div>
              ) : (
                filteredActions.map((action, idx) => {
                  const isSelected = selectedIndex === idx;
                  const Icon = action.icon;
                  return (
                    <div 
                      key={idx}
                      onClick={() => triggerAction(action)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-[#1E293B] text-[#00E5FF]' 
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3 text-xs">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-[#00E5FF]' : 'text-slate-500'}`} />
                        <span className="font-medium tracking-tight text-[11px]">{action.label}</span>
                      </div>
                      
                      {isSelected && (
                        <div className="flex items-center space-x-1 text-[8px] font-mono text-slate-500 bg-[#050811] px-1.5 py-0.5 rounded border border-[#1E293B]">
                          <span>enter</span>
                          <CornerDownLeft className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-[#050811] px-4 py-2 border-t border-[#1E293B]/60 flex items-center justify-between text-[8px] font-mono text-slate-500">
              <div className="flex space-x-3">
                <span>↑↓ navigate</span>
                <span>↵ select</span>
                <span>esc close</span>
              </div>
              <span className="uppercase text-[#00E5FF]/60 font-bold">TrustNet AI Command Console</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SearchCommandPalette;
