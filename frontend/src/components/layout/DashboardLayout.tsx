import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavigationSidebar from './NavigationSidebar';
import { Search } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';

const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const { systemHealth, fetchSystemHealth } = useAppStore();

  useEffect(() => {
    fetchSystemHealth();
    const interval = setInterval(fetchSystemHealth, 15000);
    return () => clearInterval(interval);
  }, [fetchSystemHealth]);
  
  // Resolve view title from active route
  const getPageTitle = (path: string) => {
    switch(path) {
      case '/console': return 'SecOps Command Cockpit';
      case '/console/analysis': return 'Threat Analysis Workspace';
      case '/console/graph': return 'Link Centrality Workspace';
      case '/console/research': return 'ML Observability & Model Registry';
      case '/console/reports': return 'Incident Intake Portal';
      case '/console/assistant': return 'AI Analyst Assistant';
      case '/console/viva': return 'Audit & Compliance Dashboard';
      case '/console/settings': return 'Configuration Cockpit';

      default: return 'TrustNet Console';
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#070B14] font-sans">
      {/* Left Sidebar */}
      <NavigationSidebar />

      {/* Main Area (Top Nav + Workspace Panel) */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navigation */}
        <header className="h-14 border-b border-[#1E293B] bg-[#0F172A] px-6 flex items-center justify-between z-10">
          <div className="flex items-center space-x-8">
            <h2 className="font-sans font-bold text-xs text-slate-100 uppercase tracking-tight min-w-[140px] text-left">
              {getPageTitle(location.pathname)}
            </h2>
            
            {/* Global Search Bar */}
            <div className="hidden md:flex items-center relative w-72">
              <Search className="absolute left-3 w-3.5 h-3.5 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search cases, URLs, phones, UPI IDs... (⌘K)" 
                className="w-full bg-[#070B14] border border-[#1E293B] rounded-xl pl-9 pr-8 py-1.5 text-[10px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4]/30 transition-all font-sans"
              />
              <div className="absolute right-2 px-1.5 py-0.5 rounded bg-[#1E293B] text-[8px] text-slate-500 font-mono select-none">
                ⌘K
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Live Health Status indicators */}
            <div className="hidden sm:flex items-center space-x-3 bg-[#111827] px-3 py-1.5 rounded-xl border border-[#1E293B] font-mono text-[9px] text-slate-400 select-none">
              <span className="text-[8px] uppercase tracking-wider text-slate-500 font-bold mr-1">Status:</span>
              <div className="flex items-center space-x-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${systemHealth ? (systemHealth.api ? 'bg-[#22C55E]' : 'bg-[#EF4444]') : 'bg-slate-500'}`} />
                <span className="text-slate-300">API</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${systemHealth ? (systemHealth.postgres ? 'bg-[#22C55E]' : 'bg-[#EF4444]') : 'bg-slate-500'}`} />
                <span className="text-slate-300">DB</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${systemHealth ? (systemHealth.neo4j ? 'bg-[#22C55E]' : 'bg-[#EF4444]') : 'bg-slate-500'}`} />
                <span className="text-slate-300">Graph</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${systemHealth ? (systemHealth.rag ? 'bg-[#22C55E]' : 'bg-[#EF4444]') : 'bg-slate-500'}`} />
                <span className="text-slate-300">RAG</span>
              </div>
            </div>
            
            {/* Operator Profile Card */}
            <div className="flex items-center space-x-2.5 border-l border-[#1E293B] pl-4">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80" 
                  alt="Gowtham Sai Profile Avatar" 
                  className="w-7 h-7 rounded-full object-cover border border-[#06B6D4]/40"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#22C55E] border border-[#070B14]" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-semibold text-slate-200 leading-tight">Gowtham Sai</span>
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider leading-none">AI Security Analyst</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Workspace Viewport */}
        <main className="flex-1 overflow-y-auto bg-[#070B14] p-6 relative">
          <div className="max-w-[1440px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
