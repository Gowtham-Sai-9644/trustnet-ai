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
  Database,
  FolderOpen,
  ChevronLeft
} from 'lucide-react';

interface NavigationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NavigationSidebar: React.FC<NavigationSidebarProps> = ({ isOpen, onClose }) => {
  const menuItems = [
    { name: 'Mission Control', path: '/console', icon: LayoutDashboard },
    { name: 'Threat Analysis', path: '/console/analysis', icon: ShieldAlert },
    { name: 'Graph Intelligence', path: '/console/graph', icon: Network },
    { name: 'Investigation Room', path: '/console/investigations', icon: FolderOpen },
    { name: 'Research Center', path: '/console/research', icon: BarChart3 },
    { name: 'Incident Reports', path: '/console/reports', icon: FileText },
    { name: 'AI Analyst Assistant', path: '/console/assistant', icon: MessageSquareCode },
    { name: 'Governance & Audit', path: '/console/viva', icon: Award },
    { name: 'Settings', path: '/console/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#050811]/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#0B1220] border-r border-[#1E293B] flex flex-col h-screen select-none transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Branding Header */}
        <div className="p-6 border-b border-[#1E293B] flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5 hover:opacity-85 transition-opacity group" onClick={onClose}>
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
          <button 
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#1E293B] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
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
    </>
  );
};

export default NavigationSidebar;
