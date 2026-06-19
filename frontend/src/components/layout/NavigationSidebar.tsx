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
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';

interface NavigationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const NavigationSidebar: React.FC<NavigationSidebarProps> = ({ isOpen, onClose, isCollapsed = false, onToggleCollapse }) => {
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
        fixed md:static inset-y-0 left-0 z-50 bg-[#0B1220] border-r border-[#1E293B] flex flex-col h-screen select-none transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-64'}
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Branding Header */}
        <div className={`p-6 border-b border-[#1E293B] flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} transition-all`}>
          <Link to="/" className="flex items-center space-x-2.5 hover:opacity-85 transition-opacity group" onClick={onClose}>
            <div className="bg-[#00E5FF]/10 p-1.5 rounded border border-[#00E5FF]/20 group-hover:border-[#00E5FF]/40 transition-colors flex-shrink-0">
              <ShieldAlert className="w-5 h-5 text-[#00E5FF]" />
            </div>
            {!isCollapsed && (
              <div className="text-left overflow-hidden">
                <h1 className="font-sans font-bold text-sm tracking-tight text-slate-100 truncate">
                  TrustNet AI
                </h1>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block truncate">
                  Cyber Intel OS
                </span>
              </div>
            )}
          </Link>
          
          <div className="flex items-center space-x-1">
            {/* Desktop Collapse Toggle */}
            <button 
              onClick={onToggleCollapse}
              className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E293B] transition-all flex-shrink-0"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>

            {/* Mobile Close Button */}
            <button 
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg text-[#00E5FF] hover:text-white hover:bg-[#1E293B] transition-all drop-shadow-[0_0_8px_rgba(0,229,255,0.8)] flex-shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto overflow-x-hidden no-scrollbar">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              title={isCollapsed ? item.name : undefined}
              className={({ isActive }) =>
                `flex items-center ${isCollapsed ? 'justify-center p-2.5 rounded-lg' : 'space-x-3 px-3 py-2.5 border-l-2'} transition-all duration-150 text-xs font-medium ${
                  isActive
                    ? `bg-[#1E293B] text-slate-100 ${isCollapsed ? 'border-none' : 'border-[#00E5FF]'}`
                    : `text-slate-400 hover:bg-[#1E293B]/40 hover:text-slate-200 ${isCollapsed ? 'border-none' : 'border-transparent'}`
                }`
              }
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* System status details */}
        {!isCollapsed && (
          <div className="p-4 border-t border-[#1E293B] bg-[#050811]/40 font-mono text-[9px] text-slate-500 space-y-2 flex-shrink-0 overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <Database className="w-3 h-3 text-slate-500 flex-shrink-0" />
                <span className="truncate">POSTGRESQL</span>
              </div>
              <span className="text-[#22C55E] font-bold flex-shrink-0">ONLINE</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <Network className="w-3 h-3 text-slate-500 flex-shrink-0" />
                <span className="truncate">NEO4J</span>
              </div>
              <span className="text-[#22C55E] font-bold flex-shrink-0">STABLE</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <Cpu className="w-3 h-3 text-slate-500 flex-shrink-0" />
                <span className="truncate">INFERENCE</span>
              </div>
              <span className="text-[#22C55E] font-bold flex-shrink-0">V1-OK</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default NavigationSidebar;
