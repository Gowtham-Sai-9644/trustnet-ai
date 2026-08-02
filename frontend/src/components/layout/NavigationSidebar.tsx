import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
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
    { name: 'Threat Analysis', path: '/console/analysis', icon: ShieldAlert, desc: 'Scan & detect threats' },
    { name: 'Investigation Room', path: '/console/investigations', icon: FolderOpen, desc: 'Deep-dive cases' },
    { name: 'Research Center', path: '/console/research', icon: BarChart3, desc: 'IEEE papers & models' },
    { name: 'Incident Reports', path: '/console/reports', icon: FileText, desc: 'Logged incident history' },
    { name: 'AI Analyst Assistant', path: '/console/assistant', icon: MessageSquareCode, desc: 'Ask the AI analyst' },
    { name: 'Governance & Audit', path: '/console/viva', icon: Award, desc: 'Compliance & assurance' },
    { name: 'Settings', path: '/console/settings', icon: Settings, desc: 'System configuration' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 backdrop-blur-sm z-40 md:hidden"
          style={{ background: 'rgba(5,8,17,0.85)' }}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50 flex flex-col h-screen select-none transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-[72px]' : 'w-64'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{
          background: 'var(--theme-surface, #0E1726)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRight: '1px solid var(--theme-border, #1E293B)'
        }}
      >
        {/* Branding Header */}
        <div
          className={`p-5 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} transition-all flex-shrink-0`}
          style={{ borderBottom: '1px solid var(--theme-border, #1E293B)' }}
        >
          <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity group" onClick={onClose}>
            <div
              className="p-2 rounded-xl flex-shrink-0 transition-all group-hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, var(--theme-accent-start, #00E5FF), var(--theme-accent-end, #8B5CF6))',
                boxShadow: '0 0 16px color-mix(in srgb, var(--theme-accent-start, #00E5FF) 30%, transparent)'
              }}
            >
              <ShieldAlert className="w-4.5 h-4.5 text-white w-[18px] h-[18px]" />
            </div>
            {!isCollapsed && (
              <div className="text-left overflow-hidden">
                <h1
                  className="font-display font-extrabold text-sm tracking-tight truncate bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, var(--theme-accent-start, #00E5FF), var(--theme-accent-end, #8B5CF6))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  TrustNet AI
                </h1>
                <span className="text-[10px] font-mono uppercase tracking-widest block truncate" style={{ color: 'var(--theme-text-muted, #94A3B8)' }}>
                  Cyber Intel OS
                </span>
              </div>
            )}
          </Link>
          
          <div className="flex items-center">
            <button 
              onClick={onToggleCollapse}
              className="hidden md:flex p-1.5 rounded-lg transition-all flex-shrink-0"
              style={{ color: 'var(--theme-text-muted)' }}
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--theme-border)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--theme-text)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--theme-text-muted)'; }}
            >
              {isCollapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            <button 
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg transition-all flex-shrink-0"
              style={{ color: 'var(--theme-accent-start)' }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Label */}
        {!isCollapsed && (
          <div className="px-5 pt-4 pb-1">
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] font-bold" style={{ color: 'var(--theme-text-muted)' }}>
              Navigation
            </span>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto overflow-x-hidden no-scrollbar">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              title={isCollapsed ? item.name : undefined}
              className={({ isActive }) =>
                `flex items-center transition-all duration-150 rounded-xl text-xs font-semibold group ${
                  isCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2.5'
                } ${isActive ? 'active-nav-item' : 'inactive-nav-item'}`
              }
              style={({ isActive }) => isActive ? {
                background: `linear-gradient(135deg, color-mix(in srgb, var(--theme-accent-start) 15%, transparent), color-mix(in srgb, var(--theme-accent-end) 10%, transparent))`,
                color: 'var(--theme-text)',
                borderLeft: isCollapsed ? 'none' : `2px solid var(--theme-accent-start)`,
                boxShadow: `inset 0 0 20px color-mix(in srgb, var(--theme-accent-start) 5%, transparent)`,
              } : {
                color: 'var(--theme-text-muted)',
                borderLeft: isCollapsed ? 'none' : '2px solid transparent'
              }}
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className="w-4 h-4 flex-shrink-0 transition-all duration-150"
                    style={{ color: isActive ? 'var(--theme-accent-start)' : undefined }}
                  />
                  {!isCollapsed && (
                    <div className="flex flex-col min-w-0">
                      <span className="truncate leading-tight">{item.name}</span>
                      {isActive && (
                        <span className="text-[9px] font-mono truncate" style={{ color: 'var(--theme-text-muted)' }}>
                          {item.desc}
                        </span>
                      )}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Gradient Divider */}
        <div className="mx-4 h-px" style={{ background: `linear-gradient(90deg, transparent, var(--theme-accent-start), transparent)`, opacity: 0.3 }} />

        {/* System status details */}
        {!isCollapsed && (
          <div
            className="p-4 font-mono text-[9px] space-y-2 flex-shrink-0 overflow-hidden"
            style={{ color: 'var(--theme-text-muted)' }}
          >
            <div className="text-[8px] uppercase tracking-widest font-bold mb-2" style={{ color: 'var(--theme-text-muted)', opacity: 0.6 }}>Live System Status</div>
            {[
              { icon: Database, label: 'PostgreSQL', status: 'ONLINE', ok: true },
              { icon: Network, label: 'Neo4j Graph', status: 'STABLE', ok: true },
              { icon: Cpu, label: 'Inference', status: 'V1-OK', ok: true },
            ].map(({ icon: Icon, label, status, ok }) => (
              <div key={label}
                className="flex items-center justify-between px-2 py-1.5 rounded-lg"
                style={{ background: 'color-mix(in srgb, var(--theme-border) 40%, transparent)', border: '1px solid var(--theme-border)' }}
              >
                <div className="flex items-center space-x-1.5">
                  <Icon className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--theme-text-muted)' }} />
                  <span className="truncate">{label}</span>
                </div>
                <span className={`font-bold ${ok ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>{status}</span>
              </div>
            ))}
          </div>
        )}

        {/* Version footer */}
        {!isCollapsed && (
          <div
            className="px-4 pb-4 text-[8px] font-mono flex items-center justify-between"
            style={{ color: 'var(--theme-text-muted)', opacity: 0.5 }}
          >
            <span>TrustNet v2.1.0</span>
            <span
              className="px-1.5 py-0.5 rounded text-[7px] font-bold"
              style={{ background: 'color-mix(in srgb, var(--theme-accent-start) 15%, transparent)', color: 'var(--theme-accent-start)' }}
            >
              BETA
            </span>
          </div>
        )}
      </aside>
    </>
  );
};

export default NavigationSidebar;
