import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Network, 
  BarChart3, 
  FileText, 
  MessageSquareCode, 
  Award, 
  Settings,
  Cpu,
  Database
} from 'lucide-react';

const NavigationSidebar: React.FC = () => {
  const menuItems = [
    { name: 'Mission Control', path: '/console', icon: LayoutDashboard },
    { name: 'Threat Analysis', path: '/console/analysis', icon: ShieldAlert },
    { name: 'Graph Intelligence', path: '/console/graph', icon: Network },
    { name: 'Research Center', path: '/console/research', icon: BarChart3 },
    { name: 'Incident Reports', path: '/console/reports', icon: FileText },
    { name: 'AI Analyst Assistant', path: '/console/assistant', icon: MessageSquareCode },
    { name: 'Governance & Audit', path: '/console/viva', icon: Award },
    { name: 'Settings', path: '/console/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0B1220] border-r border-[#1E293B] flex flex-col h-screen select-none relative z-20">
      {/* Branding Header */}
      <div className="p-6 border-b border-[#1E293B]">
        <Link to="/" className="flex items-center space-x-2.5 hover:opacity-85 transition-opacity group">
          <div className="bg-[#00E5FF]/10 p-1.5 rounded border border-[#00E5FF]/20 group-hover:border-[#00E5FF]/40 transition-colors">
            <ShieldAlert className="w-5 h-5 text-[#00E5FF]" />
          </div>
          <div className="text-left">
            <h1 className="font-sans font-bold text-sm tracking-tight text-slate-100">
              TrustNet AI
            </h1>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
              Cyber Intel OS
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2.5 border-l-2 transition-all duration-150 text-xs font-medium ${
                isActive
                  ? 'bg-[#1E293B] text-slate-100 border-[#00E5FF]'
                  : 'text-slate-400 hover:bg-[#1E293B]/40 hover:text-slate-200 border-transparent'
              }`
            }
          >
            <item.icon className="w-4 h-4" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* System status details */}
      <div className="p-4 border-t border-[#1E293B] bg-[#050811]/40 font-mono text-[9px] text-slate-500 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Database className="w-3 h-3 text-slate-500" />
            <span>POSTGRESQL</span>
          </div>
          <span className="text-[#22C55E] font-bold">ONLINE</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Network className="w-3 h-3 text-slate-500" />
            <span>NEO4J</span>
          </div>
          <span className="text-[#22C55E] font-bold">STABLE</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Cpu className="w-3 h-3 text-slate-500" />
            <span>INFERENCE</span>
          </div>
          <span className="text-[#22C55E] font-bold">V1-OK</span>
        </div>
      </div>
    </aside>
  );
};

export default NavigationSidebar;
